import { baseApi } from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allEmployee: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/user?role=employee",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["employee"],
    }),
    createEmployee: builder.mutation({
      query: (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("create employee api data", data);

        return {
          url: "/auth/signup",
          method: "post",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["employee"],
    }),

    createPayroll: builder.mutation({
      query: ({ id, data }) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("create payroll id", id);
        console.log("create payroll api data", data);

        return {
          url: `/payrole/${id}`,
          method: "post",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["employee"],
    }),
    employeeLocationByDate: builder.query({
      query: ({ date, employeeId }) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("date", date);
        console.log("employeeId", employeeId);
        return {
          url: `/timetracker/locations?date=${date}&employee=${employeeId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["employee"],
    }),
    employeeAnalytics: builder.query({
      query: ({ startDate, endDate, employeeId }) => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: `/dashboard/time-analytics/${employeeId}?includeChart=true&startDate=${startDate}&endDate=${endDate}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["employee"],
    }),
    deleteCompany: builder.mutation({
      query: (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("delete company", id);

        return {
          url: `/user/${id}`,
          method: "delete",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["employee"],
    }),
  }),
});

export const {
  useAllEmployeeQuery,
  useCreateEmployeeMutation,
  useCreatePayrollMutation,
  useEmployeeLocationByDateQuery,
  useEmployeeAnalyticsQuery,
  useDeleteCompanyMutation
} = dashboardApi;
