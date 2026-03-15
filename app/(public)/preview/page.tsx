// preview page for newly created UI components
import Skeleton from "@/components/Skeleton"
import Avatar from "@/components/Avatar"

const avatarExamples = [
  { name: "mohit" },
  { name: "John" },
  { name: "PocketHeist" },
  { name: "ClaudeCode" },
  { name: "Alice" },
  { name: "TailwindCSS" },
]

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2 className="mb-6">Preview</h2>

      <h3 className="mb-4">Avatar</h3>
      <div className="flex flex-wrap gap-4 mb-10">
        {avatarExamples.map(({ name }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <Avatar name={name} />
            <span className="text-xs text-body">{name}</span>
          </div>
        ))}
      </div>

      <h3 className="mb-4">Skeleton</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    </div>
  )
}
