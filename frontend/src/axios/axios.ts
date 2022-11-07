import axios from 'axios'

const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:3001/api',
  withCredentials: true,
})

api.interceptors.request.use((config: any) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`

  return config
})

api.interceptors.response.use(
  (config: any) => {
    return config
  },
  async (error: any) => {
    const originalRequest = error.config

    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true

      try {
        const response = await axios.get(
          `${
            process.env.BACKEND_URL || 'http://localhost:3001/api'
          }auth/refresh`,
          { withCredentials: true },
        )

        localStorage.setItem('token', response.data.tokens.access_token)

        return api.request(originalRequest)
      } catch (e) {
        console.log('Unauthorized')
      }
    }
    throw error
  },
)

export const apiCreden = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:3001/api',
  withCredentials: true,
})
export default api
