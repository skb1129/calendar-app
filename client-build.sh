#!/bin/bash

client="./client"
static="./static"
templates="./templates"

if [ -d "${static}" ]; then
  echo "Found old static directory..."
  echo "Removing old static directory..."
  rm -rvf ${static}
fi

echo "Creating new static directory..."
mkdir ${static}

if [ -d "${templates}" ]; then
  echo "Found old templates directory..."
  echo "Removing old templates directory..."
  rm -rvf ${templates}
fi

echo "Creating new templates directory..."
mkdir ${templates}

echo "Moving to client directory..."
cd ${client} || exit 1

echo "Installing client assets..."
yarn

echo "Building client bundle..."
yarn build

echo "Moving client bundle to static and templates directory..."
mv ./dist/index.html ../${templates}
mv ./dist/* ../${static}

echo "Done..."
