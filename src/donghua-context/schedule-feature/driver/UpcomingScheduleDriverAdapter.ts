import { UpcomingScheduleUsecaseType } from "../domain";
import { UpcomingEpisodeType, UpcomingScheduleRequestItem } from "../domain";

export type UpcomingScheduleDriverType = {
  fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => Promise<UpcomingEpisodeType[]>;
}

export const upcomingScheduleDriverAdapter = (usecase: UpcomingScheduleUsecaseType): UpcomingScheduleDriverType => {
  return {
    fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => {
      return usecase.fetchUpcomingEpisodes(items);
    }
  }
}
