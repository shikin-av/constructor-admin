export const MENU_ITEMS = {
  HOME: 'home',
  LOGIN: 'login',
  STEPS: 'steps',
  MANAGERS: 'managers',
}

export const LOADING = {
  NONE: null,
  START: 'start',
  PROGRESS: 'progress',
  SUCCESS: 'success',
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized'
}

export const HEADERS = {
  'Content-Type': 'application/json;charset=utf-8',
}

export const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL 
  : process.env.REACT_APP_API_URL_LOCAL
