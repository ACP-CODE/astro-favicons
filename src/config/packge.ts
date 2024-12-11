import { name, version, homepage } from "../../package.json";
const formatedName =
  name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) +
  ` integration`;
export { name, formatedName, version, homepage };
