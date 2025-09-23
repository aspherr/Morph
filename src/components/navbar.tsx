"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { siGithub } from "simple-icons"
import { Button } from "@/components/ui/button"

import Toggle from "./toggle";
import Feedback from "./feedback";

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
        <nav className="w-full flex items-center justify-between border-b-white mt-10">
            <div>
                <a href="/">
                    <Image src={src} alt="Morph Logo" width={150} height={150} />
                </a>
            </div>

            <ul className="flex items-center space-x-4">
                <li>
                    <Feedback />
                </li>

                <li>
                    <a href="https://github.com/aspherr/Morph" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                            <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current">
                                <title>{siGithub.title}</title>
                                <path d={siGithub.path} />
                            </svg>
                        </Button>
                    </a>
                </li>

                <li>
                    <Toggle />
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
