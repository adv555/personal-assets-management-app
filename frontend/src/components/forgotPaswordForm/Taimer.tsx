import React from 'react'

const Taimer = () => {
  const [time, setTime] = React.useState(60)

  const setTimer = () => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000)
    }

    return 0
  }

  React.useEffect(() => {
    setTimer()
  }, [time])

  return <div className="mr-4">{time}</div>
}

export default Taimer
