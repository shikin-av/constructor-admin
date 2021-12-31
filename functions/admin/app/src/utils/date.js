import { LANG } from '../components/Lang/i18n'

const getLang = () => localStorage.getItem('lang') || LANG.ENG

export const dateFormat = (date) => {
  const lang = getLang()

  return new Date(date)
    .toLocaleString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    .toString()
}

export const timeFormat = (date) => {
  const lang = getLang()

  return new Date(date)
    .toLocaleString(lang, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    .toString()
}