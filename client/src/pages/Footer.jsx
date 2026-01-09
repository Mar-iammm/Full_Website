import React from 'react'

// TeachMeCode partnership footer/banner.
// This uses the existing CSS block already present in styles/page.css.
export default function Footer() {
  return (
    <div className="teachmecode-partnership-banner">
      <div className="partnership-aurora" aria-hidden="true" />

      <div className="partnership-content">
        <div className="partnership-badge">
          <div className="badge-glow" aria-hidden="true" />
          <div className="badge-inner">
            <span className="partnership-label">Proudly Partnered By</span>
            <h3 className="partnership-brand">
              <span className="purple-symbol" aria-hidden="true">
                <img src="/assets/teachmecode.png" alt="TeachMeCode logo" />
              </span>
            </h3>
            <div className="partnership-tagline">
              Empowering Students Through Technology
            </div>
          </div>
        </div>
      </div>

      <div className="partnership-particles" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="particle" key={i} />
        ))}
      </div>
    </div>
  )
}
