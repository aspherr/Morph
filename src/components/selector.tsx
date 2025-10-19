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
    converted?: string | null
}

const Selector = ({ value, extension, onChange, converted }: SelectorProps) => {
    const formats = [
        // Images
        { value: "jpg", label: "JPG" },
        { value: "png", label: "PNG" },
        { value: "webp", label: "WebP" },

        // Documents
        { value: "pdf", label: "PDF" },
        { value: "docx", label: "DOCX (Word)" },
        { value: "txt", label: "TXT (Plain Text)" },
        { value: "md", label: "Markdown (MD)" },
        { value: "html", label: "HTML" },

        // Data
        { value: "csv", label: "CSV" },

        // Audio
        { value: "mp3", label: "MP3" },
        { value: "wav", label: "WAV" },
        { value: "ogg", label: "OGG" },

        // Video
        { value: "mp4", label: "MP4" },
        { value: "webm", label: "WebM" }
    ];

    const getAvailableFormats = (ext: string) => {
        const categories = {
            image: ["jpg", "png", "webp"],
            document: ["pdf", "docx", "txt", "md", "html", "csv"],
            audio: ["mp3", "wav", "ogg"],
            video: ["mp4", "webm"],
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
    const isConverted = converted != null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button disabled={isConverted}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-[200px] justify-between"
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
