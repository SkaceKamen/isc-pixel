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

When you have your packaged version, you need to first install dependencies:

```sh
npm install
```

then you need to create a config. Copy `config.js.example` to `config.js` and update it according to your needs.

Once you have everything ready, you start the application like this:

```sh
node isc-pixel.js
```
