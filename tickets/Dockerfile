FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm i --only=prod --legacy-peer-deps

COPY . .

CMD ["npm", "start"]