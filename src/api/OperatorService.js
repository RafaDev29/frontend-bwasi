import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listOperatorApi(token) {
  return axiosInstance.get(`${baseURL}/operators`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteOperatorApi(token, id) {
  return axiosInstance.delete(`${baseURL}/operators/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createOperatorApi(token, payload) {
  return axiosInstance.post(`${baseURL}/operators`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateOperatorApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/operators/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

