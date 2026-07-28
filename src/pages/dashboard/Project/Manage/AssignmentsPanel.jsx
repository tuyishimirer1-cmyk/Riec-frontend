import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import {
  useGetProjectAssignments,
  useCreateProjectAssignment,
  useUpdateProjectAssignment,
  useDeleteProjectAssignment,
} from '../../../../react-query'
import { inputCls, selectCls } from '../constants'
import FField from '../FField'

const ROLES = ['MANAGER', 'ENGINEER', 'QUANTITY_SURVEYOR', 'SUPERVISOR', 'VIEWER']

const ROLE_STYLE = {
  MANAGER:           { background: 'rgba(30,154,224,0.12)',  color: 'var(--color-my-blue)' },
  ENGINEER:          { background: 'rgba(19,194,150,0.12)',  color: 'var(--color-secondary)' },
  QUANTITY_SURVEYOR: { background: 'rgba(238,122,24,0.12)',  color: 'var(--color-riec-orange)' },
  SUPERVISOR:        { background: 'rgba(133,80,11,0.12)',   color: '#85500B' },
  VIEWER:            { background: 'var(--color-gray-2)',    color: 'var(--color-body-color)' },
}

const assignSchema = Yup.object({
  userId: Yup.string().required('User ID is required'),
  role:   Yup.string().required('Role is required'),
})

export default function AssignmentsPanel({ projectId }) {
  const { t } = useTranslation()
  const { data: assignments = [], isLoading } = useGetProjectAssignments(projectId)

  const createAssignmentMutation = useCreateProjectAssignment()
  const updateAssignmentMutation = useUpdateProjectAssignment()
  const deleteAssignmentMutation = useDeleteProjectAssignment()

  const [editingId,   setEditingId]   = useState(null)
  const [roleDraft,   setRoleDraft]   = useState('')
  const [updateError, setUpdateError] = useState(null)

  /* ── Edit role ── */
  const startEdit = (a) => { setEditingId(a.id); setRoleDraft(a.role); setUpdateError(null) }
  const saveRole  = async (assignmentId) => {
    setUpdateError(null)
    try {
      await updateAssignmentMutation.mutateAsync({ projectId, assignmentId, role: roleDraft })
      setEditingId(null)
    } catch (err) {
      setUpdateError(err?.data?.message || t('dash.manage.error_generic', { defaultValue: 'Something went wrong' }))
    }
  }

  /* ── Remove ── */
  const handleDelete = async (assignmentId) => {
    if (!window.confirm(t('dash.manage.confirm_remove_assignment', { defaultValue: 'Remove this assignment?' }))) return
    await deleteAssignmentMutation.mutateAsync({ projectId, assignmentId })
  }

  /* ── Create ── */
  const handleCreate = async (values, { resetForm }) => {
    try {
      await createAssignmentMutation.mutateAsync({ projectId, ...values })
      resetForm()
    } catch {
      /* error shown via createError */
    }
  }

  const creating = createAssignmentMutation.isPending
  const createError = createAssignmentMutation.error
  const updating = updateAssignmentMutation.isPending
  const deleting = deleteAssignmentMutation.isPending

  return (
    <div className="space-y-4">

      {isLoading && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-body-color)' }}>
          {t('dash.loading', { defaultValue: 'Loading…' })}
        </p>
      )}

      {/* Assignment list */}
      <div className="space-y-2">
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
            style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>

            {/* Avatar */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'rgba(238,122,24,0.12)', color: 'var(--color-riec-orange)' }}>
              {(a.user?.name || a.userId || '?')[0].toUpperCase()}
            </div>

            {/* Name + email */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-primary)' }}>
                {a.user?.name || a.userId}
              </p>
              {a.user?.email && (
                <p className="text-[10px] truncate" style={{ color: 'var(--color-body-color)' }}>
                  {a.user.email}
                </p>
              )}
            </div>

            {/* Role — badge or inline select */}
            {editingId === a.id ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <select value={roleDraft} onChange={(e) => setRoleDraft(e.target.value)}
                  className="rounded-xl border px-2 py-1.5 text-xs focus:outline-none"
                  style={{ borderColor: 'var(--color-stroke)', color: 'var(--color-primary)', background: '#fff' }}>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
                <button onClick={() => saveRole(a.id)} disabled={updating}
                  className="rounded-lg p-1.5 transition-colors disabled:opacity-40"
                  style={{ background: 'rgba(19,194,150,0.12)', color: 'var(--color-secondary)' }}>
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setEditingId(null)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: 'var(--color-body-color)' }}>
                  <X className="h-3.5 w-3.5" />
                </button>
                {updateError && (
                  <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>{updateError}</p>
                )}
              </div>
            ) : (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold flex-shrink-0"
                style={ROLE_STYLE[a.role] || ROLE_STYLE.VIEWER}>
                {a.role?.replace('_', ' ')}
              </span>
            )}

            {/* Actions */}
            {editingId !== a.id && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => startEdit(a)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: 'var(--color-dark-6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(30,154,224,0.10)'; e.currentTarget.style.color = 'var(--color-my-blue)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(a.id)} disabled={deleting}
                  className="rounded-lg p-1.5 transition-colors disabled:opacity-40"
                  style={{ color: 'var(--color-dark-6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(225,27,37,0.10)'; e.currentTarget.style.color = 'var(--color-riec-red)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-dark-6)' }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {!isLoading && assignments.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: 'var(--color-body-color)' }}>
            {t('dash.manage.no_assignments', { defaultValue: 'No assignments yet.' })}
          </p>
        )}
      </div>

      {/* Assign user form — always visible */}
      <div className="rounded-2xl border p-4"
        style={{ borderColor: 'var(--color-stroke)', boxShadow: 'var(--shadow-1)' }}>
        <p className="text-xs font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          {t('dash.manage.assign_user', { defaultValue: 'Assign User' })}
        </p>
        <Formik
          initialValues={{ userId: '', role: '' }}
          validationSchema={assignSchema}
          onSubmit={handleCreate}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FField name="userId" label={t('dash.manage.user_id_label', { defaultValue: 'User ID' })} required>
                  <Field name="userId" placeholder="user-id or email" className={inputCls} />
                </FField>
                <FField name="role" label={t('dash.manage.role_label', { defaultValue: 'Role' })} required>
                  <Field as="select" name="role" className={selectCls}>
                    <option value="">{t('dash.manage.select_role', { defaultValue: 'Select role…' })}</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r.replace('_', ' ')}</option>
                    ))}
                  </Field>
                </FField>
              </div>

              {createError && (
                <p className="text-[10px]" style={{ color: 'var(--color-riec-red)' }}>
                  {createError?.data?.message || t('dash.manage.error_generic', { defaultValue: 'Something went wrong' })}
                </p>
              )}

              <button type="submit" disabled={isSubmitting || creating}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-60"
                style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 12px rgba(238,122,24,0.35)' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'var(--color-riec-orange-light)')}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
              >
                {isSubmitting || creating
                  ? t('dash.manage.saving', { defaultValue: 'Saving…' })
                  : t('dash.manage.assign_btn', { defaultValue: 'Assign' })}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
