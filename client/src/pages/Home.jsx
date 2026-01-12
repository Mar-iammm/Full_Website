import React, { useEffect, useState, useRef } from 'react'
import { initPageInteractions } from '../utils/initInteractions'
import { normalizeHtml } from '../utils/normalizeHtml'
import Footer from './Footer'

export default function Home() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('/raw/home.html')
      .then((res) => res.text())
      .then((text) => setHtml(normalizeHtml(text)))
  }, [])

  const containerRef = useRef(null)

  useEffect(() => {
    if (!html) return
    const timer = setTimeout(() => {
      const root = containerRef.current || document
      initPageInteractions(root)
    }, 0)
    return () => clearTimeout(timer)
  }, [html])

  return (
    <>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
      <Footer />
    </>
  )
}
