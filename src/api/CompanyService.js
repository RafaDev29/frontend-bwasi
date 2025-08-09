import axiosInstance from "@/config/http.config";


const baseURL = process.env.VUE_APP_BASE_URL;



export function createCustomersApi(token, payload) {
  return axiosInstance.post(`${baseURL}/customers`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export function listCustomersApi(token) {
  return axiosInstance.get(`${baseURL}/customers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteCustomersApi(token, id) {
  return axiosInstance.delete(`${baseURL}/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



export function updateCustomersApi(token, payload, id) {

  console.log(token, payload, id)
  return axiosInstance.patch(`${baseURL}/customers/${id}`,payload,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

