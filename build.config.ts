import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/middleware"],
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: false,
  },
});
