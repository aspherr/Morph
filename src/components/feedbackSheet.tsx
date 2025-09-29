import { useState } from "react";

import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


const FeedbackSheet = ({trigger}: { trigger: React.ReactNode }) => {
    const [message, setMessage] = useState("");
    return (
        <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>

        <SheetContent className="w-[350px]">
            <SheetHeader>
            <SheetTitle>Want to leave some feedback?</SheetTitle>
            <SheetDescription>
                Share your thoughts, ideas, or issues — I’d love to hear from you!
            </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <form className="flex flex-col gap-3" >
                    <Textarea
                        placeholder="Ideas to improve the page..."
                        value={message}
                        onChange={(e) => {setMessage(e.target.value)}}
                        className="min-h-[400px] w-full resize-none"
                    />
                </form>
            </div>
            <SheetFooter className="space-y-2">
            <Button type="submit">Send</Button>
            <SheetClose asChild>
                <Button variant="outline">Close</Button>
            </SheetClose>
            </SheetFooter>
        </SheetContent>
        </Sheet>
    )
}

export default FeedbackSheet
