FROM nginx:1.24-alpine
COPY dist/ /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
