import { LastViewType } from "../domain";
import { LastViewsDriverPort } from "../domain/port";
import { LastViewsQueryType, LastViewsUsecaseType } from '../domain/usecases'



export const lastViewsDriverAdapter = (usecase: LastViewsUsecaseType, query: LastViewsQueryType) : LastViewsDriverPort => ({

  items: (): LastViewType[] => {
    return query.items()
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
