# dockerfile
FROM nginx:stable-alpine as build-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-stage nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]