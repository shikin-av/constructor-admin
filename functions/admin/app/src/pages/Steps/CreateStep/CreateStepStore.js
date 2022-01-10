import { makeAutoObservable, runInAction, toJS } from 'mobx'
import moment from 'moment'
import { LOADING, API_URL, HEADERS } from '../../../constants'
import { storage, ref, getDownloadURL } from '../../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../../utils/response'

export const STATUS = {
  WAIT_APPROVE: 'wait approve',
  APPROVED: 'approved',
  CLOSED: 'closed',
}

class CreateStepStore {
  // Models
  modelsLoading = LOADING.NONE
  modelsError = null
  allModelsCount = 0
  LIMIT = 4
  startAt = 0
  pageNumber = 1
  pageModels = []
  selectedModels = []

  // StoryStep
  saveLoading = LOADING.NONE
  saveError = null
  title
  description
  status = STATUS.WAIT_APPROVE
  specialDates = null  // [moment, moment] or null
  imageName
  welcomeBonus  // TODO:
  finalBonus    // TODO:
  

  constructor() {
    makeAutoObservable(this)
  }

  loadModelsPage = async () => {
    const token = localStorage.getItem('token')
    this.modelsLoading = LOADING.PROGRESS

    await fetch(`${API_URL}/models/needPublishModels/${this.startAt}/${this.LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token},
    })
    .then(async res => this.parseModelsPageResponse(res))
    .catch(async err => this.parseModelsPageResponse(err))
  }

  parseModelsPageResponse = async (res) => {
    const parsed = await handleResponse(res)

    runInAction(() => {
      this.modelsLoading = parsed.status

      if (this.modelsLoading === LOADING.SUCCESS) {
        this.pageModels = parsed.payload.models
        this.allModelsCount = parsed.payload.allModelsCount
        this.modelsError = null
      } else {
        this.pageModels = []
        this.allModelsCount = 0
        this.modelsError = parsed.error
      }
    })
  }

  loadModelImage = async (userId, modelId) => {
    return await getDownloadURL(ref(storage, `${userId}/${modelId}.png`))
  }

  saveStoryStep = async ({ title, description, status, specialDates }) => {
    console.log('models', toJS(this.selectedModels))
    console.log('imageName', this.imageName)
    console.log('title', title)
    console.log('description', description)
    console.log('status', status)
    console.log('specialDates', specialDates)

    this.saveLoading = LOADING.PROGRESS
    const token = localStorage.getItem('token')
    const body = {
      models: toJS(this.selectedModels),
      imageName: this.imageName,
      title,
      description,
      status,
      specialDates: this.formatDates(specialDates),
    }

    await fetch(`${API_URL}/storySteps`, {
      method: 'POST',
      headers: { ...HEADERS, token},
      body: JSON.stringify(body)
    })
    .then(async res => this.parseSaveStepResponse(res))
    .catch(async err => this.parseSaveStepResponse(err))
  }

  parseSaveStepResponse = async (res) => {
    const parsed = await handleResponse(res)

    runInAction(() => {
      this.saveLoading = parsed.status

      if (this.saveLoading === LOADING.SUCCESS) {
        this.saveError = null

        // const { selectedModels, imageName, title, description, status, specialDates } = parsed.payload
        // this.selectedModels = selectedModels
        // this.imageName = imageName
        // this.title = title
        // this.description = description
        // this.status = status
        // this.specialDates = (Array.isArray(specialDates) && specialDates.length === 2)
        //   ? [moment(specialDates[0]), moment(specialDates[1])]
        //   : null
      } else {
        this.saveError = parsed.error
      }
    })
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
    this.specialDates = val
  }

  // [moment, moment] -> [miliseconds, miliseconds]
  formatDates = (specialDates) => {
    if (Array.isArray(specialDates) && specialDates.length === 2) {
      if (moment.isMoment(specialDates[0]) && moment.isMoment(specialDates[1])) {
        return [specialDates[0].valueOf(), specialDates[1].valueOf()]
      } else {
        try {
          return [new Date(specialDates[0]), new Date(specialDates[1])]
        } catch (err) {
          return null
        }
      }
    }
    return null
  }
}

export const createStepStore = new CreateStepStore()