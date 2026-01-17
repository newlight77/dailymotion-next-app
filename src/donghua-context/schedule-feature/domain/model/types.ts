export type UpcomingEpisodeType = {
  title: string,
  source: string,
  episode?: number | string,
  date?: string,
  url?: string,
  isEstimate?: boolean,
}

export type UpcomingScheduleRequestItem = {
  title: string,
  originalTitle?: string,
}

export type UpcomingScheduleResponse = {
  items: UpcomingEpisodeType[]
}
