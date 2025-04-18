import { useLastViews } from "../../hooks";
import { LastViewType } from "../model";

export const LastViewsUsecase = {
  addOrUpdate: (lastView: LastViewType) => {
    const useLastView = useLastViews();
    useLastView.addOrUpdate(lastView)
  },
}