#!/usr/bin/env bash

#docker run --name ria-pg -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -d postgres

PATH_RO_INIT=$(pwd)/sql/init.sql
PATH_RO_DATA_FOLDER=$(pwd)/pgdata

cat $PATH_RO_INIT
echo $PATH_RO_DATA_FOLDER

docker run --name ria-pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -v $PATH_RO_DATA_FOLDER:/var/lib/postgresql/data \
  -v $PATH_RO_INIT:/docker-entrypoint-initdb.d/init.sql \
  -d postgres
