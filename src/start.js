/* eslint-disable no-native-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
require = require('esm')(module);
const jsdom = require('jsdom');

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

module.exports = require('./server');
