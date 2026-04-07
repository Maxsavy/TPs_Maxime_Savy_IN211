#!/bin/bash

RED='\033[0;31m'

# Check if a nameless migration file exists
if ls *-migrations.js 2>/dev/null 1>&2; then
    rm *-migrations.js
    echo "${RED}You forgot to give your migration file a name. Please run the command again with a --name flag."
    exit 1
fi

# Format migrations file to use ES modules format (compatible macOS + Linux)
find migrations -name "*.js" | while read file; do
    sed -i '' 's/const { MigrationInterface, QueryRunner } = require("typeorm");/import typeorm from "typeorm";\n\nconst { MigrationInterface, QueryRunner } = typeorm;/g' "$file"
    sed -i '' 's/module.exports = class/export default class/g' "$file"
done