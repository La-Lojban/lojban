build:
	docker build -t lojban_npm .

dev:
	docker rm -f lojban_npm 2> /dev/null ; \
	docker run \
	-it \
	--name lojban_npm \
	-v $$(pwd)/lojban:/lojban_npm/lojban:Z \
	lojban_npm \
	bash
