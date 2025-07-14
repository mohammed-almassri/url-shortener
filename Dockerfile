FROM composer:2 AS composer

FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng \
    libjpeg-turbo \
    libzip-dev \
    postgresql-dev \
    oniguruma-dev \
    icu-dev \
    zlib-dev \
    libxml2-dev \
    git \
    unzip \
    supervisor \
    autoconf g++ make \
    nodejs npm \
    && pecl install redis \
    && docker-php-ext-enable redis

RUN docker-php-ext-install pdo pdo_pgsql zip intl mbstring xml

COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

COPY conf/nginx.conf /etc/nginx/http.d/default.conf
COPY conf/supervisord.conf /etc/supervisord.conf

# Set permissions before switching user
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R ug+rwX /var/www/storage /var/www/bootstrap/cache

RUN composer install --no-dev --optimize-autoloader \
    && npm install --force \
    && npm run build

RUN mkdir -p /var/log && chown -R www-data:www-data /var/log
RUN mkdir -p /run/nginx /var/lib/nginx \
    && chown -R www-data:www-data /run/nginx /var/lib/nginx

USER www-data


EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
