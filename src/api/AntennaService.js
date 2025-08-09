import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listAntennaApiId(token, antennaId) {
  return axiosInstance.get(`${baseURL}/area-points/${antennaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function listAntennaApi(token) {
  return axiosInstance.get(`${baseURL}/area-points`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteAntennaApi(token, id) {
  return axiosInstance.delete(`${baseURL}/area-points/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createAntennaApi(token, payload) {
  return axiosInstance.post(`${baseURL}/area-points`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateAntennaApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/area-points/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

