#!/usr/bin/env bash

set -e -o pipefail

echo "Regenerating Protocol Buffers"


# Directory to write generated code to (.js and .d.ts files)
TS_OUT_DIR="./build/generated"
JS_OUT_DIR="./src/generated"

mkdir -p $TS_OUT_DIR
mkdir -p $JS_OUT_DIR

# Generate node code.
grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:$TS_OUT_DIR \
    --js_out=import_style=commonjs,binary:$JS_OUT_DIR \
    --grpc_out=$TS_OUT_DIR \
    --grpc_out=$JS_OUT_DIR \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

# Generate tyepscript declaration files.
protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=$TS_OUT_DIR \
    --ts_out=$JS_OUT_DIR \
    --proto_path=$PWD/xpring-common-protocol-buffers/proto \
    $PWD/xpring-common-protocol-buffers/**/*.proto

echo "All done!"
