import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { config } from "@/utils/config.ts";
import type { EbookFile } from "@/utils/types.ts";
import { Ebook } from "@/components/Ebook.tsx";

interface Data {
  ebooks: EbookFile[];
}

export const handler: Handlers<Data> = {
  async GET(_, ctx) {
    const ebooks: EbookFile[] = [];

    const folder = Deno.readDir(config.sourceFolder);

    for await (const dirEntry of folder) {
      const file = await Deno.stat(config.sourceFolder + dirEntry.name);
      const modtime = file.mtime;
      const name = dirEntry.name;

      ebooks.push({ name, modtime });
    }

    return ctx.render({ ebooks });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Ebook File Server</title>
        <link rel="stylesheet" href="/global.css" />
        <link rel="stylesheet" href="/app.css" />
      </Head>
      <div class="container">
        <h1 class="h1">Ebook File Server</h1>

        <h3 class="list-header">
          Files in <code>{config.sourceFolder}</code>
        </h3>
        <div class="ebook-list">
          {data.ebooks.map((ebook) => {
            return <Ebook ebook={ebook} />;
          })}
        </div>
      </div>
    </>
  );
}
