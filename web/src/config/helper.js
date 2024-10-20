import dayjs from "dayjs";

export const Config = {
  base_url: "http://localhost:8081/api/",
  image_path: "http://localhost:80/image_node_api/",
  version: "",
  token: "",
};

export const getUser = () => {
  var user = localStorage.getItem("profile");
  if (user != null && user != "") {
    user = JSON.parse(user);
    return user;
  }
  // window.location.href = "login";
  return null;
};

export const setUser = (user = {}) => {
  localStorage.setItem("profile", JSON.stringify(user));
  localStorage.setItem("isLogin", "1");
};

export const logout = () => {
  localStorage.setItem("profile", "");
  localStorage.setItem("isLogin", "0");
  window.location.href = "login";
};

export const isLogin = () => {
  if (localStorage.getItem("isLogin") == "1") {
    return true;
  } else {
    return false;
  }
}

export const formartDateClient = (date) => {
  if (date !== null && date !== "") {
    return dayjs(date).format("DD-MMMM-YYYY");
  }
  return null;
}

export const formartDateServer = (date) => {
  if (date !== null && date !== "") {
    return dayjs(date).format("YYYY-MMMM-DD");
  }
  return null;
}

export const isEmptyOrNull = (value) => {
  if (value === "" || value === null || value === undefined || value === "null" || value === "undefined") {
      return true;
  }

  return false;
};