import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    banner: '#!/usr/bin/env node',
    file: 'cli.js',
    format: 'cjs',
  },

  external: ['commander', 'colors', 'path', 'fs', 'child_process'],

  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    json({
      compact: true,
      preferConst: true,
    }),
  ],
};
