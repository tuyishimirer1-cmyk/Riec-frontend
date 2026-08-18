import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetContactSubmissions, useMarkSubmissionRead, useReplyToSubmission } from '../../react-query'
import { Mail, Send, X, Check, Clock } from 'lucide-react'

export default function ContactDashboardPage() {
  const { t } = useTranslation()
  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const { data, isLoading } = useGetContactSubmissions({ page, pageSize })
  const markReadMutation = useMarkSubmissionRead()
  const replyMutation = useReplyToSubmission()

  const submissions = data?.items || []
  const total = data?.total ?? 0
  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : null

  const handleMarkRead = async (id) => {
    await markReadMutation.mutateAsync(id)
  }

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setReplyText(submission.reply || '')
    if (!submission.read) {
      handleMarkRead(submission.id)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSubmission) return
    
    setIsReplying(true)
    try {
      const result = await replyMutation.mutateAsync({
        id: selectedSubmission.id,
        reply: replyText,
        adminEmail: 'admin@riec.rw'
      })
      
      // Check if email was sent successfully
      if (result.emailSent === false) {
        alert('⚠️ Reply saved but email failed to send.\n\nReason: Resend is in test mode. Please verify your domain at resend.com/domains to send emails to users.\n\nFor testing, use: riec2025@gmail.com')
      } else {
        alert('✅ Reply sent successfully! User will receive an email.')
      }
      
      setSelectedSubmission(null)
      setReplyText('')
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('❌ Failed to send reply. Please try again.')
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.contact_page.title', { defaultValue: 'Contact Submissions' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {total} {t('dash.contact_page.total', { defaultValue: 'total submissions' })}
          </p>
        </div>
      </div>

      {/* Submissions list */}
      {isLoading ? (
        <p className="text-xs text-center py-8" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} 
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:shadow-md transition-shadow" 
              style={{ background: s.read ? 'var(--color-gray-1)' : 'rgba(238,122,24,0.08)' }}
              onClick={() => handleViewSubmission(s)}
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                {s.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{s.name}</p>
                  {s.reply && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" 
                      style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}>
                      <Check className="h-3 w-3" /> Replied
                    </span>
                  )}
                </div>
                <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>
                  {s.email} {s.subject && `• ${s.subject}`}
                </p>
                <p className="mt-0.5 text-[10px] line-clamp-1" style={{ color: 'var(--color-dark-5)' }}>{s.message}</p>
              </div>
              {!s.read && (
                <div className="flex-shrink-0 h-2 w-2 rounded-full" style={{ background: 'var(--color-riec-orange)' }} />
              )}
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-xs text-center py-8" style={{ color: 'var(--color-body-color)' }}>
              {t('dash.no_messages', { defaultValue: 'No messages yet.' })}
            </p>
          )}
        </div>
      )}

      {/* Reply Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-stroke)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
                  {selectedSubmission.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{selectedSubmission.name}</h3>
                  <p className="text-[10px]" style={{ color: 'var(--color-body-color)' }}>{selectedSubmission.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="rounded-lg p-2 hover:bg-[var(--color-gray-1)]">
                <X className="h-4 w-4" style={{ color: 'var(--color-body-color)' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Original Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" style={{ color: 'var(--color-riec-orange)' }} />
                  <h4 className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {selectedSubmission.subject || 'Message'}
                  </h4>
                  <span className="ml-auto text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                    {new Date(selectedSubmission.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-gray-1)' }}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-primary)' }}>
                    {selectedSubmission.message}
                  </p>
                  {selectedSubmission.phone && (
                    <p className="text-[10px] mt-3 pt-3 border-t" style={{ color: 'var(--color-body-color)', borderColor: 'var(--color-stroke)' }}>
                      <strong>Phone:</strong> {selectedSubmission.phone}
                    </p>
                  )}
                  {selectedSubmission.company && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--color-body-color)' }}>
                      <strong>Company:</strong> {selectedSubmission.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Previous Reply (if exists) */}
              {selectedSubmission.reply && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4" style={{ color: 'var(--color-secondary)' }} />
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Previous Reply</h4>
                    {selectedSubmission.repliedAt && (
                      <span className="ml-auto text-[10px]" style={{ color: 'var(--color-body-color)' }}>
                        {new Date(selectedSubmission.repliedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <div className="p-4 rounded-xl border" style={{ background: 'rgba(19,194,150,0.05)', borderColor: 'var(--color-secondary)' }}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-primary)' }}>
                      {selectedSubmission.reply}
                    </p>
                  </div>
                </div>
              )}

              {/* Reply Input */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  {selectedSubmission.reply ? 'Update Reply' : 'Send Reply'}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full px-4 py-3 text-xs rounded-xl border focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--color-stroke)', 
                    background: '#fff',
                    color: 'var(--color-primary)'
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-5 border-t" style={{ borderColor: 'var(--color-stroke)' }}>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border transition-colors"
                style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-body-color)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim() || isReplying}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl text-white transition-colors disabled:opacity-50"
                style={{ background: 'var(--color-riec-orange)' }}
                onMouseEnter={(e) => { if (!isReplying && replyText.trim()) e.currentTarget.style.background = 'var(--color-secondary)' }}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
              >
                <Send className="h-3.5 w-3.5" />
                {isReplying ? 'Sending...' : (selectedSubmission.reply ? 'Update Reply' : 'Send Reply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
