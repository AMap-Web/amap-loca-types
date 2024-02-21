#!/bin/sh

set -e
cd ../
npm publish
cd -

echo "Publish completed"
