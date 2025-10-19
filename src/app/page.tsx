"use client"

import { useRef, useEffect, useState, DragEvent } from "react";
import { Upload, File, FileCheck2, X, Image, FileText, AudioLines, Video } from "lucide-react"
import { useTheme } from "next-themes";

import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"

import Navbar from "@/components/navbar";
import ClickSpark from "@/components/ClickSpark";
import Selector from "@/components/selector";
import Status from "@/components/status";
import Footer from "@/components/footer";
import convertImage, { ImageFormat } from "@/lib/convert/images" 


export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [disabled, setDisabled] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  type StatusState = "idle" | "busy" | "success" | "error";
  const [status, setStatus] = useState<StatusState>("idle");

  useEffect(() => setMounted(true), []);

  const sparkColour = mounted && resolvedTheme === "dark" ? "#fff" : "#000";
  
  const openExplorer = () => {
    fileInputRef.current?.click();
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      toast.success("File has been uploaded successfully.");
      return;
    }
    toast.error("Failed to upload file");
  }
  
  const handleDragOver = (e: DragEvent<HTMLInputElement>) => { e.preventDefault(); setDrag(true); }

  const handleDragLeave = (e: DragEvent<HTMLInputElement>) => { e.preventDefault(); setDrag(false); }

  const dragAndDropFile = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();        
    e.stopPropagation();
    setDrag(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      toast.success("File has been uploaded successfully.");
      return;
    }
     toast.error("Failed to upload file");
  }

  const uploadIcon = drag ? 
    <FileCheck2 className="h-[1.5rem] w-[1.5rem] rotate-0 transition-all" strokeWidth={1.5}/>
    : <Upload className="h-[1.5rem] w-[1.5rem] rotate-0 transition-all" strokeWidth={1.5}/>
  
  const uploadText = drag ?
    "Release To Upload Your File"
    : "Upload Or Drop Your File Here"

  const removeFile = () => { setFile(null); setDisabled(""); setBusy(false); setStatus("idle"); setUrl(null); }

  const getFileIcon = (ext: string) => {
    const imageExts = ["jpg", "png", "webp", "gif", "svg"]
    const docExts = ["pdf", "docx", "xlsx", "txt", "md", "html", "csv"]
    const audioExts = ["mp3", "wav", "ogg"]
    const videoExts = ["mp4", "webm"]

    const lower = ext.toLowerCase()
    const classes = "h-[1.25rem] w-[1.25rem] rotate-0 transition-all cursor-pointer"

    if (imageExts.includes(lower)) return <Image className={classes} strokeWidth={2}/>
    if (docExts.includes(lower)) return <FileText className={classes} strokeWidth={2}/>
    if (audioExts.includes(lower)) return <AudioLines className={classes} strokeWidth={2}/>
    if (videoExts.includes(lower)) return <Video className={classes} strokeWidth={2}/>

    return <File className={classes} strokeWidth={2}/>
  }

  const ext = file?.name.split(".").pop() || ""
  const fileIcon = getFileIcon(ext)

  const handleConversion = async () => {
    setStatus("busy");
    if (!file) {
      console.error("No file found.");
      return;
    }

    try {
      const res = await convertImage(file, format as ImageFormat);
      setUrl(res.url);
      setStatus("success");
      toast.success("File converted successfully.")

    } catch (error) {
      console.error("Conversion failed:", error);
      setStatus("error");
      toast.success("File failed to convert.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col mx-10">
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
              <h1 className="font-semibold text-4xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">Convert Any File. Instantly.</h1>
              <p className="font-light text-md md:text-md lg:text-lg">
                Upload your files and get them back in the format you need—fast, secure, and free.
              </p>
            </div>
          </section>

          <section id="converter" className="flex items-center justify-center mt-10 md:mt-20">
            {file ? (
              <div className="flex w-full max-w-3xl flex-col">
                <div className="relative flex flex-wrap sm:flex-row items-center w-full h-28 md:h-18 border rounded-lg border-black dark:border-white ">
                  <div className="flex flex-row ml-7 mt-2 sm:mt-0 space-x-2 items-center justify-center text-sm">
                    {fileIcon}
                    <span className="font-semibold truncate max-w-[100px] sm:max-w-[200px]">{file.name}</span>
                    <span className="font-light opacity-50">{(file.size / (1024 * 1024)).toFixed(3)}MB</span>
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
                      <Selector value={disabled} extension={ext} onChange={(fmt) => {setDisabled(fmt); setFormat(fmt)}} converted={url}/>
                    </div>

                    {!url && (
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
                    <Button disabled={!disabled} onClick={handleConversion}>
                      <span className="text-md">
                        {busy ? "Converting..." : "Convert"}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
              
              ) : (
                <div className={`flex w-full h-52 max-w-3xl border-3 border-dashed rounded-xl ${drag ? "border-green-500" : "border-black dark:border-white"}`}>
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
                      ref={fileInputRef}
                      onChange={uploadFile}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
          </section>
        </main>

        <section id="footer">
          <Footer/>
        </section>
      </ClickSpark> 
    </div>
  );
}
