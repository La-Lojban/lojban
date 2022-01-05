FROM alpine:latest

RUN apk --no-cache add bash
RUN apk --no-cache add --update nodejs yarn

RUN mkdir /lojban_npm
COPY lojban/package*.json /lojban_npm/
WORKDIR /lojban_npm
RUN yarn ; yarn global add mocha npm-check-updates ts-node
