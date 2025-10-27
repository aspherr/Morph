"use client"

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SelectorProps = {
    value: string
    extension: string
    onChange: (val: string) => void
    isBusy?: boolean
}

const Selector = ({ value, extension, onChange, isBusy }: SelectorProps) => {
    const formats = [
        // Images
        { value: "jpg", label: "JPG" },
        { value: "png", label: "PNG" },
        { value: "webp", label: "WebP" },

        // Audio
        { value: "wav", label: "WAV (PCM / Raw)" },
        { value: "ogg", label: "OGG (Vorbis / Comp.)" },
        { value: "aac", label: "AAC (Comp.)" },
        { value: "aiff", label: "AIFF (PCM / Raw)" },
        { value: "flac", label: "FLAC (Lossless)" },

        // Audio + Video
        { value: "mp3", label: "MP3 (MPEG / Comp.)" },

        // Video
        { value: "mp4", label: "MP4 (H.264 / AAC)" },
        { value: "webm", label: "WebM (VP9 / Opus)" },
        { value: "mkv", label: "MKV (H.264 / AAC)" },
        { value: "mov", label: "MOV (ProRes / H.264)" }

    ];

    const getAvailableFormats = (ext: string) => {
        const categories = {
            image: ["jpg", "jpeg", "png", "webp"],
            audio: ["mp3", "wav", "ogg", "aac", "aiff", "flac"],
            video: ["mp4", "mp3", "webm", "mkv", "mov"],
        };

        const lower = ext.toLowerCase()

        for (const exts of Object.values(categories)) {
            if (exts.includes(lower)) {
            return formats.filter(f => exts.includes(f.value));
            }
        }

        return []
    }

    const [open, setOpen] = useState(false);
    const availableFormats = getAvailableFormats(extension);

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button disabled={isBusy}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-[250px] justify-between"
            >
            {value
                ? formats.find((formats) => formats.value === value)?.label
                : "Convert to..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandInput placeholder="Convert to..." />
            <CommandList>
                <CommandEmpty>No format found.</CommandEmpty>
                <CommandGroup>
                {availableFormats.map((fmt) => (
                    <CommandItem
                    key={fmt.value}
                    value={fmt.value}
                    onSelect={(currentValue) => {
                        onChange(currentValue);
                        setOpen(false);
                    }}
                    >
                    <CheckIcon
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === fmt.value ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {fmt.label}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
  )
}

export default Selector
