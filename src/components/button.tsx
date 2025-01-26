import React from "react"

export default function Button({
  type,
  fullWidth = false,
  disabled = false,
  link = "",
  target = "_self",
  onClick = () => {},
  children
}: {
  type: "primary" | "secondary"
  fullWidth?: boolean
  disabled?: boolean
  link?: string
  target?: "_blank" | "_self"
  onClick?: () => void
  children: React.ReactNode
}) {
  let bgColor = ""
  let textColor = ""
  let rounded = ""

  switch (type) {
    default:
    case "primary":
      bgColor = "bg-l1-color font-highlight text-lg"
      textColor = "text-white"
      rounded = "rounded-md px-4 py-1 pt-2"
      break
    case "secondary":
      bgColor = "bg-l2-color disabled:bg-deepgray"
      textColor = "text-deepgray disabled:text-white"
      rounded = "rounded-2xl px-8 py-1"
      break
  }

  let width = fullWidth ? "w-full" : "w-fit"

  if (link)
    return (
      <a
        href={link}
        target={target}
        className={`${bgColor} ${textColor} ${width} ${rounded} h-fit`}
      >
        {children}
      </a>
    )
  return (
    <button
      className={`${bgColor} ${textColor} ${width} ${rounded} h-fit`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
