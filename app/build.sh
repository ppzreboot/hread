rm -rf dist
mkdir dist
elm make src/Main.elm --output=dist/main.js
