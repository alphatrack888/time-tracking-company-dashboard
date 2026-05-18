import { baseApi } from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardOverview: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/dashboard/company-general-stats",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["user"],
    }),
    employeeByYear: builder.query({
      query: (year) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/dashboard/total-employees-yearly?year=${year}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["user"],
    }),
    projectByYear: builder.query({
      query: (year) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/dashboard/total-employees-yearly?year=${year}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["user"],
    }),
    getSubscriptionPlans: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/subscriptions/plans",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["user"],
    }),
    createCheckoutSession: builder.mutation({
      query: (body) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/subscriptions/checkout-session",
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body,
        };
      },
    }),
  }),
});

export const {
  useDashboardOverviewQuery,
  useEmployeeByYearQuery,
  useProjectByYearQuery,
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation,
} = dashboardApi;
