#!/bin/bash

docker kill lojban_npm
docker rm lojban_npm

docker run \
  -d \
  -it \
  --name lojban_npm \
  -v $(pwd)/lojban:/lojban_npm/lojban/:Z \
  lojban_npm \
  bash
docker exec -it lojban_npm bash