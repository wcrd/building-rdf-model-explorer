import adapter from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'public',
			assets: 'public',
			fallback: 'index.html',
			precompress: false,
		}),
		'trailingSlash': 'always',
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
