# Wayfair Microservices - GCP Deployment Guide

This guide explains how to deploy the Wayfair Clone microservices architecture to Google Cloud Platform.

## Prerequisites

- Google Cloud Project: `cohesive-poetry-486213-q3`
- gcloud CLI installed and configured
- Docker installed locally
- GitHub account with access to your repository

## Deployment Steps

### Step 1: Set Up GCP Project

```bash
# Set your project ID
export PROJECT_ID="cohesive-poetry-486213-q3"
export REGION="us-central1"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  sql.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com
```

### Step 2: Push Code to GitHub

```bash
# Navigate to the project directory
cd /home/ubuntu/wayfair-microservices

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Wayfair microservices architecture"

# Add remote repository
git remote add origin https://github.com/Nickwenniyxiao-art/wayfair-microservices.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Set Up Cloud Build

```bash
# Create a Cloud Build trigger
gcloud builds triggers create github \
  --repo-name=wayfair-microservices \
  --repo-owner=Nickwenniyxiao-art \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --name="wayfair-microservices-deploy"
```

### Step 4: Deploy Using the Script

```bash
# Make the script executable
chmod +x deploy-to-gcp.sh

# Run the deployment script
./deploy-to-gcp.sh
```

Or deploy manually:

```bash
# Build and push Docker images
docker build -t gcr.io/$PROJECT_ID/wayfair-api-gateway:latest ./api-gateway
docker push gcr.io/$PROJECT_ID/wayfair-api-gateway:latest

# Deploy to Cloud Run
gcloud run deploy wayfair-api-gateway \
  --image gcr.io/$PROJECT_ID/wayfair-api-gateway:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2
```

### Step 5: Configure Cloud SQL

```bash
# Create Cloud SQL instance (if not already created)
gcloud sql instances create wayfair-clone-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=$REGION

# Create database
gcloud sql databases create wayfair \
  --instance=wayfair-clone-db

# Create user
gcloud sql users create wayfair-user \
  --instance=wayfair-clone-db \
  --password=YOUR_PASSWORD
```

### Step 6: Set Up Cloud Storage

```bash
# Create storage bucket
gsutil mb -l $REGION gs://$PROJECT_ID-wayfair-assets

# Enable public access
gsutil iam ch allUsers:objectViewer gs://$PROJECT_ID-wayfair-assets
```

### Step 7: Configure Environment Variables

Set environment variables in Cloud Run:

```bash
gcloud run deploy wayfair-api-gateway \
  --update-env-vars \
  DATABASE_URL="mysql://user:password@/dbname?unix_socket=/cloudsql/INSTANCE_CONNECTION_NAME" \
  --region $REGION
```

## Deployment Architecture

### Services Deployed

1. **API Gateway** - Main entry point for all requests
2. **Product Service** - Product management and catalog
3. **User Service** - User management and authentication
4. **Cart Service** - Shopping cart management
5. **Order Service** - Order processing and tracking
6. **Payment Service** - Payment processing with Stripe
7. **Shipping Service** - Shipping and delivery management
8. **Return Service** - Return and refund processing

### Cloud Resources

- **Cloud Run** - Serverless compute for microservices
- **Cloud SQL** - MySQL database for persistent storage
- **Cloud Storage** - Object storage for assets
- **Cloud Build** - CI/CD pipeline for automated deployments
- **Container Registry** - Docker image storage

## Monitoring and Logging

### View Service Status

```bash
# List all deployed services
gcloud run services list --region=$REGION

# View specific service details
gcloud run services describe wayfair-api-gateway --region=$REGION
```

### View Logs

```bash
# View recent logs
gcloud run services logs read wayfair-api-gateway --region=$REGION --limit 50

# View logs with filtering
gcloud run services logs read wayfair-api-gateway \
  --region=$REGION \
  --limit 100 \
  --format='json'
```

### View Build History

```bash
# List recent builds
gcloud builds list

# View specific build logs
gcloud builds log BUILD_ID
```

## Troubleshooting

### Build Failures

If the build fails, check the logs:

```bash
gcloud builds log BUILD_ID --stream
```

Common issues:
- Missing dependencies in package.json
- Incorrect Dockerfile syntax
- Missing environment variables

### Deployment Issues

If deployment fails:

```bash
# Check service status
gcloud run services describe SERVICE_NAME --region=$REGION

# View error logs
gcloud run services logs read SERVICE_NAME --region=$REGION --limit 100
```

### Database Connection Issues

Ensure:
- Cloud SQL Proxy is configured correctly
- Database user and password are correct
- Cloud Run service has Cloud SQL client role

## Cost Optimization

- Use Cloud Run's pay-per-use pricing model
- Configure appropriate memory and CPU limits
- Use Cloud SQL's shared-core instances for development
- Enable Cloud CDN to reduce bandwidth costs
- Use Cloud Storage lifecycle policies for old assets

## Security Best Practices

- Use Cloud IAM roles for access control
- Enable VPC Service Controls for network security
- Use Cloud Secret Manager for sensitive data
- Enable Cloud Armor for DDoS protection
- Use HTTPS only (enforced by Cloud Run)
- Regularly update dependencies and security patches

## Next Steps

1. Configure custom domain names
2. Set up Cloud Load Balancer
3. Enable Cloud Monitoring and Alerting
4. Set up automated backups for Cloud SQL
5. Configure Cloud CDN for static assets
