import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/middleware"],
  externals: ["virtual:astro-favicons"],
  declaration: 'node16',
  rollup: {
    emitCJS: false,
  },
});
