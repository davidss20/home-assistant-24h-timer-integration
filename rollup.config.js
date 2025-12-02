import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const dev = process.env.ROLLUP_WATCH;

export default [{
  input: 'timer-24h-card.ts',
  output: {
    file: 'timer-24h-card.js',
    format: 'es',
    sourcemap: dev ? true : false,
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      declaration: false,
      outDir: 'dist',
      rootDir: '.',
    }),
    !dev && terser({
      format: {
        comments: false,
      },
    }),
  ].filter(Boolean),
  external: [],
}, {
  input: 'timer-24h-card-editor.ts',
  output: {
    file: 'timer-24h-card-editor.js',
    format: 'es',
    sourcemap: dev ? true : false,
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      declaration: false,
      outDir: '.',
      rootDir: '.',
    }),
    !dev && terser({
      format: {
        comments: false,
      },
    }),
  ].filter(Boolean),
  external: [],
}];
