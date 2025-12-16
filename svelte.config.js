import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: false,
      envPrefix: 'PUBLIC_'
    }),
    alias: {
      $lib: "src/lib",
      $components: "src/lib/components",
      $atoms: "src/lib/components/atoms",
      $molecules: "src/lib/components/molecules",
      $organisms: "src/lib/components/organisms",
      $views: "src/lib/components/views",
      $stores: "src/lib/stores",
      $types: "src/lib/types",
      $utils: "src/lib/utils",
      $styles: "src/lib/styles",
    },
  },
};

export default config;
