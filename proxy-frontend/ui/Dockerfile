FROM node:12.18.3-alpine

LABEL version="1.0"
LABEL description="Voice workshop 2021 login UI"
LABEL maintainer = ["jason.kim@advantest.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

RUN npm install

EXPOSE 80

CMD [ "npm", "start" ]



