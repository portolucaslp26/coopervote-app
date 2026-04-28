#!/bin/sh

# Substitui variável API_URL no template do nginx
envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Inicia o nginx
nginx -g "daemon off;"
