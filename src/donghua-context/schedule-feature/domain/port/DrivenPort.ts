import { UpcomingEpisodeType, UpcomingScheduleRequestItem } from "../model/types";

export type UpcomingScheduleDrivenPort = {
  fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => Promise<UpcomingEpisodeType[]>
}
