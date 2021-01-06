#!/bin/bash

docker kill lojban_npm
docker rm lojban_npm

docker run \
  -it \
  --name lojban_npm \
  -v $(pwd)/src:/lojban_npm/src/:Z \
  -v $(pwd)/test:/lojban_npm/test/:Z \
  lojban_npm \
  bash