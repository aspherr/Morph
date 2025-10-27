import initFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type ImageFormat = "jpg" | "jpeg" | "png" | "webp";
export function mime(ext: ImageFormat): string {
  switch (ext) {
    case "jpg":  return "image/jpeg";
    case "jpeg": return "image/jpeg";
    case "png":  return "image/png";
    case "webp": return "image/webp";
    default:     return "application/octet-stream";
  }
}

type ConvertOpts = { onProgress?: (p: number) => void };

const convertImage = async (file: File, outExt: ImageFormat, opts: ConvertOpts = {}) => {
    const ffmpeg = await initFFmpeg();

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
    const inp = `in.${ext}`;
    const out = `out-${Date.now()}.${outExt}`;

    await ffmpeg.deleteFile?.(inp).catch(()=>{});
    await ffmpeg.deleteFile?.(out).catch(()=>{});

    await ffmpeg.writeFile(inp, await fetchFile(file));
    const args: string[] = ["-i", inp];

    switch (outExt) {
        case "jpeg":
        case "jpg": {
            args.push("-qscale:v", "5");
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
