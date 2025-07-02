#!/bin/bash
set -euxo pipefail

# === CONFIGURATION ===
APP_DIR="/var/www/app"
S3_BUCKET="massri-url-shortener-deployment"
SECRET_ARN='arn:aws:secretsmanager:us-east-1:050752607919:secret:rds!cluster-ef8bd275-4ff0-43aa-874b-a57441e215f4-fdto1U'

echo "Starting user-data script..."

# === UPDATE & INSTALL DEPENDENCIES ===
echo "Updating package lists and installing dependencies..."
sudo apt update -y -qq
sudo apt install -y -qq \
    unzip nginx \
    jq curl gnupg software-properties-common

curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install > /dev/null

# === INSTALL PHP 8.4 ===
echo "Adding PHP 8.4 repository and installing PHP 8.4..."
sudo add-apt-repository ppa:ondrej/php -y > /dev/null
sudo apt update -y -qq
sudo apt install -y -qq php8.4 php8.4-cli php8.4-fpm php8.4-mbstring php8.4-xml php8.4-curl php8.4-bcmath php8.4-pgsql php8.4-zip

# Update alternatives to use PHP 8.4 by default
sudo update-alternatives --set php /usr/bin/php8.4 > /dev/null

# === INSTALL NODE.JS ===
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - > /dev/null
sudo apt-get install -y -qq nodejs

# === INSTALL COMPOSER ===
sudo php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer > /dev/null
sudo rm composer-setup.php

# === FETCH & EXPORT SECRETS ===
echo "Fetching secrets from AWS Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_ARN" --query SecretString --output text)
DB_PASSWORD=$(echo "$SECRET_JSON" | jq -r '.password')

# === SET UP APP DIRECTORY ===
echo "Creating and moving to app directory: $APP_DIR"
sudo mkdir -p "$APP_DIR"
cd "$APP_DIR"

# === CLEAN AND DEPLOY CODE ===
echo "Fetching latest deployment package from S3..."
S3_KEY=$(aws s3api list-objects-v2 --bucket "$S3_BUCKET" --query 'reverse(sort_by(Contents, &LastModified))[0].Key' --output text)
sudo aws s3 cp "s3://${S3_BUCKET}/${S3_KEY}" ./app.zip > /dev/null
echo "Unzipping app.zip..."
sudo unzip -oq app.zip
sudo rm app.zip

# === FILE PERMISSIONS ===
echo "Setting file permissions..."
sudo mkdir -p "$APP_DIR/storage/logs"
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"

# === FETCH .ENV FILE FROM S3 ===
echo "Fetching .env file from S3..."
sudo aws s3 cp "s3://${S3_BUCKET}/.env" "$APP_DIR/.env" > /dev/null
sudo chown www-data:www-data "$APP_DIR/.env"
sudo chmod 700 "$APP_DIR/.env"
echo "DB_PASSWORD=${DB_PASSWORD}" | sudo tee -a "$APP_DIR/.env" > /dev/null

# === LOAD ENV AND REBUILD CONFIG ===

echo "Creating storage/logs directory..."
sudo mkdir -p "$APP_DIR/storage/logs"
sudo chown -R www-data:www-data "$APP_DIR/storage"
sudo chmod -R 755 "$APP_DIR/storage"

echo "Clearing and caching Laravel config, routes, and views..."
sudo php artisan config:clear > /dev/null
sudo php artisan config:cache > /dev/null
sudo php artisan route:cache > /dev/null
sudo php artisan view:cache > /dev/null

echo "Running Laravel migrations and seeders..."
sudo php artisan migrate --force > /dev/null

# === CONFIGURE NGINX ===
echo "Copying Laravel Nginx config..."
sudo cp "$APP_DIR/scripts/laravel.conf" /etc/nginx/sites-available/laravel.conf
sudo ln -sf /etc/nginx/sites-available/laravel.conf /etc/nginx/sites-enabled/laravel.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "User-data script completed."
