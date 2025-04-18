import { useVideoSearchHistory } from "../../hooks";
import { SearchKeywordsType } from "../model";

export const VideoSearchHistoryUsecase = {
  addOrUpdate: (searchKeywords: SearchKeywordsType) => {
    const useLastView = useVideoSearchHistory();
    useLastView.addOrUpdate(searchKeywords)
  },
}