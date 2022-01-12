import { makeAutoObservable, runInAction, toJS } from 'mobx'
import moment from 'moment'
import { LOADING, API_URL, HEADERS, LIMITS } from '../../../constants'
import { storage, ref, getDownloadURL } from '../../../firebase'
import { handleResponse, getStartAt, getPageNumber } from '../../../utils/response'

class StepsStore {
  constructor() {
    this.reset()
    makeAutoObservable(this)
  }

  reset = () => {
    runInAction(() => {
      this.stepsLoading = LOADING.NONE
      this.stepsError = null
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

    await fetch(`${API_URL}/storySteps/${this.startAt}/${this.LIMIT}`, {
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
        this.pageSteps = parsed.payload.steps.map(step => ({ ...step, key: step.stepId}))
        this.allStepsCount = parsed.payload.allStepsCount
        this.stepsError = null
      } else {
        this.pageSteps = []
        this.allStepsCount = 0
        this.stepsError = parsed.error
      }
    })
  }

  paginationChange = (page) => {
    this.startAt = getStartAt(page, this.LIMIT)
    this.pageNumber = getPageNumber(this.startAt, this.LIMIT)
  }
}

export const stepsStore = new StepsStore()
