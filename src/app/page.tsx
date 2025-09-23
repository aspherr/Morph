import Image from "next/image";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
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
      </main>

      <section id="footer">
        <Footer/>
      </section>
    </div>
  );
}
