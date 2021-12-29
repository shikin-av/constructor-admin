export const dateFormat = (date) => new Date(date)
  .toLocaleString(window.lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  .toString()

  export const timeFormat = (date) => new Date(date)
  .toLocaleString(window.lang, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
  .toString()