import { createGlobalStyle } from 'styled-components'
import colors from './colors'
import input from './components/input'
import reset from './components/reset'
import { media } from './media'
import transitions from './components/transitions'

export const GlobalStyle = createGlobalStyle`
${reset} 

/* font converted using font-converter.net. thank you! */
@font-face {
  font-family: "DogicaPixel";
  src: url("./fonts/dogicapixel.eot"); /* IE9 Compat Modes */
  src: url("./fonts/dogicapixel.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
    url("./fonts/dogicapixel.otf") format("opentype"), /* Open Type Font */
    url("./fonts/dogicapixel.svg") format("svg"), /* Legacy iOS */
    url("./fonts/dogicapixel.ttf") format("truetype"), /* Safari, Android, iOS */
    url("./fonts/dogicapixel.woff") format("woff"), /* Modern Browsers */
    url("./fonts/dogicapixel.woff2") format("woff2"); /* Modern Browsers */
  font-weight: normal;
  font-style: normal;
}

* {
	padding: 0;
	margin: 0;
}

html, body, #application {
	width: 100%;
	height: 100%;
}

body {
	font-family: DogicaPixel, Arial, Helvetica, sans-serif;
	color: ${colors.text};
	font-size: 75%;
	line-height: 150%;
}

body,html {
	overflow: hidden;
}

${media.medium} {
  html, body, button {
    font-size: 85%;
  }
}

${input}
${transitions}

button, a {
	cursor: pointer;
}

.mr-2 {
	margin-right: 0.5rem;
}

.x2-icon {
  width: 32px;
  height: 32px;
}

.pixel-perfect {
  image-rendering: optimizeSpeed;
	-ms-interpolation-mode: nearest-neighbor;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: -webkit-crisp-edges;
	image-rendering: -moz-crisp-edges;
	image-rendering: -o-crisp-edges;
	image-rendering: pixelated;
	image-rendering: crisp-edges;
}
`
