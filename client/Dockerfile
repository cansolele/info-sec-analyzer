FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["npx", "serve", "-s", "dist", "-l", "8080"]


