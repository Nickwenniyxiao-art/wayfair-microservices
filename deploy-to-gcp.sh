#!/bin/bash

# Wayfair Microservices - GCP Deployment Script
# This script deploys all microservices to Google Cloud Platform

set -e

# Configuration
PROJECT_ID="cohesive-poetry-486213-q3"
REGION="us-central1"
SERVICES=(
  "api-gateway"
  "product-service"
  "user-service"
  "cart-service"
  "order-service"
  "payment-service"
  "shipping-service"
  "return-service"
)

echo "🚀 Starting Wayfair Microservices Deployment to GCP"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"

# Step 1: Set GCP Project
echo "📝 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Step 2: Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  sql.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com

# Step 3: Create Cloud Storage bucket for assets
echo "📦 Creating Cloud Storage bucket..."
BUCKET_NAME="${PROJECT_ID}-wayfair-assets"
if ! gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
  gsutil mb -l $REGION gs://$BUCKET_NAME
  echo "✅ Bucket created: gs://$BUCKET_NAME"
else
  echo "✅ Bucket already exists: gs://$BUCKET_NAME"
fi

# Step 4: Build and push Docker images
echo "🐳 Building and pushing Docker images..."

# API Gateway
echo "Building API Gateway..."
docker build -t gcr.io/$PROJECT_ID/wayfair-api-gateway:latest ./api-gateway
docker push gcr.io/$PROJECT_ID/wayfair-api-gateway:latest

# Microservices
for service in "${SERVICES[@]:1}"; do
  echo "Building $service..."
  docker build -t gcr.io/$PROJECT_ID/wayfair-${service}:latest ./services/${service}
  docker push gcr.io/$PROJECT_ID/wayfair-${service}:latest
done

# Step 5: Deploy API Gateway to Cloud Run
echo "🚀 Deploying API Gateway to Cloud Run..."
gcloud run deploy wayfair-api-gateway \
  --image gcr.io/$PROJECT_ID/wayfair-api-gateway:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --set-env-vars PROJECT_ID=$PROJECT_ID

# Step 6: Deploy Microservices to Cloud Run
echo "🚀 Deploying microservices to Cloud Run..."

# Product Service
gcloud run deploy wayfair-product-service \
  --image gcr.io/$PROJECT_ID/wayfair-product-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# User Service
gcloud run deploy wayfair-user-service \
  --image gcr.io/$PROJECT_ID/wayfair-user-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Cart Service
gcloud run deploy wayfair-cart-service \
  --image gcr.io/$PROJECT_ID/wayfair-cart-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Order Service
gcloud run deploy wayfair-order-service \
  --image gcr.io/$PROJECT_ID/wayfair-order-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Payment Service
gcloud run deploy wayfair-payment-service \
  --image gcr.io/$PROJECT_ID/wayfair-payment-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Shipping Service
gcloud run deploy wayfair-shipping-service \
  --image gcr.io/$PROJECT_ID/wayfair-shipping-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Return Service
gcloud run deploy wayfair-return-service \
  --image gcr.io/$PROJECT_ID/wayfair-return-service:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600

# Step 7: Display deployment summary
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📋 Deployed Services:"
echo "  - API Gateway: https://wayfair-api-gateway-${REGION}.a.run.app"
echo "  - Product Service: https://wayfair-product-service-${REGION}.a.run.app"
echo "  - User Service: https://wayfair-user-service-${REGION}.a.run.app"
echo "  - Cart Service: https://wayfair-cart-service-${REGION}.a.run.app"
echo "  - Order Service: https://wayfair-order-service-${REGION}.a.run.app"
echo "  - Payment Service: https://wayfair-payment-service-${REGION}.a.run.app"
echo "  - Shipping Service: https://wayfair-shipping-service-${REGION}.a.run.app"
echo "  - Return Service: https://wayfair-return-service-${REGION}.a.run.app"
echo ""
echo "📦 Cloud Storage Bucket: gs://$BUCKET_NAME"
echo ""
echo "🔗 View all services:"
echo "  gcloud run services list --region=$REGION"
