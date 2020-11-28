# ISC Pixel

/r/place inspired shared canvas project

## Requirements
 * nodejs v12+

## Structure
 - `server` - express server sources
 - `client` - React.js based client
 - `shared` - code shared between client/server (mainly interfaces)
 - `builder` - tool for building dist packages

## Building

Go to `builder` folder, run:

```sh
npm install
npm run build
```

## Running

Once you have a package ready, you can just run:
```sh
npm install
node isc-pixel.js
```
