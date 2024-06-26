import { objectToUrlParams } from "@/utils";
import Ajax from "./Ajax";

export const fetchDashboardApi = () => {
  return Ajax.get("/projectInfo/dashboard");
};
export const fetchOrderlistIsRepeated = (params: any) => {
  return Ajax.post("/orderlist/isRepeated", params);
};
export const fetchProjectInfoSelectInfoApi = (params: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/projectInfo/selectInfo?status=1&${query_params}`);
};
export const fetchProjectInfoApi = (params: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/projectInfo/launchById?${query_params}`);
};
export const fetchWhtielistInfoApi = (params: any) => {
  const query_params = objectToUrlParams(params);
  // http://101.251.211.205:8066/whtielist/launchById
  return Ajax.get(`/whtielist/launchById?${query_params}`);
};
export const fetchProjectDetailsApi = (id: any) => {
  return Ajax.get(`/projectDetails/${id}`);
};

export const submitOderListSave = (params: any) => {
  return Ajax.post("/orderlist/oderListSave/", params);
};
export const fetchSelectFaddress = (params: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/orderlist/selectFaddress?${query_params}`);
};
//http://localhost:8066/whtielist/queryByWhitelist
// export const queryByWhitelist
export const fetchQueryByWhitelist = (params: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/whtielist/queryByWhitelist?${query_params}`);
};

export const fetchOrderCList = (params: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/orderlist/selectCOrder?${query_params}`);
};

export const fetchFeesApi = () => {
  return Ajax.get(`/mempool/fees/recommended`);
};

export const fetchRuneSearchApi = (name: string) => {
  return Ajax.get(`/runestone/search/runes/${name}`);
};

// 根据rune name 返回已经Mint的数量
export const fetchHasMintAmount = (name: string) => {
  return Ajax.get(`/runestone/search/runes/minted/amount/${name}`);
};

// 获取用户下的rune列表
export const getRunesList = (address: string) => {
  return Ajax.get(`/runestone/search/user/runes/list/${address}`);
};

// etching获取打款地址
export const fetchEtching = (data: any) => {
  return Ajax.post("/runestone/sendPostRequest", data);
};

// runes etching列表
export const fetchRuneEtchingList = ({ etchingType, txid, ...params }: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/runestone/search/order/list?${query_params}`);
};

//runes mint列表
export const fetchRuneMintList = ({ etchingType, txid,...params }: any) => {
  const query_params = objectToUrlParams(params);
  return Ajax.get(`/runestone/search/mint/order/list?${query_params}`);
};

//runes 提交mint信息
export const fetchMintSubmit = (data: any) => {
  return Ajax.post("/runestone/mempoolstatus/save/mint", data);
};
