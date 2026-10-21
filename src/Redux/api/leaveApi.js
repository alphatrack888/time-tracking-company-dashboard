import { baseApi } from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveRequests: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/leavemanagement",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["leave"],
    }),
    getLeaveBalance: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/leavebalance",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["leave"],
    }),

    manageLeave: builder.mutation({
      query: (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("manage leave api data", data);

        return {
          url: "/leavebalance",
          method: "post",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["leave"],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ status, id }) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("update leave api status", status);

        return {
          url: `/leavemanagement/${id}`,
          method: "patch",
          body: { status: status },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["leave"],
    }),
    deleteLeaveRequest: builder.mutation({
      query: (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("delete leave api id", id);

        return {
          url: `/leavemanagement/${id}`,
          method: "delete",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["leave"],
    }),
  }),
});

export const {
  useGetLeaveRequestsQuery,
  useGetLeaveBalanceQuery,
  useManageLeaveMutation,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveRequestMutation,
} = dashboardApi;
