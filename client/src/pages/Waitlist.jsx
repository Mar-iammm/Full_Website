import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Waitlist() {
  const [params] = useSearchParams()
  const refFromUrl = useMemo(() => {
    const r = params.get('ref')
    return r ? r.toUpperCase() : ''
  }, [params])

  const [email, setEmail] = useState('')
  const [referral, setReferral] = useState(refFromUrl)
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return

    // Frontend-only: store locally. Backend team can replace this later.
    setStatus('loading')
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('sv_waitlist') || '[]')
        existing.push({ email: email.trim(), referral: referral.trim(), ts: Date.now() })
        localStorage.setItem('sv_waitlist', JSON.stringify(existing))
      } catch (err) {
        // ignore storage errors
      }
      setStatus('done')
    }, 600)
  }

  return (
    <div className="sv-waitlist">
      <div className="sv-waitlist-bg" aria-hidden="true" />

      <main className="sv-waitlist-card">
        <div className="sv-waitlist-badge">LAUNCHING SOON</div>
        <h1 className="sv-waitlist-title">Join the StudentVerse Waitlist</h1>
        <p className="sv-waitlist-sub">
          Get early access + launch perks. (Backend hookup can come later — this is the UI.)
        </p>

        {status === 'done' ? (
          <div className="sv-waitlist-success">
            <div className="sv-waitlist-check">✓</div>
            <div>
              <div className="sv-waitlist-success-title">You’re in.</div>
              <div className="sv-waitlist-success-sub">We’ll email you when it’s ready.</div>
            </div>
          </div>
        ) : (
          <form className="sv-waitlist-form" onSubmit={handleSubmit}>
            <label className="sv-waitlist-label">
              Email
              <input
                className="sv-waitlist-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="sv-waitlist-label">
              Referral code (optional)
              <input
                className="sv-waitlist-input"
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                placeholder="ABC123"
              />
              {refFromUrl ? (
                <div className="sv-waitlist-hint">Detected from link: <span>{refFromUrl}</span></div>
              ) : null}
            </label>

            <button className="sv-waitlist-btn" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting…' : 'Join waitlist'}
            </button>

            <p className="sv-waitlist-privacy">No spam. Unsubscribe anytime.</p>
          </form>
        )}
      </main>
    </div>
  )
}
