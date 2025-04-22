import { LastViewType } from "../domain";
import { LastViewsDriverPort } from "../domain/port";
import { LastViewsUsecaseType } from '../domain/usecases'



export const lastViewsDriverAdapter = (usecase: LastViewsUsecaseType) : LastViewsDriverPort => ({

  items: (): LastViewType[] => {
    return usecase.items()
  },

  addOrUpdate : (lastView: LastViewType) => {
    usecase.addOrUpdate(lastView)
  },

  remove: (uid: string) => {
    usecase.remove(uid)
  },

  clear: () => {
    usecase.clear()
  }

})
