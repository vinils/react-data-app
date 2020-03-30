FROM node:latest
WORKDIR /usr/app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3001

CMD yarn run build && yarn run start
