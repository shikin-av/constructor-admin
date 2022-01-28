import { storage, ref, getDownloadURL } from '../firebase'
import { STEP_STATUS, FOLDERS } from '../constants'

export const getStatusColor = (status) => {
  const { WAIT_APPROVE, APPROVED, CLOSED } = STEP_STATUS
  switch(status) {
    case WAIT_APPROVE: return 'orange'
    case APPROVED: return 'green'
    case CLOSED: return 'red'
    default: return 'orange'
  }
}
