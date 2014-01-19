#!/bin/bash

HOST='http://localhost:4001';
ROOT='/api/v1';
LocationPath=$ROOT'/location';
OPTS=' -v -H Content-Type: application/json ';

# POST
# curl -X POST -H "Content-Type: application/json" -d '{"uuid":"43431","name":"newnewnew43431"}' $HOST$LocationPath

# PUT
# curl -v -X PUT -H "Content-Type: application/json" -d '{"type": "content", "name": "Program 0", "content": "<html>Hello, world!</html", "programmerId": "43"}' $HOST$LocationPath

# GET
curl $HOST$LocationPath

# DELETE
# curl -X DELETE -H "Content-Type: application/json" -d '{"uuid":"43431"}' $HOST$LocationPath
