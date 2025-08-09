import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listCAntennaApi(token) {
  return axiosInstance.get(`${baseURL}/type-areapoints`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteCAntennaApi(token, id) {
  return axiosInstance.delete(`${baseURL}/type-areapoints/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createCAntennaApi(token, payload) {
  return axiosInstance.post(`${baseURL}/type-areapoints`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateCAntennaApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/type-areapoints/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

