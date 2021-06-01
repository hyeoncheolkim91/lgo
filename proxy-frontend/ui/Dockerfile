FROM node:12.18.3-alpine as builder

LABEL version="1.0"
LABEL description="Voice workshop 2021 login UI"
LABEL maintainer = ["jason.kim@advantest.com"]

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN npm ci --loglevel verbose

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]