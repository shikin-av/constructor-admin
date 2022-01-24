import { makeAutoObservable, runInAction, toJS } from 'mobx'
import _ from 'lodash'
import moment from 'moment'
import { LOADING, API_URL, HEADERS, STEP_STATUS, LIMITS, FOLDERS, EMPTY_LANG_INPUTS, MODES } from '../../../constants'
import { storage, ref, getDownloadURL, uploadBytes, deleteObject } from '../../../firebase'
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

      this.allModelsCount = 0 // TODO: rename: all needPusblish models
      this.LIMIT = LIMITS.MODELS
      this.startAt = 0
      this.pageNumber = 1
      this.pageModels = []
      this.allModels = [] // TODO: rename: all loaded models
    })
  }

  resetStep = () => {
    runInAction(() => {
      this.saveLoading = LOADING.NONE
      this.saveError = null

      this.stepLoading = LOADING.NONE
      this.stepError = null

      this.stepId = null 
      this.status = STEP_STATUS.WAIT_APPROVE
      this.selectedModels = []
      this.specialDates = null  // [moment, moment] or null
      this.imageFile = null
      this.imageURL = null
      this.welcomeBonus = null  // TODO:
      this.finalBonus = null    // TODO:
      this.titles = EMPTY_LANG_INPUTS
      this.descriptions = EMPTY_LANG_INPUTS
    })
  }

  resetAll = () => {
    this.resetModels()
    this.resetStep()
  }

  setStepId = val => this.stepId = val
  setStatus = (val) => this.status = val
  setSpecialDates = (val, dateString) => this.specialDates = val
  setTitles = (val, KEY) => {
    this.titles = { ...this.titles, [KEY]: val }
  }
  setDescriptions = (val, KEY) => {
    this.descriptions = { ...this.descriptions, [KEY]: val }
  }
  setImageURL = async (imageName) => {
    runInAction(async () => {
      this.imageURL = imageName ? await this.loadStepImageURL(imageName) : null
    })
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

        for (const pageModel of toJS(this.pageModels)) {
          const finded = _.find(toJS(this.allModels), { userId: pageModel.userId, modelId: pageModel.modelId })
          if (!finded) {
            this.allModels = [pageModel, ...toJS(this.allModels)]
          }
        }

        if (this.pageNumber === 1) {
          for (const selected of toJS(this.selectedModels)) {          
            const pageFinded = _.find(toJS(this.pageModels), { userId: selected.userId, modelId: selected.modelId })
            if (!pageFinded) {
              this.pageModels = [selected, ...toJS(this.pageModels)]
            }

            const allFinded = _.find(toJS(this.allModels), { userId: selected.userId, modelId: selected.modelId })
            if (!allFinded) {
              this.allModels = [selected, ...toJS(this.allModels)]
            }
          }
        } else {
          for (const selected of toJS(this.selectedModels)) {
            const pageFinded = _.find(toJS(this.pageModels), { userId: selected.userId, modelId: selected.modelId })
            if (pageFinded) {
              _.remove(this.pageModels, (model) => model.userId === selected.userId && model.modelId === selected.modelId)
            }
          }
        }

        this.allModelsCount = parsed.payload.allModelsCount
        this.modelsError = null
      } else {
        this.pageModels = []
        this.allModelsCount = 0
        this.modelsError = parsed.error
      }
    })
  }

  saveStoryStep = async (mode) => {
    let imageName = null
    if (this.imageFile) {
      try {
        await this.uploadImage(this.imageFile)
        imageName = this.getFileName(this.imageFile)
        this.setImageURL(imageName)
      } catch(err) {
        console.error(err)
        // TODO: м.б. message.error()
      }
    }

    const redusedTitles = toJS(this.titles)
    for (const [key, val] of Object.entries(redusedTitles)) {
      if (!val) delete redusedTitles[key]
    }

    const redusedDescriptions = toJS(this.descriptions)
    for (const [key, val] of Object.entries(redusedDescriptions)) {
      if (!val) delete redusedDescriptions[key]
    }

    this.saveLoading = LOADING.PROGRESS
    const token = localStorage.getItem('token')
    const body = {
      stepId: this.stepId,
      models: toJS(this.selectedModels),
      imageName,
      titles: redusedTitles,
      descriptions: redusedDescriptions,
      status: this.status,
      specialDates: this.formatDates(this.specialDates),
      updatedAt: new Date().getTime(),
    }

    console.log('save body', body)

    const url = mode === MODES.CREATE
      ? `${API_URL}/publicStorySteps`
      : `${API_URL}/publicStorySteps/${this.stepId}`

    await fetch(url, {
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

  loadStoryStep = async (stepId) => {
    const token = localStorage.getItem('token')
    this.stepLoading = LOADING.PROGRESS

    await fetch(`${API_URL}/publicStorySteps/${stepId}`, {
      method: 'GET',
      headers: { ...HEADERS, token},
    })
    .then(async res => this.parseLoadStoryStepResponse(res))
    .catch(async err => this.parseLoadStoryStepResponse(err))
  }

  parseLoadStoryStepResponse = async (res) => {
    const parsed = await handleResponse(res)

    runInAction(async () => {
      if (parsed.status === LOADING.SUCCESS) {
        const { 
          stepId, 
          status, 
          models, 
          specialDates, 
          imageName, 
          welcomeBonus, 
          finalBonus, 
          titles, 
          descriptions 
        } = parsed.payload

        this.stepError = null
        this.stepId = stepId
        this.status = status
        this.welcomeBonus = welcomeBonus
        this.finalBonus = finalBonus
        this.titles = { ...EMPTY_LANG_INPUTS, ...titles }
        this.descriptions = { ...EMPTY_LANG_INPUTS, ...descriptions }
        this.selectedModels = models

        if (Array.isArray(specialDates) && specialDates.length === 2) {
          this.specialDates = [moment(specialDates[0]), moment(specialDates[1])]
        }

        this.setImageURL(imageName)
        
        this.stepLoading = parsed.status
      } else {
        this.stepError = parsed.error
      }
    })
  }

  paginationChange = (page) => {
    this.startAt = getStartAt(page, this.LIMIT)
    this.pageNumber = getPageNumber(this.startAt, this.LIMIT)
  }

  loadModelImageURL = async (userId, modelId) => {
    return await getDownloadURL(ref(storage, `${userId}/${modelId}.png`))
  }

  loadStepImageURL = async (imageName) => {
    return await getDownloadURL(ref(storage, `/public/${imageName}`))
  }

  getFileName = (file) => {
    const fileExtension = file.name.split('.').pop()
    return `${this.stepId}.${fileExtension}`
  }

  chooseImage = (val) => {
    this.imageFile = val.file
    const imageName = this.getFileName(this.imageFile)
    this.setImageURL(imageName)
    val.onSuccess()
  }

  uploadImage = async (file) => {
    const fileName = this.getFileName(file)
    const storageRef = ref(storage, `${FOLDERS.PUBLIC}/${fileName}`)
    await uploadBytes(storageRef, file)
  }

  removeImage = async (file) => {
    // const fileName = this.getFileName(file)
    // const storageRef = ref(storage, `${FOLDERS.PUBLIC}/${fileName}`)
    // try {
    //   deleteObject(storageRef)
    //   this.imageFile = null
    //   this.imageName = null
    // } catch(err) {
    //   console.error(err)
    // }
    this.imageFile = null
    this.imageURL = null
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