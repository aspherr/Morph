"use client"

import { useState } from "react"
import { MessageCircleMore, MessageSquareShare } from "lucide-react"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ShinyText from './ShinyText';


const Feedback = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const sendFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(JSON.stringify({ message }));
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            const json = await res.json();
            if (!json) {
                toast.error("Failed to send feedback. Please try again.");
                setMessage("");
                setOpen(false);
                return;
            }

            toast.success("Thank you for the feedback!");
            setMessage("");
            setOpen(false);
            
        } catch (error) {
            toast.error("Failed to send feedback. Please try again.");
            console.log("Error: ", error);
        }  
    }
    
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <MessageCircleMore className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
                    <ShinyText 
                        text="Feedback" 
                        disabled={false} 
                        speed={3} 
                        className='hidden' />
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="p-4 w-80">
                <form className="flex flex-col gap-3" onSubmit={sendFeedback}>
                    <Textarea
                    placeholder="Ideas to improve the page..."
                    value={message}
                    onChange={(e) => {setMessage(e.target.value)}}
                    className="min-h-[120px] w-full resize-none"
                    />

                    <div className="flex justify-end">
                        <Button size="sm" type="submit">
                            <span>Send</span>
                            <MessageSquareShare className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
                        </Button>
                    </div>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
    }

export default Feedback