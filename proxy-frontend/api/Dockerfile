FROM node:12.18.3-alpine

LABEL version="1.0"
LABEL description="Voice workshop 2021 login backend API."
LABEL maintainer = ["jason.kim@advantest.com"]

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm ci --loglevel verbose
EXPOSE 80
CMD ["DEBUG=* node", "server.js" ]
# CMD ["node-inspect", "server.js"] debug mode