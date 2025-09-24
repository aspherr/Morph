"use client"

import { useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react"

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openExplorer = () => {
    fileInputRef.current?.click();
  }

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

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
              <div className="flex items-center w-full h-16 max-w-3xl border rounded-lg border-black dark:border-white">
                <div className="ml-5 space-x-2">
                  <span className="font-semibold text-sm">{file.name}</span>
                  <span className="font-light text-sm opacity-50">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
                </div>

                <div onClick={removeFile} className="ml-auto mr-5">
                  <X className="h-[1rem] w-[1rem] rotate-0 transition-all cursor-pointer" strokeWidth={2}/>
                </div>
              </div>
            
            ) : (
              <div className="w-full h-52 max-w-3xl border-2 border-dashed rounded-xl border-black dark:border-white">
                <div onClick={openExplorer} className="flex w-full h-full items-center justify-center gap-2 opacity-70 cursor-pointer">
                  <CloudUpload className="h-[2rem] w-[2rem] rotate-0 transition-all" strokeWidth={1}/>
                  <span className="font-semibold text-lg:">
                    Upload or Drop Your File Here
                  </span>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={loadFile}
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
