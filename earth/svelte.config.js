import adapter from "@sveltejs/adapter-vercel";
import sveltePreprocess from "svelte-preprocess";

/* This insane solution resolves the fact that VSCode interprets relative file imports
   from the perspective of the opened workspace folder, not the root of the svelte project.
	 And for some reason this absolute path does not work with the Vite preprocessor. */
import path from "path";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "src", "styles", "_mixins.scss");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    scss: {
      prependData: `@use 'sass:color'; @import '${configPath}';`,
    },
  }),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
