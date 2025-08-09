import axiosInstance from "@/config/http.config";

const baseURL = process.env.VUE_APP_BASE_URL;

export function listaRuleApi(token) {
  return axiosInstance.get(`${baseURL}/alerts-rule`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteRuleApi(token, id) {
  return axiosInstance.delete(`${baseURL}/alerts-rule/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createRuleApi(token, payload) {
  return axiosInstance.post(`${baseURL}/alerts-rule`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateRuleApi(token, payload, id) {
  return axiosInstance.patch(`${baseURL}/alerts-rule/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateMassiveRuleApi(token, payload) {
  return axiosInstance.post(`${baseURL}/alerts-rule/update-massive`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
