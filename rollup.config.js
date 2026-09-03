import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const dev = process.env.ROLLUP_WATCH;
const outDir = 'custom_components/timer_24h/dist';

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  typescript({
    declaration: false,
    declarationMap: false,
    rootDir: 'src',
    outDir,
  }),
  !dev &&
    terser({
      format: {
        comments: false,
      },
    }),
].filter(Boolean);

export default [
  {
    input: 'src/timer-24h-card.ts',
    output: {
      file: `${outDir}/timer-24h-card.js`,
      format: 'es',
      sourcemap: !!dev,
      inlineDynamicImports: true,
    },
    plugins,
    external: [],
  },
  {
    input: 'src/timer-24h-card-editor.ts',
    output: {
      file: `${outDir}/timer-24h-card-editor.js`,
      format: 'es',
      sourcemap: !!dev,
      inlineDynamicImports: true,
    },
    plugins,
    external: [],
  },
];
