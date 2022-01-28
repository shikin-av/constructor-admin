import { makeAutoObservable, runInAction } from 'mobx'
import { LOADING, API_URL, HEADERS, LIMITS, FOLDERS, EMPTY_LANG_INPUTS } from '../../../constants'
import { handleResponse, getStartAt, getPageNumber } from '../../../utils/response'

class StepsListStore {
  constructor() {
    this.reset()
    makeAutoObservable(this)
  }

  reset = () => {
    runInAction(() => {
      this.stepsLoading = LOADING.NONE
      this.stepsError = null
      this.deleteloading = LOADING.NONE      
      this.deleteError = null
      this.allStepsCount = 0
      this.LIMIT = LIMITS.STEPS
      this.startAt = 0
      this.pageNumber = 1
      this.pageSteps = []
    })
  }

  loadStepsPage = async () => {
    const token = localStorage.getItem('token')
    this.stepsLoading = LOADING.PROGRESS

    await fetch(`${API_URL}/publicStorySteps/${this.startAt}/${this.LIMIT}`, {
      method: 'GET',
      headers: { ...HEADERS, token},
    })
    .then(async res => this.parseStepsPageResponse(res))
    .catch(async err => this.parseStepsPageResponse(err))
  }

  parseStepsPageResponse = async (res) => {
    const parsed = await handleResponse(res)
    console.log('parsed', parsed)
    runInAction(() => {
      this.stepsLoading = parsed.status

      if (this.stepsLoading === LOADING.SUCCESS) {
        this.pageSteps = parsed.payload.steps.map(step => ({
          ...step,
          key: step.stepId,
          titles: { ...EMPTY_LANG_INPUTS, ...step.titles },
          descriptions: { ...EMPTY_LANG_INPUTS, ...step.descriptions }
        }))
        
        this.allStepsCount = parsed.payload.allStepsCount
        this.stepsError = null
      } else {
        this.pageSteps = []
        this.allStepsCount = 0
        this.stepsError = parsed.error
      }
    })
  }

  deleteStep = async (stepId) => {
    const token = localStorage.getItem('token')
    this.deleteloading = LOADING.PROGRESS

    await fetch(`${API_URL}/publicStorySteps/${stepId}`, {
      method: 'DELETE',
      headers: { ...HEADERS, token},
    })
    .then(async res => this.parseDeleteStepResponse(res))
    .catch(async err => this.parseDeleteStepResponse(err))
  }

  parseDeleteStepResponse = async (res) => {
    const parsed = await handleResponse(res)
    console.log('parsed', parsed)
    runInAction(() => {
      this.deleteLoading = parsed.status

      if (this.deleteLoading === LOADING.SUCCESS) {
        const { stepId } = parsed.payload
        this.pageSteps = this.pageSteps.filter(s => s.stepId !== stepId)
        this.allStepsCount = this.allStepsCount - 1
        this.deleteError = null
      } else {
        this.deleteError = parsed.error
      }
    })
  }

  paginationChange = (page) => {
    this.startAt = getStartAt(page, this.LIMIT)
    this.pageNumber = getPageNumber(this.startAt, this.LIMIT)
  }

  getStepById = (stepId) => this.pageSteps.find(s => s.stepId === stepId)
}

export const stepsListStore = new StepsListStore()
