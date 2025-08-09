import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listTagApiId(token, tagId) {
  return axiosInstance.get(`${baseURL}/mobiles-items/${tagId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function listTagApi(token) {
  return axiosInstance.get(`${baseURL}/mobiles-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteTagApi(token, payload) {
  return axiosInstance.post(`${baseURL}/mobiles-items/delete`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function deleteMassiveTagApi(token, payload) {
  return axiosInstance.post(`${baseURL}/mobiles-items/delete`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
}



export function createTagApi(token, payload) {
  return axiosInstance.post(`${baseURL}/mobiles-items`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateTagApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/mobiles-items/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateMassiveTagApi(token, payload) {
  return axiosInstance.post(`${baseURL}/mobiles-items/updatetype`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

