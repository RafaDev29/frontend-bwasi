import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listLayoutApi(token) {
  return axiosInstance.get(`${baseURL}/layouts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteLayoutApi(token, id) {
  return axiosInstance.delete(`${baseURL}/layouts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createLayoutApi(token, payload) {
  return axiosInstance.post(`${baseURL}/layouts`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateLayoutApi(token, payload, id) {

  return axiosInstance.patch(`${baseURL}/layouts/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadLayoutApi(token, payload, id) {
  return axiosInstance.post(`${baseURL}/layouts/updatebackgroundImage/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



