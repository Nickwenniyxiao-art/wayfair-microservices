#!/bin/bash
set -e

PROJECT_ID="cohesive-poetry-486213-q3"
CLUSTER_NAME="wayfair-microservices-cluster"
REGION="us-central1"
ZONE="us-central1-a"

echo "Creating GKE cluster: $CLUSTER_NAME"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Zone: $ZONE"

# Note: This script is for reference. The actual cluster creation should be done via Google Cloud Console
# or using gcloud CLI if it's installed.

cat << 'GCLOUD_CMD'
gcloud container clusters create wayfair-microservices-cluster \
  --project=cohesive-poetry-486213-q3 \
  --region=us-central1 \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --enable-autorepair \
  --enable-autoupgrade \
  --enable-stackdriver-kubernetes \
  --addons=HttpLoadBalancing,HorizontalPodAutoscaling \
  --workload-pool=cohesive-poetry-486213-q3.svc.id.goog
GCLOUD_CMD

