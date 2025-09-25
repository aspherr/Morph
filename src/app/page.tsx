"use client"

import { useRef, useState, DragEvent } from "react";
import { CloudUpload, FileCheck2, X, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
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

  const removeFile = () => { setFile(null); }

  return (
    <div className="flex min-h-screen flex-col mx-10">      
      <section id="navbar">
        <Navbar />
      </section>

      <main className="flex-1 font-inter">
        <section id="hero" className="mt-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="font-semibold text-6xl">Convert Any File. Instantly.</h1>
            <p className="font-light text-md">
              Upload your files and get them back in the format you need—fast, secure, and free.
            </p>
          </div>
        </section>

        <section id="converter" className="flex items-center justify-center mt-20">
          {file ? (
            <div className="flex w-full max-w-3xl flex-col">
              <div className="flex items-center w-full h-16 border rounded-lg border-black dark:border-white">
                <div className="ml-5 space-x-2">
                  <span className="font-semibold text-sm">{file.name}</span>
                  <span className="font-light text-sm opacity-50">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
                </div>

                <div onClick={removeFile} className="ml-auto mr-5 rounded-full p-1 bg-background hover:text-accent-foreground hover:bg-accent dark:hover:bg-input/50 transistion-all duration-300">
                  <X className="h-[1rem] w-[1rem] rotate-0 transition-all cursor-pointer" strokeWidth={2}/>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-end mt-4">
                <Button disabled>
                  <span className="text-md">Convert</span>
                </Button>
              </div>
            </div>
            
            ) : (
              <div className={`w-full h-52 max-w-3xl border-3 border-dashed rounded-xl ${drag ? "border-green-500" : "border-black dark:border-white"}`}>
                <div 
                onClick={openExplorer}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={dragAndDropFile}
                className="flex w-full h-full items-center justify-center gap-2 opacity-70 cursor-pointer">
                  {uploadIcon}
                  <span className="font-semibold text-lg">
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
    </div>
  );
}
