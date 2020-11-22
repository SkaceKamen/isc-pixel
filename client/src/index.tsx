// Must be the first import
if (process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed
	// to exist at top-level.
	require('preact/debug')
}

import React from 'react'
import { Root } from './Root'
import { render } from 'react-dom'

render(<Root />, document.getElementById('application'))
