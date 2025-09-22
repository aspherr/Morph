import Image from "next/image";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="mx-10">      
      <section id="navbar">
        <Navbar />
      </section>

      <section id="footer">
        <Footer/>
      </section>
    </div>
  );
}
