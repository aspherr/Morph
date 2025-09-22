"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const src = !mounted
      ? "/images/light-logo.svg"
      : resolvedTheme === "dark"
      ? "/images/dark-logo.svg"
      : "/images/light-logo.svg";
    
    return (
        <nav className="w-full flex items-center justify-between border-b-white">
            <div>
                <a href="#">
                    <Image src={src} alt="Morph Logo" width={275} height={275}/>
                </a>
            </div>

            <ul className="flex items-center space-x-6">
                
            </ul>
        </nav>
    )
}

export default Navbar
