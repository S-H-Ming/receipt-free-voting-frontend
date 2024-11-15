"use client"

import { useState, useEffect } from "react"

export default function UseWindowWidth() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    handleResize()
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}

export const isMobile = (width: number) => width < 768
