FROM docker.io/nginx:1.25-alpine
COPY dist/ /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
