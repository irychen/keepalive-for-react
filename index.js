'use strict';

const isProduction = process.env.NODE_ENV === 'production';

import MinReactKeepAlive from './lib/index.min'
import DevReactKeepAlive from './lib/index'

const ReactKeepAlive = isProduction ? MinReactKeepAlive : DevReactKeepAlive

export default ReactKeepAlive