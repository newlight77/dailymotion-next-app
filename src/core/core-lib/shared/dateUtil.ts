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

export const displayDurationInHMS = (decimalSeconds: number): string => {
  const hours = Math.floor(decimalSeconds / 3600);
  const minutes = Math.floor((decimalSeconds % 3600) / 60);
  const seconds = Math.floor(decimalSeconds % 60);

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${hours>0 ? pad(hours) + ':' : ''}${pad(minutes)}:${pad(seconds)}`;
};

export const displaySinceTimestamp = (date: Date): string => {
  const now = new Date();
  const duration = now.getTime() - date.getTime();

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};