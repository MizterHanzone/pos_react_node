import axios from "axios";
import { Config } from "./helper";

export const request = async (url = "", method = "get", data = {}) => {
  var param_get = "";
  if (method === "get" && Object.keys(data).length > 0) {
    Object.keys(data).map((key, i) => {
      param_get += (i == 0 ? "?" : "&") + key + "=" + data[key];
    });
  }

  var headers = { 'Centent-Type': 'application/json' };
  if (data instanceof FormData) {
    headers = { 'Centent-Type': 'multipart/form-data' };
  }
  return axios({
    url: Config.base_url + url + param_get,
    method: method,
    data: data,
    headers: headers
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      var status = error.response?.status;
      if ((status = 404)) {
        alert(error.message);
      }
      console.log(error);
      return false;
    });
};
