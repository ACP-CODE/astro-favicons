import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/middleware"],
  externals: ["virtual:astro-favicons"],
  declaration: true,
  failOnWarn: false
  rollup: {
    emitCJS: false,
  },
});
