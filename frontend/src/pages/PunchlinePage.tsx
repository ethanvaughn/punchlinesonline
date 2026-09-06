import { useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const PUNCHLINE_QUERY = gql`
  query Punchline($id: String!) {
    punchline(id: $id) {
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

type PunchlineData = { punchline: Punchline | null }

export function PunchlinePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dialogRef = useRef<HTMLElement>(null)
  const passedPunchline = (location.state as { punchline?: Punchline } | null)?.punchline
  const punchlineId = searchParams.get('id')
  const restoreFocusId = punchlineId ? `view-punchline-${punchlineId}` : undefined
  const { data, loading, error } = useQuery<PunchlineData>(
    PUNCHLINE_QUERY,
    {
      variables: { id: punchlineId },
      skip: Boolean(passedPunchline) || !punchlineId,
    },
  )

  const punchline = passedPunchline || data?.punchline
  const closeDialog = useCallback(() => {
    navigate('/', { state: restoreFocusId ? { restoreFocusId } : undefined })
  }, [navigate, restoreFocusId])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [loading, punchline, error])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeDialog()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeDialog])

  const dialog = (content: ReactNode) => (
    <div className="punchline-dialog-overlay">
      <section
        ref={dialogRef}
        className="punchline-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="punchline-dialog-title"
        tabIndex={-1}
      >
        {content}
      </section>
    </div>
  )

  if (loading) {
    return dialog(
      <>
        <h1 id="punchline-dialog-title" className="punchline-dialog-title">Punchline</h1>
        <p className="punchline-dialog-status">Loading punchline...</p>
      </>,
    )
  }

  if (error || !punchline) {
    return dialog(
      <>
        <h1 id="punchline-dialog-title" className="punchline-dialog-title">Punchline not found</h1>
        <button className="primary-button" type="button" onClick={closeDialog}>Back to punchlines</button>
      </>,
    )
  }

  return dialog(
    <>
      <div className="punchline-dialog-header">
        <div>
          {/* <h1 className="auth-kicker"></h1> */}
          <h1 id="punchline-dialog-title" className="punchline-dialog-title">The line</h1>
        </div>
        <Link className="punchline-dialog-close" to="/" state={restoreFocusId ? { restoreFocusId } : undefined} aria-label="Close punchline dialog" title="Close">
          <span aria-hidden="true">×</span>
        </Link>
      </div>
      <p className="punchline-dialog-line">{punchline.line}</p>
      <p className="punchline-dialog-owner">Posted by {punchline.owner_name}</p>
      <button className="primary-button" type="button" onClick={closeDialog}>Back to punchlines</button>
    </>,
  )
}
