import getFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type ImageFormat = "jpg" | "png" | "webp";
function mime(ext: ImageFormat): string {
  switch (ext) {
    case "jpg":  return "image/jpeg";
    case "png":  return "image/png";
    case "webp":  return "image/webp"
  }
}

type ConvertOpts = { onProgress?: (p: number) => void };

const convertImage = async (file: File, outExt: ImageFormat, opts: ConvertOpts = {}) => {
    const ffmpeg = await getFFmpeg();

    if (!(ffmpeg as any).__progressListenerInstalled) {
        ffmpeg.on("progress", ({ progress }: any) => {
            const cb = (ffmpeg as any).__progressCallback as ConvertOpts["onProgress"] | undefined;
            if (cb) {
                cb(Math.max(0, Math.min(100, Math.round(progress * 100))))
            };
        });
        (ffmpeg as any).__progressListenerInstalled = true;
    }

    (ffmpeg as any).__progressCallback = opts.onProgress;
    
    const ext = (file.name.split(".").pop() || "img").toLowerCase();
    const inpExt = (["jpg", "png", "webp"] as const).includes(ext as any)
                        ? (ext as ImageFormat)
                        : "jpg";
    
    const inp = `in.${inpExt}`;
    const out = `out.${outExt}`;

    await ffmpeg.writeFile(inp, await fetchFile(file));
    const args: string[] = ["-i", inp];

    switch (ext) {
        case "jpg": { 
            args.push("-vf", "format=rgb24", "-qscale:v", "3");
            break;
        }    
        
        case "png": {
            args.push("-compression_level", "6");
            break;
        }
        
        case "webp": {
            args.push("-q:v", "85", "-pix_fmt", "rgb24");
            break;
        }
    }

    args.push(out);
    await ffmpeg.exec(args);

    const data = (await ffmpeg.readFile(out)) as Uint8Array;
    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type: mime(outExt) });
    const url = URL.createObjectURL(blob);

    (ffmpeg as any).__progressCallback = undefined;

    return { blob, url, out };
}

export default convertImage;
