'use client'
import { UpcomingEpisodeType, UpcomingScheduleRequestItem } from "../domain";
import { UpcomingScheduleDrivenPort } from "../domain";

export const useUpcomingScheduleDrivenAdapter = (): UpcomingScheduleDrivenPort => {
  return {
    fetchUpcomingEpisodes: async (items: UpcomingScheduleRequestItem[]): Promise<UpcomingEpisodeType[]> => {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data?.items || [];
    }
  }
}
