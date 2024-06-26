# Dockerfile

FROM node:20-alpine3.18
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./package.json ./package-lock.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "office"]