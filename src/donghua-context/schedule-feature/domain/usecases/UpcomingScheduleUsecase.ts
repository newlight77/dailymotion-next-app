import { UpcomingEpisodeType, UpcomingScheduleRequestItem } from "../model/types";
import { UpcomingScheduleDrivenPort } from "../port/DrivenPort";

export type UpcomingScheduleUsecaseType = {
  fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => Promise<UpcomingEpisodeType[]>;
}

export const upcomingScheduleUsecase = (drivenPort: UpcomingScheduleDrivenPort): UpcomingScheduleUsecaseType => {
  return {
    fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => {
      return drivenPort.fetchUpcomingEpisodes(items);
    }
  }
}
