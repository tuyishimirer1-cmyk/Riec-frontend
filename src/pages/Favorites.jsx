import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Heart, MapPin, Trash2, ArrowLeft } from 'lucide-react'
import { hasAuthToken, useGetFavorites, useRemoveFavorite } from '../react-query'

export default function Favorites() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching } = useGetFavorites({ page, limit: 9 })
  const removeFavoriteMutation = useRemoveFavorite()

  const favorites = data?.items || []
  const totalPages = data?.totalPages || 1

  useEffect(() => {
    if (!hasAuthToken()) {
      navigate('/login')
    }
  }, [navigate])

  const cards = useMemo(() => {
    return favorites
      .map((fav) => ({
        id: fav?.project?.id || fav?.id,
        slug: fav?.project?.slug,
        title: fav?.project?.title || 'Untitled Project',
        location: fav?.project?.location || 'Location not specified',
        type: fav?.project?.type || 'PROJECT',
        imageUrl: fav?.project?.images?.[0]?.url || '/project1.png',
      }))
      .filter((item) => !!item.id)
  }, [favorites])

  const removeItem = async (identifier) => {
    await removeFavoriteMutation.mutateAsync(identifier)
  }

  return (
    <>
      <Helmet>
        <title>Favorites | R.I.E.C</title>
      </Helmet>

      <main className="min-h-screen bg-riec-dark pb-16 pt-28 text-slate-100">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-riec-orange">Your shortlist</p>
                <h1 className="mt-1 text-3xl font-black">Saved Projects</h1>
                <p className="mt-2 text-sm text-slate-400">Keep track of plans and projects you want to revisit.</p>
              </div>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Browse projects
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
              Loading favorites...
            </div>
          ) : cards.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
              <Heart className="mx-auto mb-3 h-8 w-8 text-slate-500" />
              <p className="text-sm text-slate-300">No favorites yet.</p>
              <p className="mt-1 text-xs text-slate-500">Tap the heart on any project details page to save it here.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-slate-400">
                {isFetching ? 'Refreshing...' : `${data?.total || cards.length} saved projects`}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_14px_50px_rgba(0,0,0,0.35)]"
                  >
                    <div className="h-44 w-full overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>

                    <div className="space-y-3 p-4">
                      <p className="line-clamp-2 text-lg font-bold text-white">{item.title}</p>
                      <p className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/projects/${item.slug || item.id}`}
                          className="inline-flex items-center rounded-full bg-riec-orange px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-riec-orange-light"
                        >
                          View project
                        </Link>

                        <button
                          type="button"
                          onClick={() => removeItem(item.slug || item.id)}
                          disabled={removeFavoriteMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1 || isFetching}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  )
}
