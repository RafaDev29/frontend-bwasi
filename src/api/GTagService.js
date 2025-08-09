import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listGTagsApi(token) {
  return axiosInstance.get(`${baseURL}/group-mobileitems`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteGTagsApi(token, id) {
  return axiosInstance.delete(`${baseURL}/group-mobileitems/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createGTagsApi(token, payload) {
  return axiosInstance.post(`${baseURL}/group-mobileitems`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateGTagsApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/group-mobileitems/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

