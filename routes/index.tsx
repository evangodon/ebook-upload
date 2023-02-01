import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { config } from "@/utils/config.ts";
import type { EbookFile } from "@/utils/types.ts";
import { Ebook } from "@/components/Ebook.tsx";
import FileUpload from "@/islands/FileUpload.tsx";

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
  async POST(req, _ctx) {
    try {
      const formData = await req.formData();
      const ebook = formData.get("ebook");
      if (!(ebook instanceof File)) {
        throw new Error("ebook file not sent");
      }

      const path = config.sourceFolder + ebook.name;
      Deno.writeFile(path, ebook.stream());

      const msg = JSON.stringify({ msg: `Added ${ebook.name} to folder` });
      return new Response(msg);
    } catch (err) {
      const msg = JSON.stringify({ msg: "error", error: err });
      return new Response(msg);
    }
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

        <FileUpload />

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
