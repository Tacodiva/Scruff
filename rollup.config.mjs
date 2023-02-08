import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const production = !process.env.ROLLUP_WATCH;

function onwarn(message) {
	// Make rollup shut up about circular dependency 'issues'.
	if (message.code === 'CIRCULAR_DEPENDENCY') return;
	console.warn(message.toString());
};

export default [{
	input: 'scuff-core/index.ts',

	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/scuff-core/scuff-core.mjs',
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				dev: !production
			}
		}),
		css({
			output: 'scuff-core.css'
		}),

		resolve({ dedupe: ['svelte'] }),

		typescript(
			{
				tsconfig: "scuff-core/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production,

				declaration: true,
				declarationDir: "types"
			}
		),

		production && terser({ mangle: false }),
	],
	onwarn
},
{
	input: 'public/lib/scuff-core/types/api/index.d.ts',
	output: [
		{
			file: "public/lib/scuff-core/scuff-core.d.ts",
			format: "es"
		}
	],
	plugins: [
		dts()
	]
},
{
	input: 'scuff-scratch/index.ts',

	external: ['scuff'],
	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/scuff-scratch/scuff-scratch.mjs',
	},
	plugins: [
		css({
			output: 'scuff-scratch.css'
		}),

		typescript(
			{
				tsconfig: "scuff-scratch/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production,
			}
		),

		production && terser({ mangle: false }),
	],
	onwarn
},
{
	input: 'src/index.ts',

	external: ['scuff'],
	output: {
		sourcemap: !production,
		format: 'es',
		file: 'public/lib/index.js'
	},
	plugins: [
		typescript(
			{
				tsconfig: "src/tsconfig.json",
				sourceMap: !production,
				inlineSources: !production,
			}
		),

		!production && livereload({ watch: ['public'] }),
		production && terser({ mangle: false }),
	],
	onwarn
}
];
