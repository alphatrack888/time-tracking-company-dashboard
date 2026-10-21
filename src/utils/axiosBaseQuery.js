import axios from "axios";

export const axiosBaseQuery =
  ({ baseUrl }) =>
  async ({ url, method, body, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        headers: headers || { "content-type": "application/json" },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };