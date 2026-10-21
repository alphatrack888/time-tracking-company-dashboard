import { baseApi } from "../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/user/profile",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["user"],
    }),
    editProfile: builder.mutation({
      query: (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("Edit Profile api data", data);

        return {
          url: "/user/profile",
          method: "patch",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useUserProfileQuery, useEditProfileMutation } = projectApi;
