jest.mock('@ffmpeg/ffmpeg', () => {
    const mockImageData = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 
        0, 0, 0, 13, 73, 72, 68, 82,
    ]);

  const instance = {
    load:     jest.fn().mockResolvedValue(undefined),
    on:       jest.fn(),
    writeFile:jest.fn().mockResolvedValue(undefined),
    exec:     jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue(mockImageData),
  };

  const FFmpeg = jest.fn(() => instance);
  return { FFmpeg, __mock: { instance, mockImageData } };
});


import { FFmpeg } from '@ffmpeg/ffmpeg';
import convertImage, { ImageFormat, mime } from '@/lib/convert/images';
import { __resetFFmpegSingletonForTests } from '@/lib/convert/ffmpeg';

function makeFile(name: string, type = "application/octet-stream") {
    const data = new Uint8Array([1, 2, 3, 4]);
    return new File([data], name, { type });
}

global.URL.createObjectURL = jest.fn(() => "blob:test-url");

describe("MIME extension test for image formats", () => {
    it.each([
        {fileName: "test.png", expectedMime: "image/png"}, 
        {fileName: "test.jpg", expectedMime: "image/jpeg"}, 
        {fileName: "test.webp",expectedMime: "image/webp"}
    
    ])("Returns $expectedMime for $fileName", ({fileName, expectedMime}) => {
        const file = makeFile(fileName, "");
        const ext = file.name.split(".").pop() as ImageFormat;
        expect(mime(ext)).toBe(expectedMime);
    })
})

describe("Conversion tests for each image format", () => {
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
        {name: "test", inType: "png", outType: "png", inMime: "image/png", outMime: "image/png", args: ["-i", "in.png", "-compression_level", "6", `out-${FIXED}.png`]},
        {name: "test", inType: "png", outType: "jpg", inMime: "image/png", outMime: "image/jpeg", args: ["-i", "in.png", "-vf", "format=rgb24", "-qscale:v", "3", `out-${FIXED}.jpg`]},
        {name: "test", inType: "png", outType: "webp", inMime: "image/png", outMime: "image/webp", args: ["-i", "in.png", "-q:v", "85", "-pix_fmt", "rgb24", `out-${FIXED}.webp`]},

        {name: "test", inType: "jpg", outType: "png", inMime: "image/jpeg", outMime: "image/png", args: ["-i", "in.jpg", "-compression_level", "6", `out-${FIXED}.png`]},
        {name: "test", inType: "jpg", outType: "jpg", inMime: "image/jpeg", outMime: "image/jpeg", args: ["-i", "in.jpg", "-vf", "format=rgb24", "-qscale:v", "3", `out-${FIXED}.jpg`]},
        {name: "test", inType: "jpg", outType: "webp", inMime: "image/jpeg", outMime: "image/webp", args: ["-i", "in.jpg", "-q:v", "85", "-pix_fmt", "rgb24", `out-${FIXED}.webp`]},

        {name: "test", inType: "webp", outType: "png", inMime: "image/webp", outMime: "image/png", args: ["-i", "in.webp", "-compression_level", "6", `out-${FIXED}.png`]},
        {name: "test", inType: "webp", outType: "jpg", inMime: "image/webp", outMime: "image/jpeg", args: ["-i", "in.webp", "-vf", "format=rgb24", "-qscale:v", "3", `out-${FIXED}.jpg`]},
        {name: "test", inType: "webp", outType: "webp", inMime: "image/webp", outMime: "image/webp", args: ["-i", "in.webp", "-q:v", "85", "-pix_fmt", "rgb24", `out-${FIXED}.webp`]}
    
    ])("Converts $inType to $outType", async ({ name, inType, outType, inMime, outMime, args }) => {
        const file = makeFile(`${name}.${inType}`, mime(inType as ImageFormat));
        const res = await convertImage(file, outType as ImageFormat);
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
