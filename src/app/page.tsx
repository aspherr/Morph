import Image from "next/image";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col mx-10">      
      <section id="navbar">
        <Navbar />
      </section>

      <main className="flex-1">
        
      </main>

      <section id="footer">
        <Footer/>
      </section>
    </div>
  );
}
