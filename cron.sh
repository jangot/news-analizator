#!/usr/bin/env bash


if [ $1 = 'keywords' ];
then
    echo "will call keywords job"
elif [ $1 = 'data' ];
then
  echo "will call data generation job"
else
    echo "will call scan job"
    npm run scan -- -w 10 -s 7
fi
