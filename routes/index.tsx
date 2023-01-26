import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { config } from "../utils/config.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    // read source folder  and get array of files
    for await (const dirEntry of Deno.readDir(config.sourceFolder)) {
      console.log(dirEntry);
    }
    return ctx.render();
  },
};

export default function Home({ data }: PageProps<any>) {
  return (
    <>
      <Head>
        <title>Ebook File Server</title>
        <link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="container">
        <h1>Ebook File Server</h1>

        <h3>
          Files in <code>{config.sourceFolder}</code>
        </h3>
      </div>
    </>
  );
}
