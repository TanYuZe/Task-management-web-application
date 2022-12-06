FROM alpine:latest

WORKDIR /server

RUN apk add npm

COPY package.json .

RUN npm install && npm cache clean --force

COPY . .

RUN addgroup -S nonroot && adduser -S default -G nonroot

USER default

EXPOSE 5000

CMD ["node", "index.js"]