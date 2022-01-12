export const LIMITS = {
  MODELS: 4,
  STEPS: 4,
}

export const MENU_ITEMS = {
  HOME: 'home',
  LOGIN: 'login',
  STEPS: 'steps',
  CREATE_STEP: 'steps/create',
  MANAGERS: 'managers',
}

export const LOADING = {
  NONE: null,
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

export const MODES = {
  CREATE: 'create',
  EDIT: 'EDIT',
}

export const STEP_STATUS = {
  WAIT_APPROVE: 'wait approve',
  APPROVED: 'approved',
  CLOSED: 'closed',
}
