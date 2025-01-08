
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function queryParamsToQueryString(params: any) {
  const queryString = new URLSearchParams()
  for(const key in params){
      queryString.append(key, params[key])
  }
  return queryString.toString();
}