#! /usr/bin/env node

/**
 * Created by youssef on 1/18/17.
 */
'use strict';
//in order for async/await to work babel-polyfill needs to be required before anything else

require("babel-polyfill");
//include app file
require('./app');