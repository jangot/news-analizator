#!/usr/bin/env bash

if [ $1 = 'keywords' ];
then
    echo "will call keywords job"
    node --env-file=.env.development --env-file=.env.local ./bin/keywords.js
elif [ $1 = 'data' ];
then
  echo "will call data generation job"
else
    echo "will call scan job"
    node --env-file=.env.development --env-file=.env.local ./bin/scan.js --wait 50
fi
