import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listGAreasApi(token) {
  return axiosInstance.get(`${baseURL}/group-areas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteGAreasApi(token, id) {
  return axiosInstance.delete(`${baseURL}/group-areas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createGAreasApi(token, payload) {
  return axiosInstance.post(`${baseURL}/group-areas`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateGAreasApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/group-areas/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

