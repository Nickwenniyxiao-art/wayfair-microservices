# 修复 gke-deploy 权限问题 - 完整指南

## 问题分析

Cloud Build 中的 gke-deploy 失败，错误信息：
```
ERROR: (gcloud container clusters.get-credentials) ResponseError: code=403
```

原因：Cloud Build 服务账户没有足够的权限访问 GKE 集群。

## 解决方案

### 第一步：获取 Cloud Build 服务账户

```bash
PROJECT_ID="cohesive-poetry-486213-q3"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "Cloud Build Service Account: $CLOUDBUILD_SA"
```

### 第二步：为 Cloud Build 服务账户授予 IAM 角色

```bash
# 授予 Kubernetes Engine Developer 角色
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$CLOUDBUILD_SA \
  --role=roles/container.developer \
  --quiet

# 授予 Kubernetes Engine Admin 角色（可选，如果需要更多权限）
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$CLOUDBUILD_SA \
  --role=roles/container.admin \
  --quiet
```

### 第三步：配置 Kubernetes RBAC

```bash
# 获取集群凭据
gcloud container clusters get-credentials wayfair-microservices-cluster \
  --region us-central1 \
  --project $PROJECT_ID

# 创建 Kubernetes 服务账户
kubectl create serviceaccount cloudbuild-sa -n default

# 创建 ClusterRoleBinding
kubectl create clusterrolebinding cloudbuild-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=default:cloudbuild-sa
```

### 第四步：恢复 cloudbuild.yaml 中的 gke-deploy 配置

将以下配置添加到 `cloudbuild.yaml` 的第 17 步：

```yaml
# Step 17: Deploy to GKE using gke-deploy
- name: 'gcr.io/cloud-builders/gke-deploy'
  args:
    - run
    - '--filename=kubernetes/'
    - '--image=$_IMAGE'
    - '--location=us-central1'
    - '--cluster=wayfair-microservices-cluster'
  env:
    - 'CLOUDSDK_COMPUTE_REGION=us-central1'
    - 'CLOUDSDK_CONTAINER_CLUSTER=wayfair-microservices-cluster'
```

或者使用更简单的配置：

```yaml
# Step 17: Deploy to GKE using gke-deploy
- name: 'gcr.io/cloud-builders/gke-deploy'
  args:
    - run
    - '--filename=kubernetes/'
    - '--image=$_IMAGE'
    - '--location=us-central1'
    - '--cluster=wayfair-microservices-cluster'
```

### 第五步：更新 cloudbuild.yaml 中的 substitutions（如果需要）

```yaml
substitutions:
  _IMAGE: 'gcr.io/$PROJECT_ID/wayfair'
  _CLUSTER_NAME: 'wayfair-microservices-cluster'
  _CLUSTER_ZONE: 'us-central1'
```

### 第六步：提交更改并触发新的构建

```bash
cd ~/wayfair-microservices

# 恢复 gke-deploy 配置
git checkout cloudbuild.yaml  # 如果之前修改过

# 或者手动编辑 cloudbuild.yaml，将 kubectl 改回 gke-deploy

# 提交更改
git add cloudbuild.yaml
git commit -m "Restore: Use gke-deploy with proper IAM and RBAC configuration"

# 推送到 GitHub
git push origin main
```

## 验证

### 检查 IAM 角色

```bash
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:$CLOUDBUILD_SA"
```

### 检查 Kubernetes RBAC

```bash
# 查看 ServiceAccount
kubectl get serviceaccount cloudbuild-sa -n default

# 查看 ClusterRoleBinding
kubectl get clusterrolebinding cloudbuild-admin

# 查看 ClusterRole
kubectl get clusterrole cluster-admin
```

### 检查构建日志

```bash
gcloud builds log <BUILD_ID> --project=$PROJECT_ID
```

## gke-deploy 的高级功能

使用 gke-deploy 后，您可以利用以下高级功能：

### 1. Canary 部署

```yaml
apiVersion: v1
kind: Service
metadata:
  name: wayfair-api-gateway
spec:
  selector:
    app: wayfair-api-gateway
  ports:
    - port: 80
      targetPort: 3000
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wayfair-api-gateway
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: wayfair-api-gateway
  template:
    metadata:
      labels:
        app: wayfair-api-gateway
    spec:
      containers:
      - name: wayfair-api-gateway
        image: us-central1-docker.pkg.dev/cohesive-poetry-486213-q3/wayfair/wayfair-api-gateway:latest
        ports:
        - containerPort: 3000
```

### 2. 自动回滚

gke-deploy 会自动检测部署失败并回滚到上一个版本。

### 3. 部署验证

gke-deploy 会验证：
- YAML 语法
- 资源配额
- 镜像存在性
- 权限

## 常见问题

### Q: 为什么 gke-deploy 仍然失败？

A: 检查以下几点：
1. Cloud Build 服务账户是否有 `container.developer` 角色
2. Kubernetes 集群中是否创建了 ServiceAccount 和 ClusterRoleBinding
3. 集群是否处于运行状态

### Q: 如何调试 gke-deploy 错误？

A: 查看 Cloud Build 日志：
```bash
gcloud builds log <BUILD_ID> --stream
```

### Q: 可以同时使用 kubectl 和 gke-deploy 吗？

A: 可以，但建议选择其中一种。如果需要两者的功能，考虑使用 Helm 或 Kustomize。

## 参考资源

- [gke-deploy 文档](https://cloud.google.com/build/docs/deploying-builds/deploy-gke)
- [Cloud Build IAM 角色](https://cloud.google.com/build/docs/iam-roles-permissions)
- [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
