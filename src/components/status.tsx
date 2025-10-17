import { CircleCheck, CircleAlert } from "lucide-react"

type StatusProps = {
  isReady: boolean;
};

const Status = ({isReady}: StatusProps) => {
  return (
    <>
    {isReady ? (
        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 rounded-full ml-3 antialiased">
            <CircleCheck strokeWidth={1.75} width={14} height={14} />
            <span>Done</span>
        </span>
    ) : (
        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-rose-600 rounded-full ml-3 antialiased">
            <CircleAlert strokeWidth={1.75} width={14} height={14} />
            <span>Failed</span>
        </span>
    )}
    </>
  )
}

export default Status
