jest.mock('@ffmpeg/ffmpeg', () => {
  const mockVideoData = new Uint8Array([
    0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
    0x69, 0x73, 0x6F, 0x6D,                       
    0x00, 0x00, 0x02, 0x00,                        
    0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32, 
    0x61, 0x76, 0x63, 0x31,                         
  ])

  const instance = {
    load:     jest.fn().mockResolvedValue(undefined),
    on:       jest.fn(),
    writeFile:jest.fn().mockResolvedValue(undefined),
    exec:     jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue(mockVideoData),
  };

  const FFmpeg = jest.fn(() => instance);
  return { FFmpeg, __mock: { instance, mockVideoData } };
});


import { FFmpeg } from '@ffmpeg/ffmpeg';
import convertVideo, { VideoFormat, mime } from '@/lib/convert/video';
import { __resetFFmpegSingletonForTests } from '@/lib/convert/ffmpeg';

function makeFile(name: string, type = "application/octet-stream") {
    const data = new Uint8Array([1, 2, 3, 4]);
    return new File([data], name, { type });
}

global.URL.createObjectURL = jest.fn(() => "blob:test-url");

describe("MIME extension test for video formats", () => {
    it.each([
        {fileName: "test.mp4", expectedMime: "video/mp4"}, 
        {fileName: "test.webm", expectedMime: "video/webm"}, 
        {fileName: "test.mkv",expectedMime: "video/x-matroska"},
        {fileName: "test.mov",expectedMime: "video/quicktime"}
    
    ])("Returns $expectedMime for $fileName", ({fileName, expectedMime}) => {
        const file = makeFile(fileName, "");
        const ext = file.name.split(".").pop() as VideoFormat;
        expect(mime(ext)).toBe(expectedMime);
    })
})

describe("Conversion tests for each video format", () => {
    const FIXED = 1761160956251;

    beforeEach(() => {
        jest.clearAllMocks();
        __resetFFmpegSingletonForTests();
        jest.spyOn(Date, 'now').mockReturnValue(FIXED);
    });

    afterEach(() => {
        (Date.now as jest.Mock).mockRestore?.();
    });

    it.each([
        {name: "test", inType: "mp4", outType: "webm", inMime: "video/mp4", outMime: "video/webm", args: ["-y", "-i", "in.mp4", "-c:v", "libvpx", "-quality", "good", "-deadline", "good", "-cpu-used", "6",          
                "-threads", "0", "-crf", "31", "-b:v", "0", "-g", "240", "-c:a", "libvorbis", "-q:a", "4", `out-${FIXED}.webm`]},
        {name: "test", inType: "mp4", outType: "mkv", inMime: "video/mp4", outMime: "video/x-matroska", args: ["-y", "-i", "in.mp4", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",            
                "-threads", "0", "-g", "240", "-c:a", "aac", "-b:a", "128k", `out-${FIXED}.mkv`]},
        {name: "test", inType: "mp4", outType: "mov", inMime: "video/mp4", outMime: "video/quicktime", args: ["-y", "-i", "in.mp4", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", 
                "-threads", "0", "-g", "240", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k" , `out-${FIXED}.mov`]},

        {name: "test", inType: "webm", outType: "mp4", inMime: "video/webm", outMime: "video/mp4", args: ["-y", "-i", "in.webm", "-c:v", "libx264", "-preset", "ultrafast", "-crf","28", "-pix_fmt","yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `out-${FIXED}.mp4`]},
        {name: "test", inType: "webm", outType: "mkv", inMime: "video/webm", outMime: "video/x-matroska", args: ["-y", "-i", "in.webm", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",            
                "-threads", "0", "-g", "240", "-c:a", "aac", "-b:a", "128k", `out-${FIXED}.mkv`]},
        {name: "test", inType: "webm", outType: "mov", inMime: "video/webm", outMime: "video/quicktime", args: ["-y", "-i", "in.webm", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", 
                "-threads", "0", "-g", "240", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k" , `out-${FIXED}.mov`]},

        {name: "test", inType: "mkv", outType: "mp4", inMime: "video/x-matroska", outMime: "video/mp4", args: ["-y", "-i", "in.mkv", "-c:v", "libx264", "-preset", "ultrafast", "-crf","28", "-pix_fmt","yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `out-${FIXED}.mp4`]},
        {name: "test", inType: "mkv", outType: "webm", inMime: "video/x-matroska", outMime: "video/webm", args: ["-y", "-i", "in.mkv", "-c:v", "libvpx", "-quality", "good", "-deadline", "good", "-cpu-used", "6",          
                "-threads", "0", "-crf", "31", "-b:v", "0", "-g", "240", "-c:a", "libvorbis", "-q:a", "4", `out-${FIXED}.webm`]},
        {name: "test", inType: "mkv", outType: "mov", inMime: "video/x-matroska", outMime: "video/quicktime", args: ["-y", "-i", "in.mkv", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", 
                "-threads", "0", "-g", "240", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k" , `out-${FIXED}.mov`]},

        {name: "test", inType: "mov", outType: "mp4", inMime: "video/quicktime", outMime: "video/mp4", args: ["-y", "-i", "in.mov", "-c:v", "libx264", "-preset", "ultrafast", "-crf","28", "-pix_fmt","yuv420p",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", `out-${FIXED}.mp4`]},
        {name: "test", inType: "mov", outType: "webm", inMime: "video/quicktime", outMime: "video/webm", args: ["-y", "-i", "in.mov", "-c:v", "libvpx", "-quality", "good", "-deadline", "good", "-cpu-used", "6",          
                "-threads", "0", "-crf", "31", "-b:v", "0", "-g", "240", "-c:a", "libvorbis", "-q:a", "4", `out-${FIXED}.webm`]},
        {name: "test", inType: "mov", outType: "mkv", inMime: "video/quicktime", outMime: "video/x-matroska", args: ["-y", "-i", "in.mov", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",            
                "-threads", "0", "-g", "240", "-c:a", "aac", "-b:a", "128k", `out-${FIXED}.mkv`]},

    ])("Converts $inType to $outType", async ({ name, inType, outType, inMime, outMime, args }) => {
        const file = makeFile(`${name}.${inType}`, mime(inType as VideoFormat));
        const res = await convertVideo(file, outType as VideoFormat);
        const { __mock } = jest.requireMock('@ffmpeg/ffmpeg') as {
            __mock: {
            instance: {
                    exec: jest.Mock;
                    writeFile: jest.Mock;
                    readFile: jest.Mock;
                };
            };
        };

        expect(FFmpeg).toHaveBeenCalledTimes(1);
        const ffmpegInstance = (__mock as any).instance;
        
        expect(file.type).toBe(inMime);
        expect(ffmpegInstance.writeFile).toHaveBeenCalledWith(`in.${inType}`, expect.any(Uint8Array));
        expect(ffmpegInstance.exec).toHaveBeenCalledWith(args)

        expect(ffmpegInstance.readFile).toHaveBeenCalledWith(`out-${FIXED}.${outType}`);
        const [[filename, bytes]] = ffmpegInstance.writeFile.mock.calls;
        
        expect(filename).toBe(`in.${inType}`);
        expect(res.out).toBe(`out-${FIXED}.${outType}`);
        
        expect(bytes).toBeInstanceOf(Uint8Array);
        expect(bytes.length).toBeGreaterThan(0);
        
        expect(res.blob).toBeInstanceOf(Blob);
        expect(res.blob.type).toBe(outMime);
        expect(res.url).toBe("blob:test-url");

    })
});
