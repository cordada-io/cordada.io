#!/bin/bash

# Create docs directory if it doesn't exist
mkdir -p docs

# Copy HTML files
cp src/*.html docs/

# Copy fonts directory
cp -r src/fonts docs/

# Copy static directory
cp -r src/static docs/

# Build Tailwind CSS
npx tailwindcss -i src/input.css -o docs/output.css --minify
