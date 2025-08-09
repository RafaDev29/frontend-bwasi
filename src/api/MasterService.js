import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;

export function listCompaniesApi(token) {
  return axiosInstance.get(`${baseURL}/companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteCompaniesApi(token, id) {
  return axiosInstance.delete(`${baseURL}/companies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function createCompaniesApi(token, payload) {
  return axiosInstance.post(`${baseURL}/companies`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function updateCompaniesApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/companies/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

