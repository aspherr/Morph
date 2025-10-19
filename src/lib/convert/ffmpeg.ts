import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;

async function initFFmpeg(): Promise<FFmpeg> {
    if (ffmpeg) return ffmpeg;
    ffmpeg = new FFmpeg();
    
    await ffmpeg.load();
    return ffmpeg
}

export default initFFmpeg;
