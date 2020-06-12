require = require('esm')(module);
const jsdom = require('jsdom');

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

module.exports = require('./server');
