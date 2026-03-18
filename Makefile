.PHONY: build test test-coverage install
build:
	pnpm run build
test:
	pnpm test
test-coverage:
	pnpm run test:coverage
install:
	pnpm install
