import { LastViewType } from "../model";
import { LastViewsDrivenPort } from "../port";


export type LastViewsQueryType = {
  items: () => LastViewType[],
}

export const lastViewsQuery = (drivenPort: LastViewsDrivenPort) : LastViewsQueryType => {

  return {

    items: () => {
      return drivenPort.items()
    },

  }

}