'use client'
import React, { useContext } from 'react';
import { createContext } from "react";
import { UpcomingEpisodeType, UpcomingScheduleRequestItem, upcomingScheduleUsecase } from '../domain';
import { useUpcomingScheduleDrivenAdapter } from '../driven/UpcomingScheduleDrivenAdapter';
import { upcomingScheduleDriverAdapter } from '../driver/UpcomingScheduleDriverAdapter';

export interface UpcomingScheduleContextType {
  fetchUpcomingEpisodes: (items: UpcomingScheduleRequestItem[]) => Promise<UpcomingEpisodeType[]>;
}

export const UpcomingScheduleContext = createContext<UpcomingScheduleContextType>({
  fetchUpcomingEpisodes: async () => []
});

type Props = {
  children: React.ReactNode
}

export const UpcomingScheduleConfigurator = ({ children }: Props): React.ReactElement => {
  const driven = useUpcomingScheduleDrivenAdapter();
  const driver = upcomingScheduleDriverAdapter(upcomingScheduleUsecase(driven));

  return (
    <UpcomingScheduleContext.Provider value={{
      fetchUpcomingEpisodes: driver.fetchUpcomingEpisodes
    }}>
      {children}
    </UpcomingScheduleContext.Provider>
  )
}

export const useUpcomingSchedule = (): UpcomingScheduleContextType => useContext(UpcomingScheduleContext);
