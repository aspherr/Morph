import { CircleCheck, CircleAlert } from "lucide-react"

type StatusProps = {
  isReady: boolean;
};

const Status = ({isReady}: StatusProps) => {
  return (
    <>
    {isReady ? (
        <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-600 text-emerald-200 rounded-md ml-2 antialiased">
            <CircleCheck strokeWidth={1.75} width={14} height={14} />
            <span className="font-semibold">Done</span>
        </span>
    ) : (
        <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-rose-600 text-rose-200 rounded-md ml-2 antialiased">
            <CircleAlert strokeWidth={1.75} width={14} height={14} />
            <span className="font-semibold">Failed</span>
        </span>
    )}
    </>
  )
}

export default Status
