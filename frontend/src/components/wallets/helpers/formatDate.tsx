export const formatDate = (date: Date | string): string => {
  const setDate = new Date(date)

  return `${setDate.getDate()}.${
    +setDate.getMonth() + 1
  }.${setDate.getFullYear()}`
}

export const formatCurrentDate = (date: Date | string): string => {
  const setDate = new Date(date)

  return `${setDate.getFullYear()}-${
    +setDate.getMonth() + 1
  }-${setDate.getDate()}`
}
