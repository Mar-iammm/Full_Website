import React, { useEffect, useState } from 'react'
import { initPageInteractions } from '../utils/initInteractions'
import { normalizeHtml } from '../utils/normalizeHtml'
import Footer from './Footer'

export default function Contact() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('/raw/contact.html')
      .then((res) => res.text())
      .then((text) => setHtml(normalizeHtml(text)))
  }, [])

  useEffect(() => {
    if (!html) return
    const timer = setTimeout(() => {
      initPageInteractions(document)
    }, 0)
    return () => clearTimeout(timer)
  }, [html])

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Footer />
    </>
  )
}
