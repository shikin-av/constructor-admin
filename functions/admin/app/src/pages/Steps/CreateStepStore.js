import { makeAutoObservable, runInAction } from 'mobx'
import { LOADING, API_URL, HEADERS } from '../../constants'
import { storage, ref, getDownloadURL } from '../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../utils/response'

class CreateStepStore {
  token = localStorage.getItem('token')
  status = LOADING.NONE
  error = null
  LIMIT = 4
  startAt = 0
  pageNumber = 1
  models = []
  allModelsCount = 0

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
        this.models = parsed.payload.models
        this.allModelsCount = parsed.payload.allModelsCount
        this.error = null
      } else {
        this.models = []
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

  getModelById = (modelId) => this.models.find(m => m.modelId === modelId)
}

export const createStepStore = new CreateStepStore()