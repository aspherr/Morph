"use client"

import { MessageCircleMore, MessageSquareShare } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Feedback = () => {

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">
                <MessageCircleMore className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
                <span className="">Feedback</span>
            </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="p-4 w-80">
            <div className="flex flex-col gap-3">
                <Textarea
                placeholder="Ideas to improve the page..."
                className="min-h-[120px] w-full resize-none"
                />

                <div className="flex justify-end">
                    <Button size="sm">
                        <span>Send</span>
                        <MessageSquareShare className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
                    </Button>
                </div>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Feedback