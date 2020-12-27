FROM ubuntu:rolling

RUN apt-get update

RUN apt-get install -y build-essential software-properties-common curl

RUN apt-get install -y nodejs npm

RUN mkdir /lojban_npm
COPY src/package*.json /lojban_npm/
WORKDIR /lojban_npm
RUN npm i ; npm install mocha -g
