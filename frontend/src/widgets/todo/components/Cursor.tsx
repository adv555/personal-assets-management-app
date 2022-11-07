import React from 'react'

interface CursorProps {
  listCount: number
  cursor: number
}

export function Cursor(props: CursorProps) {
  const width = props.listCount > 0 ? 100 / props.listCount : 0
  const pos = width * props.cursor

  return (
    <div className="border-t relative mb-2">
      <div
        className="absolute h-0.5 bg-slate-300"
        style={{ width: width + '%', left: pos + '%', top: 1 }}
      ></div>
    </div>
  )
}
