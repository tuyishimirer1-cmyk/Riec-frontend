export default function RichContent({ html, className = '' }) {
  if (!html || html === '<p></p>') return null
  return (
    <div
      className={'rich-content ' + className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
