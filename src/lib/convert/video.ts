import initFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type VideoFormat = "mp4" | "mp3" | "webm" | "mkv" | "mov";
function mime(ext: VideoFormat): string {
  switch (ext) {
    case "mp4": return "video/mp4";
    case "mp3":  return "audio/mpeg";
    case "webm": return "video/webm";
    case "mkv": return "video/x-matroska";
    case "mov": return "video/quicktime";
    default:    return "application/octet-stream";
  }
}

type ConvertOpts = { onProgress?: (p: number) => void };

const convertVideo = async (file: File, outExt: VideoFormat, opts: ConvertOpts = {}) => {
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
        
    const ext = (file.name.split(".").pop() || "vid").toLowerCase();
    const inp = `in.${ext}`;
    const out = `out-${Date.now()}.${outExt}`;

    await ffmpeg.deleteFile?.(inp).catch(()=>{});
    await ffmpeg.deleteFile?.(out).catch(()=>{});

    await ffmpeg.writeFile(inp, await fetchFile(file));
    const args = ["-y", "-i", inp];

    switch (outExt) {
        case "mp4": { 
            args.push(
                "-c:v","libx264","-preset","ultrafast","-crf","28","-pix_fmt","yuv420p",
                "-c:a","aac","-b:a","128k","-movflags","+faststart"
            );
            break; 
        }   
        
        case "mp3": { 
            args.push(
                "-c:a", "libmp3lame", "-q:a", "2"  
            );
            break; 
        }  
        
        case "webm": { 
            args.push(
                "-c:v", "libvpx", "-quality", "good", "-deadline", "good", "-cpu-used", "6",          
                "-threads", "0", "-crf", "31", "-b:v", "0", "-g", "240", "-c:a", "libvorbis", "-q:a", "4"
            ); 
            break; 
        }
        
        case "mkv": { 
            args.push(
                "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",            
                "-threads", "0", "-g", "240", "-c:a", "aac", "-b:a", "128k"
            );
            break; 
        }
                
        case "mov": { 
            args.push(
                "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", 
                "-threads", "0", "-g", "240", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k" 
            );
            break; 
        }
    }
    

    args.push(out);
    await ffmpeg.exec(args);

    const data = (await ffmpeg.readFile(out)) as Uint8Array;
    if (!data || (data as Uint8Array).length === 0) throw new Error("Empty output");        
    await ffmpeg.exec(["-hide_banner","-loglevel","error","-v","error","-i", out, "-t","1","-f","null","-"]);

    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type: mime(outExt) });
    const url = URL.createObjectURL(blob);

    await ffmpeg.deleteFile(out).catch(() => {});
    (ffmpeg as any).__progressCallback = undefined;
    return { blob, url, out };
}

export default convertVideo;
