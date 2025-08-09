import axiosInstance from "@/config/http.config";

const baseURL = process.env.VUE_APP_BASE_URL;

export function listReportApi(token, paylaod) {
  
  return axiosInstance.post(`${baseURL}/reports/monitoring`, paylaod,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

