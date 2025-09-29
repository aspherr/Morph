"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { siGithub } from "simple-icons"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup
} from "@/components/ui/dropdown-menu"

import Toggle from "./toggle";
import Feedback from "./feedback";
import FeedbackSheet from "./feedbackSheet";


const Navbar = () => {
    const { resolvedTheme, setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => setMounted(true), []);

    const src = !mounted
      ? "/images/light-logo.svg"
      : resolvedTheme === "dark"
      ? "/images/dark-logo.svg"
      : "/images/light-logo.svg";

    const openFeedback = () => {}
    
    return (
        <nav className="w-full flex items-center justify-between border-b-white mt-10">
            <div>
                <a href="/">
                    <Image src={src} alt="Morph Logo" width={150} height={150} />
                </a>
            </div>

            <ul className="hidden md:flex items-center space-x-4">
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

            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden focus:outline-none">
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <FeedbackSheet
                        trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Feedback
                        </DropdownMenuItem>
                    }/>

                    <DropdownMenuItem asChild>
                        <a href="https://github.com/aspherr/Morph" target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
                        value={theme ?? "system"}
                        onValueChange={(v) => setTheme(v)}>

                        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}

export default Navbar
