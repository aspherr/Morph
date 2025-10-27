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

import { sendFeedback } from "./feedback";


const FeedbackSheet = ({trigger}: { trigger: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        await sendFeedback(e, message, setMessage, setOpen);
        setIsSubmitting(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>

        <SheetContent className="w-[350px]">
            <SheetHeader>
            <SheetTitle>Want to leave some feedback?</SheetTitle>
            <SheetDescription>
                Share your thoughts, ideas, or issues — I’d love to hear from you!
            </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Ideas to improve the page..."
                        value={message}
                        onChange={(e) => {setMessage(e.target.value)}}
                        className="min-h-[400px] w-full resize-none"
                    />

                    <SheetFooter className="absolute bottom-0 left-0 right-0 space-y-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send"}
                        </Button>

                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </div>

        </SheetContent>
        </Sheet>
    )
}

export default FeedbackSheet
