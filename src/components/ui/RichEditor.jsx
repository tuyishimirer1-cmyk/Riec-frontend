import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, List, ListOrdered, Quote, Minus,
} from 'lucide-react'

function ToolBtn({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
        background: active ? 'var(--color-riec-orange)' : 'transparent',
        color: active ? '#fff' : 'var(--color-body-color)',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-gray-2)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return (
    <span style={{
      display: 'inline-block', width: 1, height: 16, margin: '0 2px',
      background: 'var(--color-stroke)', flexShrink: 0,
    }} />
  )
}

export default function RichEditor({ value, onChange, placeholder, minHeight = 96 }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder || 'Write something…' }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  /* Sync external value reset (e.g. form reset) */
  useEffect(() => {
    if (!editor) return
    if ((value === '' || value == null) && editor.getHTML() !== '<p></p>') {
      editor.commands.setContent('')
    }
  }, [value, editor])

  if (!editor) return null

  const e = editor

  return (
    <div style={{
      border: '1px solid var(--color-stroke)',
      borderRadius: 12,
      background: 'var(--color-gray-1)',
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}
      onFocusCapture={(el) => { el.currentTarget.style.borderColor = 'var(--color-riec-orange)' }}
      onBlurCapture={(el) => { el.currentTarget.style.borderColor = 'var(--color-stroke)' }}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
        padding: '5px 8px',
        borderBottom: '1px solid var(--color-stroke)',
        background: 'var(--color-gray-1)',
      }}>
        <ToolBtn active={e.isActive('bold')} onClick={() => e.chain().focus().toggleBold().run()} title="Bold"><Bold size={13} /></ToolBtn>
        <ToolBtn active={e.isActive('italic')} onClick={() => e.chain().focus().toggleItalic().run()} title="Italic"><Italic size={13} /></ToolBtn>
        <ToolBtn active={e.isActive('underline')} onClick={() => e.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={13} /></ToolBtn>
        <ToolBtn active={e.isActive('strike')} onClick={() => e.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={13} /></ToolBtn>
        <Divider />
        <ToolBtn active={e.isActive('heading', { level: 1 })} onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1"><Heading1 size={13} /></ToolBtn>
        <ToolBtn active={e.isActive('heading', { level: 2 })} onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2"><Heading2 size={13} /></ToolBtn>
        <Divider />
        <ToolBtn active={e.isActive('bulletList')} onClick={() => e.chain().focus().toggleBulletList().run()} title="Bullet list"><List size={13} /></ToolBtn>
        <ToolBtn active={e.isActive('orderedList')} onClick={() => e.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered size={13} /></ToolBtn>
        <Divider />
        <ToolBtn active={e.isActive('blockquote')} onClick={() => e.chain().focus().toggleBlockquote().run()} title="Blockquote"><Quote size={13} /></ToolBtn>
        <ToolBtn active={false} onClick={() => e.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={13} /></ToolBtn>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{ minHeight, padding: '8px 12px', fontSize: 12, color: 'var(--color-primary)', cursor: 'text' }}
      />
    </div>
  )
}
