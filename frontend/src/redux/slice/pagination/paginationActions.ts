import { AppDispatch } from 'redux/store'
import { errorOccurred, resetError } from '../error/error.slice'
import { startLoading, stopLoading } from '../loader/loader.slice'
import { setPagination, IPagination } from './pagination.slice'

export const fetchSetPagination = (pagination: IPagination) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(resetError())
      dispatch(startLoading())
      dispatch(setPagination(pagination))
    } catch (e: any) {
      const message = e.message

      dispatch(errorOccurred({ statusCode: 400, message: message }))
    } finally {
      dispatch(stopLoading())
    }
  }
}
