// HDS injects component styles to document. Document needs to be initialized to global object
// see pages/_document.ts, it takes the generated styles from document.head and renders them
// to server side rendered head
import jsdom from 'jsdom';

const document = new jsdom.JSDOM('<!DOCTYPE html>').window.document;
global.document = document;

export * from './server.mjs';
