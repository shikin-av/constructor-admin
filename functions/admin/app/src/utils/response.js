import { LOADING } from '../constants'

export const handleResponse = async (res) => {
  const { status } = res
  if (status) {
    if (status >= 200 && status <= 299) {
      try {
        const payload = await res.json()
        return {
          status: LOADING.SUCCESS,
          payload,
        }
      } catch (err) {
        return {
          status: LOADING.ERROR,
          error: err.message || err,
        }
      }    
    } else if (status === 401 || status === 403) {
      return {
        status: LOADING.UNAUTHORIZED,
      }
    } else {
      return {
        status: LOADING.ERROR,
        error: res.message || res.statusText || JSON.stringify(res),
      }
    }
  } else {
    return {
      status: LOADING.ERROR,
      error: res.message || JSON.stringify(res),
    }
  }
}

export const getPageNumber = (startAt, limit) => startAt === 0 ? 1 : (startAt / limit) + 1

export const getStartAt = (page, limit) => page === 1 ? 0 : limit * (page - 1)
