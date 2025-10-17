import getFFmpeg from "./ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type ImageFormat = "jpg" | "png" | "webp";
function mime(ext: ImageFormat): string {
  return ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";
}

const convertImage = async (file: File, outExt: ImageFormat, opts?: { quality?: number; webpLossless?: boolean }) => {
    const ffmpeg = await getFFmpeg();
    
    const ext = (file.name.split(".").pop() || "img").toLowerCase();
    const inpExt = (["jpg", "png", "webp"] as const).includes(ext as any)
                        ? (ext as ImageFormat)
                        : "jpg";
    
    const inp = `in.${inpExt}`;
    const out = `out.${outExt}`;

    await ffmpeg.writeFile(inp, await fetchFile(file));
    const args: string[] = ["-i", inp];

    switch (ext) {
        case "jpg": { args.push("-vf", "format=rgb24", "-qscale:v", "3"); break; }    
        case "png": { args.push("-compression_level", "6"); break; }
        case "webp": { args.push("-q:v", "85"); break; }
    }

    args.push(out);
    await ffmpeg.exec(args);

    const data = (await ffmpeg.readFile(out)) as Uint8Array;
    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type: mime(outExt) });
    const url = URL.createObjectURL(blob);

    return { blob, url, out };
}

export default convertImage;
