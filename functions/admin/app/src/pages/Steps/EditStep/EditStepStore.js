import { makeAutoObservable, runInAction, toJS } from 'mobx'
import moment from 'moment'
import { LOADING, API_URL, HEADERS, STEP_STATUS, LIMITS } from '../../../constants'
import { storage, ref, getDownloadURL } from '../../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../../utils/response'

class EditStepStore {
  constructor() {
    this.resetAll()
    makeAutoObservable(this)
  }

  resetModels = () => {
    runInAction(() => {
      this.modelsLoading = LOADING.NONE
      this.modelsError = null
      this.allModelsCount = 0
      this.LIMIT = LIMITS.MODELS
      this.startAt = 0
      this.pageNumber = 1
      this.pageModels = []
      this.selectedModels = []
    })
  }

  resetStep = () => {
    runInAction(() => {
      this.stepId = null
      this.saveLoading = LOADING.NONE
      this.saveError = null
      this.title = ''
      this.description = ''
      this.status = STEP_STATUS.WAIT_APPROVE
      this.specialDates = null  // [moment, moment] or null
      this.imageName = null
      this.welcomeBonus = null  // TODO:
      this.finalBonus = null    // TODO:
    })
  }

  resetAll = () => {
    this.resetModels()
    this.resetStep()
  }

  setStepId = val => this.stepId = val
  setTitle = (e) => this.title = e.target.value
  setDescription = (e) => this.description = e.target.value
  setStatus = (val) => this.status = val
  setSpecialDates = (val, dateString) => this.specialDates = val
  setImageName = (val) => this.imageName = val

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

  saveStoryStep = async () => {
    console.log('models', toJS(this.selectedModels))
    console.log('imageName', this.imageName)
    console.log('title', this.title)
    console.log('description', this.description)
    console.log('status', this.status)
    console.log('specialDates', this.specialDates)

    this.saveLoading = LOADING.PROGRESS
    const token = localStorage.getItem('token')
    const body = {
      stepId: this.stepId,
      models: toJS(this.selectedModels),
      imageName: this.imageName,
      title: this.title,
      description: this.description,
      status: this.status,
      specialDates: this.formatDates(this.specialDates),
      updatedAt: new Date().getTime(),
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
        this.stepId = parsed.payload.stepId
      } else {
        this.saveError = parsed.error
      }
    })
  }

  // TODO: for Load StoryStep:
  // const { selectedModels, imageName, title, description, status, specialDates } = parsed.payload
  // this.selectedModels = selectedModels
  // this.imageName = imageName
  // this.title = title
  // this.description = description
  // this.status = status
  // this.specialDates = (Array.isArray(specialDates) && specialDates.length === 2)
  //   ? [moment(specialDates[0]), moment(specialDates[1])]
  //   : null

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

  // [moment, moment] -> [miliseconds, miliseconds]
  formatDates = (specialDates) => {
    if (Array.isArray(specialDates) && specialDates.length === 2) {
      if (moment.isMoment(specialDates[0]) && moment.isMoment(specialDates[1])) {
        return [specialDates[0].valueOf(), specialDates[1].valueOf()]
      } else {
        try {
          return [
            new Date(specialDates[0]).getTime(),
            new Date(specialDates[1]).getTime()
          ]
        } catch (err) {
          return null
        }
      }
    }
    return null
  }
}

export const editStepStore = new EditStepStore()