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
}

const Selector = ({ value, extension, onChange }: SelectorProps) => {
    const formats = [
    // Images
    { value: "jpg", label: "JPG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "avif", label: "AVIF" },
    { value: "heic", label: "HEIC" },
    { value: "gif", label: "GIF" },
    { value: "svg", label: "SVG" },

    // Documents
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "DOCX (Word)" },
    { value: "pptx", label: "PPTX (PowerPoint)" },
    { value: "xlsx", label: "XLSX (Excel)" },
    { value: "odt", label: "ODT (OpenDocument Text)" },
    { value: "txt", label: "TXT (Plain Text)" },
    { value: "md", label: "Markdown (MD)" },
    { value: "html", label: "HTML" },

    // Data
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },

    // Audio
    { value: "mp3", label: "MP3" },
    { value: "wav", label: "WAV" },
    { value: "aac", label: "AAC / M4A" },
    { value: "flac", label: "FLAC" },
    { value: "ogg", label: "OGG" },
    { value: "opus", label: "OPUS" },

    // Video
    { value: "mp4", label: "MP4 (H.264)" },
    { value: "webm", label: "WebM" },
    { value: "mov", label: "MOV" },
    { value: "avi", label: "AVI" },
    { value: "mkv", label: "MKV" },

    // Archives
    { value: "zip", label: "ZIP" },
    { value: "tar", label: "TAR" },
    { value: "gz", label: "GZ" },
    { value: "7z", label: "7z" },
    { value: "rar", label: "RAR" },
    ];

    const getAvailableFormats = (ext: string) => {
        const categories = {
            image: ["jpg", "jpeg", "png", "webp", "avif", "heic", "gif", "svg"],
            document: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "txt", "md", "html", "csv", "json", "xml"],
            audio: ["mp3", "wav", "aac", "flac", "ogg", "opus", "m4a"],
            video: ["mp4", "webm", "mov", "avi", "mkv"],
            archive: ["zip", "tar", "gz", "7z", "rar"],
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
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
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
