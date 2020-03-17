#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "Missing rate limit argument, pass in a number."
  exit 1
fi

shutDown() {
  echo "Shutting down"
  kill -9 "${SERVICE_PID}"
  docker-compose down
}

trap shutDown SIGINT
trap shutDown SIGTERM

export RATE_LIMIT=$1

echo "Starting RabbitMQ"
docker-compose up -d rabbitmq

echo "Waiting for RabbitMQ to be ready"
sleep 20

echo "Starting consumer"
nohup npm start > output.log &
export SERVICE_PID=$!

echo "Starting perftest with rate limit of ${RATE_LIMIT}"
docker-compose up perf
