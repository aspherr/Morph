import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;
const initFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg) return ffmpeg;
    ffmpeg = new FFmpeg();
    
    await ffmpeg.load();
    return ffmpeg
}

export default initFFmpeg;
