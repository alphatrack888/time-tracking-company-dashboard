import { baseApi } from "../baseApi";

// This app's axiosBaseQuery (utils/axiosBaseQuery.js) has no `params`
// support unlike the admin dashboard's — query strings are built directly
// into `url` here, matching the existing convention in dashboardApi.js /
// employeeApi.js.
const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/notifications?page=${page}&limit=${limit}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        };
      },
      providesTags: ["notification"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/notifications/${id}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        };
      },
      invalidatesTags: ["notification"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/notifications/all`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        };
      },
      invalidatesTags: ["notification"],
    }),
    getNotificationPreferences: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/notification-preferences`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        };
      },
      providesTags: ["notificationPreferences"],
    }),
    updateNotificationPreferences: builder.mutation({
      query: (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/notification-preferences`,
          method: "PATCH",
          body: data,
          headers: { Authorization: `Bearer ${accessToken}` },
        };
      },
      invalidatesTags: ["notificationPreferences"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationApi;
