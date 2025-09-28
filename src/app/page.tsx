"use client"

import { useRef, useEffect, useState, DragEvent } from "react";
import { CloudUpload, File, FileCheck2, X, Image, FileText, AudioLines, Video, Archive } from "lucide-react"
import { useTheme } from "next-themes";
import { toast } from "sonner"

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ClickSpark from "@/components/ClickSpark";
import Selector from "@/components/selector";
import Footer from "@/components/footer";


export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [disabled, setDisabled] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    <FileCheck2 className="h-[1.75rem] w-[1.75rem] rotate-0 transition-all" strokeWidth={1.5}/>
    : <CloudUpload className="h-[1.75rem] w-[1.75rem] rotate-0 transition-all" strokeWidth={1.5}/>
  
  const uploadText = drag ?
    "Release To Upload Your File"
    : "Upload Or Drop Your File Here"

  const removeFile = () => { setFile(null); setDisabled("") }

  const getFileIcon = (ext: string) => {
    const imageExts = ["jpg", "jpeg", "png", "webp", "avif", "heic", "gif", "svg"]
    const docExts = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "txt", "md", "html", "csv", "json", "xml"]
    const audioExts = ["mp3", "wav", "aac", "flac", "ogg", "opus", "m4a"]
    const videoExts = ["mp4", "webm", "mov", "avi", "mkv"]
    const archiveExts = ["zip", "tar", "gz", "7z", "rar"]

    const lower = ext.toLowerCase()
    const classes = "h-[1.25rem] w-[1.25rem] rotate-0 transition-all cursor-pointer"

    if (imageExts.includes(lower)) return <Image className={classes} strokeWidth={2}/>
    if (docExts.includes(lower)) return <FileText className={classes} strokeWidth={2}/>
    if (audioExts.includes(lower)) return <AudioLines className={classes} strokeWidth={2}/>
    if (videoExts.includes(lower)) return <Video className={classes} strokeWidth={2}/>
    if (archiveExts.includes(lower)) return <Archive className={classes} strokeWidth={2}/>

    return <File className={classes} strokeWidth={2}/>
  }

  const ext = file?.name.split(".").pop() || ""
  const fileIcon = getFileIcon(ext)

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
          <section id="hero" className="mt-20">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="font-semibold text-4xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">Convert Any File. Instantly.</h1>
              <p className="font-light text-md">
                Upload your files and get them back in the format you need—fast, secure, and free.
              </p>
            </div>
          </section>

          <section id="converter" className="flex items-center justify-center mt-10 md:mt-20">
            {file ? (
              <div className="flex w-full max-w-3xl flex-col">
                <div className="relative flex flex-wrap sm:flex-row items-center w-full h-18 border rounded-lg border-black dark:border-white ">
                  <div className="flex flex-row ml-5 space-x-2 items-center">
                    {fileIcon}
                    <span className="font-semibold text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="font-light text-sm opacity-50">{(file.size / (1024 * 1024)).toFixed(3)}MB</span>
                  </div>

                  <div className="flex items-center ml-auto">
                    <div className="mr-10">
                      <Selector value={disabled} extension={ext} onChange={setDisabled}/>
                    </div>

                    <div onClick={removeFile} className="absolute -top-2 -right-2 pointer-events-auto sm:static sm:ml-4 sm:mr-5 border sm:border-none border-black dark:border-white rounded-full p-1 bg-background hover:text-accent-foreground hover:bg-accent dark:hover:bg-input/50 transistion-all duration-300">
                      <X className="h-[1rem] w-[1rem] rotate-0 transition-all cursor-pointer" strokeWidth={2}/>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-end mt-4">
                  <Button disabled={!disabled}>
                    <span className="text-md">Convert</span>
                  </Button>
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
