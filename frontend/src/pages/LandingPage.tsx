import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Link, useLocation } from 'react-router-dom'
import { Masthead } from '../components/Masthead'

const PUNCHLINES_QUERY = gql`
  query Punchlines {
    punchlines {
      id
      line
      created_by
      owner_name
      inserted_at
    }
  }
`

type Punchline = {
  id: string
  line: string | null
  created_by: string
  owner_name: string
  inserted_at: string
}

type PunchlinesData = { punchlines: Punchline[] }
type SortKey = 'line' | 'owner_name' | 'inserted_at'
type SortDirection = 'asc' | 'desc'

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatDate(timestamp: string) {
  return DATE_FORMATTER.format(new Date(timestamp))
}

export function LandingPage() {
  const location = useLocation()
  const { data, loading, error } = useQuery<PunchlinesData>(PUNCHLINES_QUERY)
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'inserted_at',
    direction: 'desc',
  })

  const sortedPunchlines = [...(data?.punchlines ?? [])].sort((left, right) => {
    const comparison = sort.key === 'inserted_at'
      ? left.inserted_at.localeCompare(right.inserted_at)
      : (left[sort.key] ?? '').localeCompare(right[sort.key] ?? '')

    return sort.direction === 'asc' ? comparison : -comparison
  })

  useEffect(() => {
    const restoreFocusId = (location.state as { restoreFocusId?: string } | null)?.restoreFocusId
    if (!restoreFocusId) return
    document.getElementById(restoreFocusId)?.focus()
  }, [location, data])

  const changeSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortButton = (key: SortKey, label: string) => (
    <button
      type="button"
      className="sort-button"
      aria-label={`Sort ${label} ${sort.key === key && sort.direction === 'asc' ? 'descending' : 'ascending'}`}
      onClick={() => changeSort(key)}
    >
      {label}
      <span aria-hidden="true">{sort.key === key && sort.direction === 'desc' ? '↓' : '↑'}</span>
    </button>
  )

  const ariaSort = (key: SortKey) => sort.key === key
    ? sort.direction === 'asc' ? 'ascending' : 'descending'
    : 'none'

  return (
    <div className="site-shell">
      <Masthead />
      <main>
        <section className="cityscape" aria-label="Seattle cityscape placeholder" />
        <section className="punchline-section">
          <div className="punchline-table" role="table" aria-label="Punchlines">
            <div className="punchline-row punchline-header" role="row">
              <div role="columnheader" aria-label="View punchline" />
              <div role="columnheader" aria-sort={ariaSort('line')}>{sortButton('line', 'The Line')}</div>
              <div role="columnheader" aria-sort={ariaSort('owner_name')}>{sortButton('owner_name', 'Posted by')}</div>
              <div role="columnheader" aria-sort={ariaSort('inserted_at')}>{sortButton('inserted_at', 'On date')}</div>
            </div>
            {loading && <p className="table-message">Loading punchlines...</p>}
            {error && <p className="table-message">We could not load the punchlines.</p>}
            {!loading && !error && sortedPunchlines.map((punchline) => (
              <div className="punchline-row" role="row" key={punchline.id}>
                <Link
                  id={`view-punchline-${punchline.id}`}
                  className="view-punchline"
                  to={`/punchline?id=${encodeURIComponent(punchline.id)}`}
                  state={{ punchline, backgroundLocation: location }}
                  aria-label="View punchline"
                  title="View punchline"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </Link>
                <p className="punchline" role="cell">{punchline.line}</p>
                <p className="owner" role="cell">{punchline.owner_name}</p>
                <p className="date-added" role="cell">{formatDate(punchline.inserted_at)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
