.PHONY: build

install:
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run: 
	@echo "**************************************************"
	@echo "* open http://localhost:8000/webpack-dev-server/ *"
	@echo "**************************************************"
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --colors --devtool cheap-module-inline-source-map --port 8000 --inline --hot

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map

build-dev:
	@NODE_ENV=dev ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map

test: test-unit test-e2e

test-unit:
	@./node_modules/.bin/karma start src/javascripts/test/karma.conf.js --single-run

test-e2e: prepare-test-e2e
	@./node_modules/.bin/protractor src/javascripts/test/protractor.conf.js

prepare-test-e2e:
	@echo "Preparing files for e2e tests"
	@NODE_ENV=test ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe
	@cp examples/blog/*.js src/javascripts/test/fixtures/examples/blog
	@cp examples/blog/*.html src/javascripts/test/fixtures/examples/blog
	@sed -i.bak 's|http://localhost:8000/|/|g' src/javascripts/test/fixtures/examples/blog/index.html
	@cp node_modules/fakerest/dist/FakeRest.min.js src/javascripts/test/fixtures/examples/blog/build/fakerest.js
	@cp node_modules/sinon/pkg/sinon-server-1.14.1.js src/javascripts/test/fixtures/examples/blog/build/sinon-server.js
