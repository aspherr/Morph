"use client"

import { useRef, useEffect, useState, DragEvent } from "react";
import { Upload, File, FileCheck2, X, Image, AudioLines, Video } from "lucide-react"
import { useTheme } from "next-themes";

import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import Navbar from "@/components/navbar";
import ClickSpark from "@/components/ClickSpark";
import Selector from "@/components/selector";
import Status from "@/components/status";
import FormatCard from "@/components/formatCard";
import Footer from "@/components/footer";

import convertImage, { ImageFormat } from "@/lib/convert/images" 
import convertVideo, { VideoFormat } from "@/lib/convert/video" 
import convertAudio, { AudioFormat } from "@/lib/convert/audio";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imageExts = ["jpg", "png", "webp"]
  const audioExts = ["mp3", "wav", "ogg", "aac", "aiff", "flac"]
  const videoExts = ["mp4", "webm", "mkv", "mov", "mp3"]

  type StatusState = "idle" | "busy" | "success" | "error";
  const [status, setStatus] = useState<StatusState>("idle");

  useEffect(() => setMounted(true), []);

  const sparkColour = mounted && resolvedTheme === "dark" ? "#fff" : "#000";
  
  const openExplorer = () => {
    fileInputRef.current?.click();
  }

  const validFormat = (file: File) => {
    const validFormats = [
      "image/jpg","image/jpeg", "image/png", "image/webp",
      "audio/mpeg", "audio/x-wav", "audio/ogg", "application/ogg", "audio/aac", "audio/x-aiff", "audio/flac",
      "video/mp4", "video/webm", "video/x-matroska", "video/quicktime",
    ];
    return validFormats.includes(file?.type);
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && validFormat(files[0])) {
      setFile(files[0]);
      toast.success("File has been uploaded successfully.");
      return;
    }
    
    e.target.value = "";
    toast.error("Sorry, upload failed — we don’t support that file format.");
  }
  
  const handleDragOver = (e: DragEvent<HTMLInputElement>) => { e.preventDefault(); setDrag(true); }

  const handleDragLeave = (e: DragEvent<HTMLInputElement>) => { e.preventDefault(); setDrag(false); }

  const dragAndDropFile = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();        
    e.stopPropagation();
    setDrag(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && validFormat(files[0])) {
      setFile(files[0]);
      toast.success("File has been uploaded successfully.");
      return;
    }

    toast.error("Sorry, upload failed — we don’t support that file format.");
  }

  const uploadIcon = drag ? 
    <FileCheck2 className="h-[1.5rem] w-[1.5rem] rotate-0 transition-all" strokeWidth={1.5}/>
    : <Upload className="h-[1.5rem] w-[1.5rem] rotate-0 transition-all" strokeWidth={1.5}/>
  
  const uploadText = drag ?
    "Release To Upload Your File"
    : "Upload Or Drop Your File Here"
  
  const inferType = (ext: string): "image" | "audio" | "video" | "file" => {
    const lower = ext.toLowerCase();
    if (imageExts.includes(lower)) return "image";
    if (audioExts.includes(lower)) return "audio";
    if (videoExts.includes(lower)) return "video";
    return "file";
  }

  const removeFile = () => { setFile(null); setFormat(""); setStatus("idle"); setUrl(null); }

  const getFileIcon = (ext: string) => {
    const lower = ext.toLowerCase()
    const classes = "h-[1.25rem] w-[1.25rem] rotate-0 transition-all cursor-pointer"

    if (imageExts.includes(lower)) return <Image className={classes} strokeWidth={2}/>
    if (audioExts.includes(lower)) return <AudioLines className={classes} strokeWidth={2}/>
    if (videoExts.includes(lower)) return <Video className={classes} strokeWidth={2}/>

    return <File className={classes} strokeWidth={2}/>
  }

  const ext = file?.name.split(".").pop() || ""
  const type = inferType(ext);
  const fileIcon = getFileIcon(ext)

  const handleConversion = async () => {
    setStatus("busy");
    if (!file) {
      console.error("No file found.");
      return;
    }

    try {
      switch (type) {
        case "image": {
          const res = await convertImage(file, format as ImageFormat, { onProgress: setProgress });
          setUrl(res.url);
          break;
        }
        
        case "video": {
          const res = await convertVideo(file, format as VideoFormat, { onProgress: setProgress });
          setUrl(res.url);
          break;
        }

        case "audio": {
          const res = await convertAudio(file, format as AudioFormat, { onProgress: setProgress });
          setUrl(res.url);
          break;
        }
      }

      setStatus("success");
      toast.success("File converted successfully.")

    } catch (error) {
      console.error("Conversion failed:", error);
      setStatus("error");
      toast.error("File failed to convert.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col mx-10">
      <div className="flex-1">
        <ClickSpark
        sparkColor={sparkColour}
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}>  
        
          <section id="navbar">
            <Navbar />
          </section>

          <main className="flex-1 font-inter">
            <section id="hero">
              <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="font-semibold text-4xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">Convert Your Media. Instantly.</h1>
                <p className="font-light text-md md:text-md lg:text-lg">
                  Upload your photos, videos, or audio files and get them back in the format you need — 
                  <Popover>
                    <PopoverTrigger className="underline cursor-pointer"> fast, secure, and free.</PopoverTrigger>
                    <PopoverContent className="mt-2 mx-10">
                      Powered by <span className="text-sm font-semibold">FFmpeg.wasm</span>. All processing happens right in your browser.
                    </PopoverContent> 
                  </Popover>
                </p>
              </div>
            </section>

            <section id="converter" className="flex items-center justify-center mt-10 md:mt-20">
              {file ? (
                <div className="flex w-full max-w-3xl flex-col">
                  <div className="relative flex flex-wrap sm:flex-row items-center w-full h-28 md:h-18 border-2 rounded-lg border-black dark:border-white/60 ">
                    <div className="flex flex-row ml-7 mt-2 sm:mt-0 space-x-2 items-center justify-center text-sm">
                      {fileIcon}
                      <span className="font-semibold truncate max-w-[85px] sm:max-w-[200px]">{file.name}</span>
                      <span className="font-light opacity-50">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
                      {status === "busy" ? (
                        <Spinner />
                        
                      ) : status === "success" ? (
                        <Status isReady={true} />
                      
                      ): status === "error" ? (
                        <Status isReady={false} />
                      
                      ): null}
                    </div>

                    <div className="flex items-center w-full md:w-auto mr-auto md:mr-0 md:ml-auto">
                      <div className="ml-5 mr-5 mb-4 md:mb-0 md:ml-0 w-full">
                        <Selector value={format} extension={ext} onChange={(fmt) => {setFormat(fmt)}} isBusy={status !== "idle"}/>
                      </div>

                      {!url && status === "idle" && (
                        <div onClick={removeFile} className="absolute -top-2 -right-2 pointer-events-auto sm:static sm:ml-4 sm:mr-7 rounded-full p-1 bg-accent md:bg-background hover:text-accent-foreground hover:bg-accent dark:hover:bg-input/50 transition-all duration-300">
                          <X className="h-[1rem] w-[1rem] rotate-0 transition-all cursor-pointer" strokeWidth={2}/>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-end mt-4 gap-3">
                    {url ? (
                      <>
                        <Button onClick={removeFile}>
                          <span className="text-md">Convert Another File</span>
                        </Button>

                        <Button asChild>
                          <a href={url} download={`${file.name.replace(/\.[^/.]+$/, "")}.${format}`} className="text-md">Download</a>
                        </Button>
                      </>

                    ) : (
                      <Button disabled={!format || status !== "idle"} onClick={handleConversion}>
                        <span className="text-md">
                          {status === "busy" ? `Converting - ${progress}%` : "Convert"}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
                
                ) : (
                  <div className={`flex w-full h-52 max-w-3xl border-3 border-dashed rounded-xl ${drag ? "border-emerald-600" : "border-neutral-700/75 dark:border-white/60"}`}>
                    <div 
                    onClick={openExplorer}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={dragAndDropFile}
                    className="flex flex-col sm:flex-row w-full h-full items-center justify-center gap-2 opacity-70 cursor-pointer">
                      {uploadIcon}
                      <span className="font-semibold text-sm sm:text-sm md:text-md lg:text-lg">
                        {uploadText}
                      </span>
                    
                      <input
                        type="file"
                        aria-label="drop-area"
                        ref={fileInputRef}
                        onChange={uploadFile}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
            </section>
          </main>

          <section id="info">
            <div className="flex flex-col w-full items-center justify-center mt-25 space-y-10">
              <div className="text-2xl font-semibold">
                <h1 className="font-semibold text-3xl leading-tight">Supported Formats</h1>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-5 items-center justify-center">
                <FormatCard name={"Image"} icon={Image} formats={imageExts} />
                <FormatCard name={"Video"} icon={Video} formats={videoExts} />
                <FormatCard name={"Audio"} icon={AudioLines} formats={audioExts} />
              </div>
            </div>
          </section>

        </ClickSpark> 
      </div>
      
      <section id="footer" className="mt-20 mb-2">
          <Footer/>
      </section>
    </div>
  );
}
