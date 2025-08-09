import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listAreasApi(token) {
  return axiosInstance.get(`${baseURL}/areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteAreaApi(token, id) {
  return axiosInstance.delete(`${baseURL}/areas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createAreaApi(token, payload) {
  return axiosInstance.post(`${baseURL}/areas`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateAreaApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/areas/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function coordinatesAreaApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/areas/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



