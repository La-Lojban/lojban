#!/bin/bash

podman kill lojban_npm
podman rm lojban_npm

podman run \
  -it \
  --name lojban_npm \
  -v $(pwd)/src:/lojban_npm/src/:Z \
  -v $(pwd)/test:/lojban_npm/test/:Z \
  lojban_npm
