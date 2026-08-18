import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import {
  useGetProjects, useCreateProject, useUpdateProject,
  useDeleteProject, usePublishProject, useUnpublishProject,
  useSearchProjects,
} from '../../react-query'
import ProjectWizard       from './Project/ProjectWizard'
import ProjectsTable       from './Project/ProjectsTable'
import ProjectManageDrawer from './Project/Manage/ProjectManageDrawer'
import DashboardSearchBar  from './components/DashboardSearchBar'

export default function ProjectsDashboardPage() {
  const { t } = useTranslation()

  const [page,     setPage]     = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search,   setSearch]   = useState('')
  const [filters,  setFilters]  = useState({})
  const [wizard,   setWizard]   = useState(null)
  const [managing, setManaging] = useState(null)

  const isSearching = search.trim().length >= 2

  const { data: projectsData, isLoading } = useGetProjects({ page, pageSize, published: 'all', ...filters })
  const { data: searchData } = useSearchProjects(search, filters)
  const createProjectMutation = useCreateProject()
  const updateProjectMutation = useUpdateProject()
  const deleteProjectMutation = useDeleteProject()
  const publishProjectMutation = usePublishProject()
  const unpublishProjectMutation = useUnpublishProject()

  const projects  = isSearching ? (searchData?.items || []) : (projectsData?.items || [])
  const meta      = projectsData || {}
  const status    = isLoading ? 'loading' : 'idle'

  const totalPages = meta?.total && meta?.pageSize
    ? Math.ceil(meta.total / meta.pageSize)
    : null

  const handleDelete = async (id) => {
    if (!window.confirm(t('dash.projects_page.delete_confirm', { defaultValue: 'Delete this project? This cannot be undone.' }))) return
    
    try {
      await deleteProjectMutation.mutateAsync(id)
      alert('Project deleted successfully!')
    } catch (error) {
      console.error('Delete error:', error)
      const message = error?.response?.data?.message || error?.message || 'Failed to delete project'
      alert(`Error: ${Array.isArray(message) ? message.join(', ') : message}`)
    }
  }

  const handlePublish = async (id) => publishProjectMutation.mutateAsync(id)
  const handleUnpublish = async (id) => unpublishProjectMutation.mutateAsync(id)

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
            {t('dash.projects_page.title', { defaultValue: 'Projects' })}
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-body-color)' }}>
            {meta.total ?? projects.length} {t('dash.projects_page.total', { defaultValue: 'total projects' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardSearchBar
            value={search}
            onChange={(q) => { setPage(1); setSearch(q) }}
            placeholder={t('dash.projects_page.search', { defaultValue: 'Search projects…' })}
          />
          <button onClick={() => setWizard('new')}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors"
            style={{ background: 'var(--color-riec-orange)', boxShadow: '0 4px 12px rgba(238,122,24,0.35)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-riec-orange-light)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-riec-orange)'}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('dash.projects_page.new_btn', { defaultValue: 'New Project' })}
          </button>
        </div>
      </div>

      <ProjectsTable
        projects={projects}
        status={status}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageSizeChange={setPageSize}
        onEdit={(p) => setWizard(p)}
        onManage={(p) => setManaging(p)}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onPagePrev={() => setPage((p) => Math.max(1, p - 1))}
        onPageNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {wizard && (
        <ProjectWizard
          editing={wizard === 'new' ? null : wizard}
          onClose={() => setWizard(null)}
          onCreate={(payload) => createProjectMutation.mutateAsync(payload)}
          onUpdate={(payload) => updateProjectMutation.mutateAsync(payload)}
        />
      )}

      {managing && (
        <ProjectManageDrawer
          project={managing}
          onClose={() => setManaging(null)}
        />
      )}
    </div>
  )
}