type StatusProps = {
  isReady: boolean;
};

const Status = ({isReady}: StatusProps) => {
  return (
    <>
    {isReady ? (
        <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-600 text-emerald-200 rounded ml-2 antialiased">
            <span className="font-semibold">DONE</span>
        </span>
    ) : (
        <span className="flex items-center gap-1 px-2 py-1 text-[10px] bg-rose-600 text-rose-200 rounded ml-2 antialiased">
            <span className="font-semibold">FAILED</span>
        </span>
    )}
    </>
  )
}

export default Status
