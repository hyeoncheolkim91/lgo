FROM node:12.18.3-alpine as ui-builder

LABEL version="1.0"
LABEL description="Voice workshop 2021 login UI"
LABEL maintainer = ["jason.kim@advantest.com"]

WORKDIR /usr/src/app
COPY ui/ ./ui/
RUN cd ui && npm install && npm run build


FROM node:12.18.3-alpine as api-builder
WORKDIR /root/
COPY --from=ui-builder /usr/src/app/ui/build ./ui/build
COPY api/package*.json ./api/
RUN cd api && npm install
RUN npm ci --loglevel verbose
COPY api/server.js ./api/

EXPOSE 80
ENV DEBUG=*
CMD ["node", "./api/server.js"]
# CMD ["npm", "debug-start"] debug mode