FROM node:erbium-alpine

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm i

ENTRYPOINT [ "npm", "start" ]