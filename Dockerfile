FROM node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run-script build

EXPOSE 3001

CMD npm run start
