import { useGetDownloads } from '../../../react-query'

export default function DownloadsPanel() {
  const { data: downloads, isLoading } = useGetDownloads()

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <div>
      <h3 className="text-sm font-bold mb-4">Your Downloads</h3>
      {downloads && downloads.length > 0 ? (
        <ul className="space-y-2">
          {downloads.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'var(--color-gray-1)' }}>
              <span className="text-sm">{d.fileName || d.name}</span>
              <a href={d.url} download className="text-xs text-riec-orange hover:underline">Download</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
          No downloads yet.
        </p>
      )}
    </div>
  )
}
