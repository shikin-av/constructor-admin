import { makeAutoObservable, runInAction, toJS } from 'mobx'
import { LOADING, API_URL, HEADERS } from '../../../constants'
import { storage, ref, getDownloadURL } from '../../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../../utils/response'

export const STATUS = {
  WAIT_APPROVE: 'wait approve',
  APPROVED: 'approved',
  CLOSED: 'closed',
}

class CreateStepStore {
  loading = LOADING.NONE
  error = null
  allModelsCount = 0
  LIMIT = 4
  startAt = 0
  pageNumber = 1
  pageModels = []
  selectedModels = []

  title
  description
  status = STATUS.WAIT_APPROVE
  specialDates  // [moment, moment] or null
  image
  welcomeBonus
  finalBonus
  

  constructor() {
    makeAutoObservable(this)
  }

  loadModelsPage = async () => {
    const token = localStorage.getItem('token')
    this.loading = LOADING.PROGRESS

    await fetch(`${API_URL}/models/needPublishModels/${this.startAt}/${this.LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token},
    })
    .then(async res => this.parseResponse(res))
    .catch(async err => this.parseResponse(err))
  }

  parseResponse = async (res) => {
    const parsed = await handleResponse(res)

    runInAction(() => {
      this.loading = parsed.status

      if (this.loading === LOADING.SUCCESS) {
        this.pageModels = parsed.payload.models
        this.allModelsCount = parsed.payload.allModelsCount
        this.error = null
      } else {
        this.pageModels = []
        this.allModelsCount = 0
        this.error = parsed.error
      }
    })
  }

  loadModelImage = async (userId, modelId) => {
    return await getDownloadURL(ref(storage, `${userId}/${modelId}.png`))
  }

  paginationChange = (page) => {
    this.startAt = getStartAt(page, this.LIMIT)
    this.pageNumber = getPageNumber(this.startAt, this.LIMIT)
  }

  getModelById = (modelId) => this.pageModels.find(m => m.modelId === modelId)

  selectModel = (modelId) => {
    const model = this.pageModels.find(m => m.modelId === modelId)
    if (model) {
      this.selectedModels.push(model)
    }
  }

  unselectModel = (modelId) => {
    this.selectedModels = this.selectedModels.filter(m => m.modelId !== modelId)
  }

  switchSelectModel = (modelId) => {
    const selected = this.selectedModels.find(m => m.modelId === modelId)

    selected ? this.unselectModel(modelId) : this.selectModel(modelId)
  }

  isSelected = (modelId) => !!this.selectedModels.find(m => m.modelId === modelId)

  swapSelectedPosition = (index1, index2) => {
    const temp = this.selectedModels[index1]
  
      this.selectedModels[index1] = this.selectedModels[index2]
      this.selectedModels[index2] = temp
  }

  selectedToLeft = (modelId) => {
    const index = this.selectedModels.findIndex(m => m.modelId === modelId)
    if (index === -1 || index === 0) return

    this.swapSelectedPosition(index, index - 1)
  }

  selectedToRight = (modelId) => {
    const index = this.selectedModels.findIndex(m => m.modelId === modelId)
    if (index === -1 || index === this.selectedModels.length - 1) return

    this.swapSelectedPosition(index, index + 1)
  }

  isFirstSelected = (modelId) => {
    const index = this.selectedModels.findIndex(m => m.modelId === modelId)
    return index === 0
  }

  isLastSelected = (modelId) => {
    const index = this.selectedModels.findIndex(m => m.modelId === modelId)
    return index === this.selectedModels.length - 1
  }

  setStatus = (val) => {
    runInAction(() => {
      this.status = val
    })
  }

  changeDates = (val, dateString) => {
    // TODO: CHECK DATE ARRAY
    this.specialDates = val
  }

  saveStoryStep = ({ title, description, status, specialDates }) => {
    console.log('models', toJS(this.selectedModels))
    console.log('title', title)
    console.log('description', description)
    console.log('status', status)
    console.log('specialDates', specialDates)
  }
}

export const createStepStore = new CreateStepStore()