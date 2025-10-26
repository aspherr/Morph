jest.mock('@ffmpeg/ffmpeg', () => {
  const mockAudioData = new Uint8Array([
    0x49, 0x44, 0x33,
    0x04, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x21,
    0x52, 0x49, 0x46, 0x46,
    0x24, 0x08, 0x00, 0x00,
    0x57, 0x41, 0x56, 0x45,
    0x66, 0x6D, 0x74, 0x20,
  ]);

  const instance = {
    load:     jest.fn().mockResolvedValue(undefined),
    on:       jest.fn(),
    writeFile:jest.fn().mockResolvedValue(undefined),
    exec:     jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue(mockAudioData),
  };

  const FFmpeg = jest.fn(() => instance);
  return { FFmpeg, __mock: { instance, mockAudioData } };
});


import { FFmpeg } from '@ffmpeg/ffmpeg';
import convertAudio, { AudioFormat, mime } from '@/lib/convert/audio';
import { __resetFFmpegSingletonForTests } from '@/lib/convert/ffmpeg';

function makeFile(name: string, type = "application/octet-stream") {
    const data = new Uint8Array([1, 2, 3, 4]);
    return new File([data], name, { type });
}

global.URL.createObjectURL = jest.fn(() => "blob:test-url");

describe("MIME extension test for audio formats", () => {
    it.each([
        {fileName: "test.mp3", expectedMime: "audio/mpeg"}, 
        {fileName: "test.wav", expectedMime: "audio/wav"}, 
        {fileName: "test.ogg", expectedMime: "audio/ogg"},
        {fileName: "test.aac", expectedMime: "audio/aac"},
        {fileName: "test.aiff", expectedMime: "audio/x-aiff"}, 
        {fileName: "test.flac", expectedMime: "audio/flac"},
    
    ])("Returns $expectedMime for $fileName", ({fileName, expectedMime}) => {
        const file = makeFile(fileName, "");
        const ext = file.name.split(".").pop() as AudioFormat;
        expect(mime(ext)).toBe(expectedMime);
    })
})

