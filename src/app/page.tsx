import Image from "next/image";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>      
      <section id="navbar">
        <Navbar />
      </section>

      <section id="footer">
        <Footer/>
      </section>
    </div>
  );
}
