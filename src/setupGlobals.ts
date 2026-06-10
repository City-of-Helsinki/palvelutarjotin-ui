/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';

// To avoid error: ReferenceError: TextEncoder is not defined
// discussed here: https://github.com/jsdom/jsdom/issues/2524
globalThis.TextEncoder = TextEncoder as any;
globalThis.TextDecoder = TextDecoder as any;

// Provide stream globals for libraries that expect them, such as MSW.
globalThis.ReadableStream = ReadableStream as any;
globalThis.TransformStream = TransformStream as any;
globalThis.WritableStream = WritableStream as any;
