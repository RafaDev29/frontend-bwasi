import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listCTagApi(token) {
  return axiosInstance.get(`${baseURL}/type-mobileitems`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteCTagApi(token, id) {
  return axiosInstance.delete(`${baseURL}/type-mobileitems/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createCTagApi(token, payload) {
  return axiosInstance.post(`${baseURL}/type-mobileitems`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateCTagApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/type-mobileitems/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

