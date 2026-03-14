export default function Skeleton() {
  return (
    <div className="bg-light rounded-lg p-6 animate-pulse">
      {/* Avatar + title row */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-lighter shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-3 bg-lighter rounded-full w-4/5" />
          <div className="h-3 bg-lighter rounded-full w-3/5" />
        </div>
      </div>

      {/* Body lines */}
      <div className="flex flex-col gap-4">
        <div className="h-3 bg-lighter rounded-full w-full" />
        <div className="h-3 bg-lighter rounded-full w-full" />
        <div className="h-3 bg-lighter rounded-full w-2/5" />
      </div>
    </div>
  )
}
