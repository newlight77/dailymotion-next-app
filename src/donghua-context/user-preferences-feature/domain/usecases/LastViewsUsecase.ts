import { LastViewType } from "../model";
import { LastViewsDrivenPort } from "../port";


export type LastViewsUsecaseType = {

  items: () => LastViewType[],
  addOrUpdate : (lastView: LastViewType) => void,
  remove : (uid: string) => void,
  clear : () => void,
}

export const lastViewsUsecase = (drivenPort: LastViewsDrivenPort) : LastViewsUsecaseType => {

  return {

    items: () => {
      return drivenPort.items()
    },

    addOrUpdate : (lastView: LastViewType) => {
      drivenPort.addOrUpdate(lastView)
    },

    remove : (uid: string) => {
      drivenPort.remove(uid)
    },

    clear : () => {
      drivenPort.clear()
    },
  }

}