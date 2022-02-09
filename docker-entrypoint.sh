#!/bin/sh

echo "Waiting for mysql to start..."
./wait-for mysql_db:3306 

echo "Waiting for redis to start..."
./wait-for redis_db:6379 

echo "Migrating the databse..."
sequelize db:migrate

echo "Starting the server..."
npm run develop