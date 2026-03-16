.PHONY: build publish

build:
	vp pack

publish: build
	npm publish --access=public
