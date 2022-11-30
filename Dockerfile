FROM 18-alpine

WORKDIR /app

COPY package*.json  /app

RUN npm install && cache clean --force

COPY . /app

USER node

EXPOSE 5000

CMD ["node", "index.js"]