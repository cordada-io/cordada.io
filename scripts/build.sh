#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy HTML files
cp src/*.html dist/

# Copy fonts directory
cp -r src/fonts dist/

# Copy static directory
cp -r src/static dist/

# Build Tailwind CSS
npx tailwindcss -i src/input.css -o dist/output.css --minify
