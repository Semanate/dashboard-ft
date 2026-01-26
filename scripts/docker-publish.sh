#!/bin/bash
set -e

IMAGE="hkevinhbussiness/dashboard-ft"
TAG=$(git rev-parse --short HEAD)

echo "📁 Working directory:"
pwd

echo "📄 Checking Dockerfile..."
ls -la prod.Dockerfile

echo "🔨 Building image..."

docker build \
  -f prod.Dockerfile \
  -t "$IMAGE:$TAG" \
  -t "$IMAGE:latest" \
  .

echo "📤 Pushing image..."
docker push "$IMAGE:$TAG"
docker push "$IMAGE:latest"

echo "✅ Done"
