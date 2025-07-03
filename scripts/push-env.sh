#!/bin/bash

# Variables
LOCAL_ENV_FILE=".env.production"
S3_BUCKET="s3://massri-url-shortener-deployment/.env"

# Check if .env.production exists
if [[ ! -f "$LOCAL_ENV_FILE" ]]; then
    echo "Error: $LOCAL_ENV_FILE does not exist."
    exit 1
fi

# Copy .env.production to S3 as .env
aws s3 cp "$LOCAL_ENV_FILE" "$S3_BUCKET"

if [[ $? -eq 0 ]]; then
    echo "Successfully pushed $LOCAL_ENV_FILE to $S3_BUCKET"
else
    echo "Failed to push $LOCAL_ENV_FILE to $S3_BUCKET"
    exit 1
fi
