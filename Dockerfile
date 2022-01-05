FROM alpine:latest

RUN apk add --no-cache bash
RUN apk add --update nodejs npm

RUN mkdir /lojban_npm
COPY lojban/package*.json /lojban_npm/
WORKDIR /lojban_npm
RUN npm i ; npm i -g mocha npm-check-updates ts-node
