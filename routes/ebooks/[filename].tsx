import { HandlerContext, Handlers } from "$fresh/server.ts";
import { config } from "@/utils/config.ts";

export const handler: Handlers = {
  async GET(req: Request, _ctx: HandlerContext) {
    const url = new URL(req.url);
    const decoded = decodeURIComponent(url.pathname);

    const filename = decoded.substring(decoded.lastIndexOf("/") + 1);

    const fullpath = config.sourceFolder + filename;

    let file;

    try {
      file = await Deno.open(fullpath, { read: true });
    } catch {
      return new Response("404 Not Found", { status: 404 });
    }

    const readableStream = file.readable;

    return new Response(readableStream);
  },
};
