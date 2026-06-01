#!/usr/bin/env bash
# setup-ecr.sh — Cria os 5 repositórios ECR e configura lifecycle policies.
#
# Executar UMA VEZ antes do primeiro deploy ECR-based.
# Pré-requisitos:
#   - AWS CLI configurado (aws configure ou env vars)
#   - Permissões: ecr:CreateRepository, ecr:PutLifecyclePolicy,
#                 iam:AttachRolePolicy (para step de IAM abaixo)
#
# Uso:
#   EC2_ROLE_NAME=cerebro-amigo-ec2-role bash infra/aws/setup-ecr.sh

set -euo pipefail

AWS_REGION="sa-east-1"
AWS_ACCOUNT_ID="004177894935"
ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
EC2_ROLE_NAME="${EC2_ROLE_NAME:-cerebro-amigo-ec2-role}"

SERVICES=(
  "cerebro-amigo/web"
  "cerebro-amigo/api-gateway"
  "cerebro-amigo/orchestrator-py"
  "cerebro-amigo/agents-py"
  "cerebro-amigo/notifier-py"
)

# Lifecycle policy: manter as 10 imagens mais recentes por push.
# Imagens mais antigas são expiradas automaticamente, liberando espaço.
LIFECYCLE_POLICY='{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Manter ultimas 10 imagens por push (rollback ate 10 deploys)",
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": [""],
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    },
    {
      "rulePriority": 2,
      "description": "Expirar imagens sem tag apos 1 dia",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 1
      },
      "action": { "type": "expire" }
    }
  ]
}'

echo "=== Criando repositórios ECR em ${AWS_REGION} ==="

for repo in "${SERVICES[@]}"; do
  echo -n "  $repo ... "
  if aws ecr describe-repositories \
      --repository-names "$repo" \
      --region "$AWS_REGION" \
      --output text 2>/dev/null | grep -q "$repo"; then
    echo "já existe"
  else
    aws ecr create-repository \
      --repository-name "$repo" \
      --region "$AWS_REGION" \
      --image-scanning-configuration scanOnPush=true \
      --encryption-configuration encryptionType=AES256 \
      --output text > /dev/null
    echo "criado"
  fi

  aws ecr put-lifecycle-policy \
    --repository-name "$repo" \
    --region "$AWS_REGION" \
    --lifecycle-policy-text "$LIFECYCLE_POLICY" \
    --output text > /dev/null
  echo "    lifecycle policy aplicada"
done

echo ""
echo "=== Configurando permissões ECR pull na IAM role da EC2 ==="
echo "  Role: $EC2_ROLE_NAME"

# Política de pull para a EC2 (somente leitura — não precisa de push)
ECR_PULL_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRPull",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
EOF
)

POLICY_NAME="CerebroAmigoECRPull"
POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

# Cria ou atualiza a policy
if aws iam get-policy --policy-arn "$POLICY_ARN" 2>/dev/null | grep -q "$POLICY_NAME"; then
  echo "  Policy $POLICY_NAME já existe — verificar se está attachada ao role"
else
  aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document "$ECR_PULL_POLICY" \
    --output text > /dev/null
  echo "  Policy $POLICY_NAME criada"
fi

aws iam attach-role-policy \
  --role-name "$EC2_ROLE_NAME" \
  --policy-arn "$POLICY_ARN" 2>/dev/null || true
echo "  Policy attachada ao role $EC2_ROLE_NAME"

echo ""
echo "=== Permissões necessárias para o CI (secrets AWS_ACCESS_KEY_ID/SECRET) ==="
echo ""
echo "  O usuário/role do CI precisa de:"
echo "    ecr:GetAuthorizationToken"
echo "    ecr:BatchCheckLayerAvailability"
echo "    ecr:GetDownloadUrlForLayer"
echo "    ecr:BatchGetImage"
echo "    ecr:PutImage"
echo "    ecr:InitiateLayerUpload"
echo "    ecr:UploadLayerPart"
echo "    ecr:CompleteLayerUpload"
echo "  Resource: arn:aws:ecr:sa-east-1:${AWS_ACCOUNT_ID}:repository/cerebro-amigo/*"
echo "  + ecr:GetAuthorizationToken  Resource: *"

echo ""
echo "=== Smoke test: login no ECR ==="
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_BASE" \
  && echo "  Login ECR OK" \
  || echo "  AVISO: login ECR falhou — verificar credenciais/role"

echo ""
echo "=== Setup concluído ==="
echo ""
echo "URLs dos repositórios:"
for repo in "${SERVICES[@]}"; do
  svc="${repo#cerebro-amigo/}"
  echo "  $svc  →  ${ECR_BASE}/${repo}"
done
echo ""
echo "Próximo passo: faça um push na branch main para acionar o primeiro deploy."
echo ""
echo "─── ROLLBACK ───────────────────────────────────────────────────────────"
echo ""
echo "Para reverter para um SHA anterior:"
echo ""
echo "  1. Conecte na EC2 via SSM ou Session Manager"
echo "  2. Execute:"
echo ""
echo "     export IMAGE_TAG=<sha-anterior>"
echo "     aws ecr get-login-password --region sa-east-1 \\"
echo "       | docker login --username AWS --password-stdin ${ECR_BASE}"
echo "     cd /opt/cerebro-amigo-v3"
echo "     git checkout <sha-anterior> -- docker-compose.yml"
echo "     docker compose pull"
echo "     docker compose up -d --remove-orphans"
echo ""
echo "  Os SHAs disponíveis ficam nas tags do ECR:"
echo "     aws ecr list-images --repository-name cerebro-amigo/orchestrator-py --region sa-east-1"
echo ""
