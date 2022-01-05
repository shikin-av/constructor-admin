import { makeAutoObservable, runInAction } from 'mobx'
import { LOADING, API_URL, HEADERS } from '../../constants'
import { storage, ref, getDownloadURL } from '../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../utils/response'

class CreateStepStore {
  token = localStorage.getItem('token')
  status = LOADING.NONE
  error = null
  allModelsCount = 0
  LIMIT = 4
  startAt = 0
  pageNumber = 1
  pageModels = []
  selectedModels = []  

  constructor() {
    makeAutoObservable(this)
  }

  loadPage = async () => {
    this.status = LOADING.PROGRESS

    await fetch(`${API_URL}/models/needPublishModels/${this.startAt}/${this.LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token: this.token },
    })
    .then(async res => this.parseResponse(res))
    .catch(async err => this.parseResponse(err))
  }

  parseResponse = async (res) => {
    const parsed = await handleResponse(res)

    runInAction(() => {
      this.status = parsed.status

      if (this.status == LOADING.SUCCESS) {
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
    const selected = this.selectedModels.find(m => m.modelId == modelId)

    if (selected) {
      this.selectedModels = this.selectedModels.filter(m => m.modelId !== modelId)
    } else {
      const model = this.pageModels.find(m => m.modelId == modelId)
      if (model) {
        this.selectedModels.push(model)
      }      
    }
  }

  isSelected = (modelId) => !!this.selectedModels.find(m => m.modelId == modelId)
}

export const createStepStore = new CreateStepStore()