FROM node:20-alpine

WORKDIR /app

# Install dependencies for pdf-parse native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "dev"]
