import "load-envs";

const sourceFolder = Deno.env.get("SOURCE_FOLDER");
if (sourceFolder == undefined) {
  throw new Error("Undefined env var");
}

export const config = {
  sourceFolder: sourceFolder,
};
