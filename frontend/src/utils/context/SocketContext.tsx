/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { io } from 'socket.io-client'

export const socket = io(process.env.REACT_APP_BACKEND_HOST!, {
  path: process.env.REACT_APP_BACKEND_WS_PATH,
})
export const SocketContext = React.createContext(socket)
