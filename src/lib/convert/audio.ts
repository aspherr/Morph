import initFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type AudioFormat = "mp3" | "wav" | "ogg" | "aac" | "aiff" | "flac";
function mime(ext: AudioFormat): string {
  switch (ext) {
    case "mp3":  return "audio/mpeg";
    case "wav":  return "audio/wav";
    case "ogg":  return "audio/ogg";
    case "aac":  return "audio/aac";
    case "aiff": return "audio/aiff";
    case "flac": return "audio/flac";
    default:     return "application/octet-stream";
  }
}

const convertAudio = async (file: File, outExt: AudioFormat) => {
    const ffmpeg = await initFFmpeg();
    
    if (!(ffmpeg as any).__hooks) {
        ffmpeg.on("progress", ({ progress }: any) => console.debug("progress:", progress));
        (ffmpeg as any).__hooks = true;
    }
        
    const ext = (file.name.split(".").pop() || "vid").toLowerCase();
    const inpExt = (["mp3", "wav", "ogg", "aac", "flac", "alac"] as const).includes(ext as any)
                        ? (ext as AudioFormat)
                        : "mp3";
    
    const inp = `in.${inpExt}`;
    const out = `out-${Date.now()}.${outExt}`;

    await ffmpeg.deleteFile?.(inp).catch(()=>{});
    await ffmpeg.deleteFile?.(out).catch(()=>{});

    await ffmpeg.writeFile(inp, await fetchFile(file));
    const args = ["-y", "-i", inp];

    switch (outExt) {
        case "mp3": { 
            args.push(
                "-c:a", "libmp3lame", "-q:a", "2"  
            );
            break; 
        }    
        
        case "wav": { 
            args.push(
                "-c:a", "pcm_s16le"
            ); 
            break; 
        }
        
        case "ogg": { 
            args.push(
                "-c:a", "libvorbis", "-q:a", "5" 
            );
            break; 
        }
                
        case "aac": { 
            args.push(
                "-c:a", "aac", "-b:a", "192k"
            );
            break; 
        }

        case "aiff": { 
            args.push(
                "-c:a", "pcm_s16be", "-b:a", "192k"   
            );
            break; 
        }

        case "flac": { 
            args.push(
                "-c:a", "flac", 
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

    return { blob, url, out };
}

export default convertAudio;
