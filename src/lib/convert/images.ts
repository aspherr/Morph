import initFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type ImageFormat = "jpg" | "jpeg" | "png" | "webp";
export function mime(ext: ImageFormat): string {
  switch (ext) {
    case "jpg":  
    case "jpeg": return "image/jpeg";
    case "png":  return "image/png";
    case "webp": return "image/webp";
    default:     return "application/octet-stream";
  }
}

async function warmupFFmpeg(ffmpeg: any) {
  if (ffmpeg.__warmedUp) return;
  try {
    const warmOut = "___warmup.jpg";
    await ffmpeg.deleteFile?.(warmOut).catch(() => {});
    await ffmpeg.exec([
      "-y",
      "-hide_banner",
      "-loglevel", "error",
      "-f", "lavfi",
      " -i", "color=c=black:s=2x2:d=0.01",
      "-frames:v", "1",
      "-c:v", "mjpeg",
      warmOut,
    ]);
    await ffmpeg.deleteFile?.(warmOut).catch(() => {});
  
    } catch (e) {
        console.warn("ffmpeg warmup skipped:", e);
    }
    
    ffmpeg.__warmedUp = true;
}

type ConvertOpts = { onProgress?: (p: number) => void };

const convertImage = async (file: File, outExt: ImageFormat, opts: ConvertOpts = {}) => {
    const ffmpeg = await initFFmpeg();
    await warmupFFmpeg(ffmpeg);
    
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
    const args: string[] = ["-y", "-hide_banner", "-loglevel", "error", "-i", inp, "-frames:v", "1"];
    

    switch (outExt) {
        case "jpeg":
        case "jpg": {
            args.push("-vf", "format=yuv420p");
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

    console.log(out)
    args.push(out);
    try { await ffmpeg.exec(args); } catch (e) {
        console.error("ffmpeg exec failed", e);
    }

    const data = (await ffmpeg.readFile(out)) as Uint8Array;
    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type: mime(outExt) });
    const url = URL.createObjectURL(blob);

    await ffmpeg.deleteFile?.(out).catch(() => {});

    (ffmpeg as any).__progressCallback = undefined;

    return { blob, url, out };
}

export default convertImage;