describe("Conversion tests for each audio format", () => {
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
        {name: "test", inType: "mp3", outType: "wav", inMime: "audio/mpeg", outMime: "audio/wav", args: ["-y", "-i", "in.mp3", "-c:a", "pcm_s16le", `out-${FIXED}.wav`]},
        {name: "test", inType: "mp3", outType: "ogg", inMime: "audio/mpeg", outMime: "audio/ogg", args: ["-y", "-i", "in.mp3", "-c:a", "libvorbis", "-q:a", "5", `out-${FIXED}.ogg`]},
        {name: "test", inType: "mp3", outType: "aac", inMime: "audio/mpeg", outMime: "audio/aac", args: ["-y", "-i", "in.mp3", "-c:a", "aac", "-b:a", "192k", `out-${FIXED}.aac`]},
        {name: "test", inType: "mp3", outType: "aiff", inMime: "audio/mpeg", outMime: "audio/x-aiff", args: ["-y", "-i", "in.mp3", "-c:a", "pcm_s16be", "-b:a", "192k" , `out-${FIXED}.aiff`]},
        {name: "test", inType: "mp3", outType: "flac", inMime: "audio/mpeg", outMime: "audio/flac", args: ["-y", "-i", "in.mp3",  "-c:a", "flac", `out-${FIXED}.flac`]},
    
        {name: "test", inType: "wav", outType: "mp3", inMime: "audio/wav", outMime: "audio/mpeg", args: ["-y", "-i", "in.wav", "-c:a", "libmp3lame", "-q:a", "2", `out-${FIXED}.mp3`]},
        {name: "test", inType: "wav", outType: "ogg", inMime: "audio/wav", outMime: "audio/ogg", args: ["-y", "-i", "in.wav", "-c:a", "libvorbis", "-q:a", "5", `out-${FIXED}.ogg`]},
        {name: "test", inType: "wav", outType: "aac", inMime: "audio/wav", outMime: "audio/aac", args: ["-y", "-i", "in.wav", "-c:a", "aac", "-b:a", "192k", `out-${FIXED}.aac`]},
        {name: "test", inType: "wav", outType: "aiff", inMime: "audio/wav", outMime: "audio/x-aiff", args: ["-y", "-i", "in.wav", "-c:a", "pcm_s16be", "-b:a", "192k" , `out-${FIXED}.aiff`]},
        {name: "test", inType: "wav", outType: "flac", inMime: "audio/wav", outMime: "audio/flac", args: ["-y", "-i", "in.wav",  "-c:a", "flac", `out-${FIXED}.flac`]},

        {name: "test", inType: "ogg", outType: "mp3", inMime: "audio/ogg", outMime: "audio/mpeg", args: ["-y", "-i", "in.ogg", "-c:a", "libmp3lame", "-q:a", "2", `out-${FIXED}.mp3`]},
        {name: "test", inType: "ogg", outType: "wav", inMime: "audio/ogg", outMime: "audio/wav", args: ["-y", "-i", "in.ogg", "-c:a", "pcm_s16le", `out-${FIXED}.wav`]},
        {name: "test", inType: "ogg", outType: "aac", inMime: "audio/ogg", outMime: "audio/aac", args: ["-y", "-i", "in.ogg", "-c:a", "aac", "-b:a", "192k", `out-${FIXED}.aac`]},
        {name: "test", inType: "ogg", outType: "aiff", inMime: "audio/ogg", outMime: "audio/x-aiff", args: ["-y", "-i", "in.ogg", "-c:a", "pcm_s16be", "-b:a", "192k" , `out-${FIXED}.aiff`]},
        {name: "test", inType: "ogg", outType: "flac", inMime: "audio/ogg", outMime: "audio/flac", args: ["-y", "-i", "in.ogg",  "-c:a", "flac", `out-${FIXED}.flac`]},
        
        {name: "test", inType: "aac", outType: "mp3", inMime: "audio/aac", outMime: "audio/mpeg", args: ["-y", "-i", "in.aac", "-c:a", "libmp3lame", "-q:a", "2", `out-${FIXED}.mp3`]},
        {name: "test", inType: "aac", outType: "wav", inMime: "audio/aac", outMime: "audio/wav", args: ["-y", "-i", "in.aac", "-c:a", "pcm_s16le", `out-${FIXED}.wav`]},
        {name: "test", inType: "aac", outType: "ogg", inMime: "audio/aac", outMime: "audio/ogg", args: ["-y", "-i", "in.aac", "-c:a", "libvorbis", "-q:a", "5", `out-${FIXED}.ogg`]},
        {name: "test", inType: "aac", outType: "aiff", inMime: "audio/aac", outMime: "audio/x-aiff", args: ["-y", "-i", "in.aac", "-c:a", "pcm_s16be", "-b:a", "192k" , `out-${FIXED}.aiff`]},
        {name: "test", inType: "aac", outType: "flac", inMime: "audio/aac", outMime: "audio/flac", args: ["-y", "-i", "in.aac",  "-c:a", "flac", `out-${FIXED}.flac`]},

        {name: "test", inType: "aiff", outType: "mp3", inMime: "audio/x-aiff", outMime: "audio/mpeg", args: ["-y", "-i", "in.aiff",  "-c:a", "libmp3lame", "-q:a", "2", `out-${FIXED}.mp3`]},
        {name: "test", inType: "aiff", outType: "wav", inMime: "audio/x-aiff", outMime: "audio/wav", args: ["-y", "-i", "in.aiff", "-c:a", "pcm_s16le", `out-${FIXED}.wav`]},
        {name: "test", inType: "aiff", outType: "ogg", inMime: "audio/x-aiff", outMime: "audio/ogg", args: ["-y", "-i", "in.aiff", "-c:a", "libvorbis", "-q:a", "5", `out-${FIXED}.ogg`]},
        {name: "test", inType: "aiff", outType: "aac", inMime: "audio/x-aiff", outMime: "audio/aac", args: ["-y", "-i", "in.aiff", "-c:a", "aac", "-b:a", "192k", `out-${FIXED}.aac`]},
        {name: "test", inType: "aiff", outType: "flac", inMime: "audio/x-aiff", outMime: "audio/flac", args: ["-y", "-i", "in.aiff", "-c:a", "flac", `out-${FIXED}.flac`]},
    
        {name: "test", inType: "flac", outType: "mp3", inMime: "audio/flac", outMime: "audio/mpeg", args: ["-y", "-i", "in.flac",  "-c:a", "libmp3lame", "-q:a", "2", `out-${FIXED}.mp3`]},
        {name: "test", inType: "flac", outType: "wav", inMime: "audio/flac", outMime: "audio/wav", args: ["-y", "-i", "in.flac", "-c:a", "pcm_s16le", `out-${FIXED}.wav`]},
        {name: "test", inType: "flac", outType: "ogg", inMime: "audio/flac", outMime: "audio/ogg", args: ["-y", "-i", "in.flac", "-c:a", "libvorbis", "-q:a", "5", `out-${FIXED}.ogg`]},
        {name: "test", inType: "flac", outType: "aac", inMime: "audio/flac", outMime: "audio/aac", args: ["-y", "-i", "in.flac", "-c:a", "aac", "-b:a", "192k", `out-${FIXED}.aac`]},
        {name: "test", inType: "flac", outType: "aiff", inMime: "audio/flac", outMime: "audio/x-aiff", args: ["-y", "-i", "in.flac", "-c:a", "pcm_s16be", "-b:a", "192k" , `out-${FIXED}.aiff`]},


    ])("Converts $inType to $outType", async ({ name, inType, outType, inMime, outMime, args }) => {
        const file = makeFile(`${name}.${inType}`, mime(inType as AudioFormat));
        const res = await convertAudio(file, outType as AudioFormat);
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
