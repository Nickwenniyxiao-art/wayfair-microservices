#!/bin/bash
set -e

echo "=========================================="
echo "修复 gke-deploy 权限问题"
echo "=========================================="
echo ""

# 配置变量
PROJECT_ID="cohesive-poetry-486213-q3"
CLUSTER_NAME="wayfair-microservices-cluster"
CLUSTER_REGION="us-central1"

echo "📋 配置信息："
echo "  项目 ID: $PROJECT_ID"
echo "  集群名称: $CLUSTER_NAME"
echo "  区域: $CLUSTER_REGION"
echo ""

# 第一步：获取 Cloud Build 服务账户
echo "第一步：获取 Cloud Build 服务账户..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
echo "✅ Cloud Build 服务账户: $CLOUDBUILD_SA"
echo ""

# 第二步：为 Cloud Build 服务账户授予 IAM 角色
echo "第二步：为 Cloud Build 服务账户授予 IAM 角色..."

echo "  - 授予 container.developer 角色..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$CLOUDBUILD_SA \
  --role=roles/container.developer \
  --quiet 2>/dev/null || echo "    (角色可能已存在)"

echo "  - 授予 container.admin 角色..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$CLOUDBUILD_SA \
  --role=roles/container.admin \
  --quiet 2>/dev/null || echo "    (角色可能已存在)"

echo "✅ IAM 角色已授予"
echo ""

# 第三步：获取集群凭据
echo "第三步：获取集群凭据..."
gcloud container clusters get-credentials $CLUSTER_NAME \
  --region $CLUSTER_REGION \
  --project $PROJECT_ID
echo "✅ 集群凭据已获取"
echo ""

# 第四步：创建 Kubernetes 服务账户
echo "第四步：创建 Kubernetes 服务账户..."
kubectl create serviceaccount cloudbuild-sa -n default 2>/dev/null || echo "  (服务账户已存在)"
echo "✅ Kubernetes 服务账户已创建"
echo ""

# 第五步：创建 ClusterRoleBinding
echo "第五步：创建 ClusterRoleBinding..."
kubectl create clusterrolebinding cloudbuild-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=default:cloudbuild-sa 2>/dev/null || echo "  (ClusterRoleBinding 已存在)"
echo "✅ ClusterRoleBinding 已创建"
echo ""

# 第六步：验证配置
echo "第六步：验证配置..."
echo ""
echo "  IAM 角色验证："
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:$CLOUDBUILD_SA" \
  --format="table(bindings.role)" | head -5

echo ""
echo "  Kubernetes ServiceAccount 验证："
kubectl get serviceaccount cloudbuild-sa -n default

echo ""
echo "  Kubernetes ClusterRoleBinding 验证："
kubectl get clusterrolebinding cloudbuild-admin

echo ""
echo "=========================================="
echo "✅ 所有权限配置已完成！"
echo "=========================================="
echo ""
echo "后续步骤："
echo "1. 恢复 cloudbuild.yaml 中的 gke-deploy 配置"
echo "2. 提交更改到 GitHub"
echo "3. Cloud Build 会自动触发新的构建"
echo ""
