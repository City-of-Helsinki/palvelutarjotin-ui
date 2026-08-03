#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const PUBLIC_PREFIX = 'NEXT_PUBLIC_';

// Keys excluded from the generated runtime env config. These are inlined by
// Next.js at build time (via process.env.NEXT_PUBLIC_*) and intentionally kept
// out of window._env_ so they aren't redistributed at runtime.
const RUNTIME_ENV_EXCLUDES = new Set(['NEXT_PUBLIC_CAPTCHA_KEY']);

const envDir = process.argv[2] || process.cwd();
const targetDir = process.argv[3] || path.resolve(process.cwd(), 'public');
const configFile = USE_TEST_ENV ? 'test-env-config.js' : 'env-config.js';
const targetFile = path.resolve(targetDir, configFile);

const envFiles = USE_TEST_ENV
  ? ['.env.example', '.env', '.env.test']
  : ['.env.example', '.env', '.env.local'];

const parseEnvContent = (content) => {
  const parsed = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex < 0) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  });

  return parsed;
};

const loadEnvFromFiles = () => {
  const env = {};

  envFiles.forEach((fileName) => {
    const filePath = path.resolve(envDir, fileName);
    if (!fs.existsSync(filePath)) {
      return;
    }

    const parsed = parseEnvContent(fs.readFileSync(filePath, 'utf8'));
    Object.assign(env, parsed);
  });

  return env;
};

const pickPublicEnv = (source) => {
  return Object.fromEntries(
    Object.entries(source).filter(([key, value]) => {
      return (
        key.startsWith(PUBLIC_PREFIX) &&
        value !== undefined &&
        !RUNTIME_ENV_EXCLUDES.has(key)
      );
    })
  );
};

const start = async () => {
  try {
    const fileEnv = loadEnvFromFiles();
    const processPublicEnv = pickPublicEnv(process.env);
    const defaultPublicEnv = pickPublicEnv(fileEnv);

    const envVariables = {
      ...defaultPublicEnv,
      ...processPublicEnv,
    };

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(
      targetFile,
      `window._env_ = ${JSON.stringify(envVariables, null, 2)};\n`,
      'utf8'
    );

    console.log(`Runtime env file created: ${targetFile}`);
  } catch (error) {
    console.error(error && error.message ? error.message : error);
    process.exit(1);
  }
};

start();
