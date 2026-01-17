#!make

# Makefile for Demo Auth Serve
SHELL := /bin/sh


#export BUILD = $(shell git describe --always)-$(shell date +%Y%m%d%H%M%S)
export TAG = $(shell git describe --abbrev=0 --tags)
#BRANCH = $(shell git branch --show-current)
#export VERSION ?= $(shell git describe --always)
export VERSION ?= latest
export MAKEFILE_LIST=Makefile

#include ./.env

export BUNDLE_ANALYZER_MODE=disabled

include ./.env
export

$(info version = $(VERSION))

env:
	@env

help: ## display this help screen
	@grep -h -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'


seed:
	@npx prisma db seed

# add-anime: add a title to prisma/animelist.json and optionally seed DB
# usage: make add-anime TITLE="The Other Side of Deep Space" [SEED=1]
add-anime: ## add an anime by title to `prisma/animelist.json` and optionally run `make seed` (use TITLE="...")
	@if [ -z "$(TITLE)" ]; then echo "usage: make add-anime TITLE=\"<title>\" [SEED=1]"; exit 1; fi
	@node ./scripts/add-anime.js --title "$(TITLE)" $(if $(SEED),--seed,)

migrate:
	@npx prisma migrate dev --name first_prisma_migration

install:
	@yarn

build:
	@yarn build

dev:
	@yarn dev
