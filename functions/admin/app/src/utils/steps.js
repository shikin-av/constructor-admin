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

export const loadStepImageURL = async (imageName) => {
  const fixedImageName = fixWrongImageURL(imageName)
  return await getDownloadURL(ref(storage, `/${FOLDERS.PUBLIC}/${fixedImageName}`))
}

export const fixWrongImageURL = (imageName) => {
  if (!imageName) {
    return null
  } else {
    const isURL = imageName.indexOf('https://firebasestorage') !== -1

    return isURL 
      ? imageName.split('%3F')[0]  // without query params
      : imageName
  }
}
