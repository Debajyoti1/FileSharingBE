FROM node:current-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN apk add --no-cache gcc musl-dev linux-headers

RUN apk update && apk upgrade --no-cache

EXPOSE 8000
EXPOSE 8001
CMD npm start