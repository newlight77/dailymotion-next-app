export const dateTimeFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}

export const displayDate = (time: number) => {
  return new Date(time * 1000).toLocaleDateString('en-US', dateTimeFormat);
  // return new Intl.DateTimeFormat('en-US', format).format(time * 1000);
}

export const displayDuration = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getMinutes()}:${date.getSeconds()}`;
}