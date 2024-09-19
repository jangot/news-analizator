#!/usr/bin/env bash

docker run --name ria-pg -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -d postgres
