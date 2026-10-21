import { baseApi } from "../baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allProjects: builder.query({
      query: () => {
        const accessToken = sessionStorage.getItem("accessToken");
        return {
          url: "/project",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["project"],
    }),
    createProject: builder.mutation({
      query: (data) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("create project api data", data);

        return {
          url: "/project",
          method: "post",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["project"],
    }),
    assignEmployee: builder.mutation({
      query: ({ id, data }) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("edit project api id", id);
        console.log("edit project api data", data);

        return {
          url: `/project/${id}`,
          method: "patch",
          body: data,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["project"],
    }),
    deleteProject: builder.mutation({
      query: (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Dashboard API Token:", accessToken);

        console.log("delete project api data", id);

        return {
          url: `/project/${id}`,
          method: "delete",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      invalidatesTags: ["project"],
    }),
    getProjectNotes: builder.query({
      query: (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Project ID", id);
        return {
          url: `/note?project=${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      },
      providesTags: ["project"],
    }),
  }),
});

export const {
  useAllProjectsQuery,
  useCreateProjectMutation,
  useAssignEmployeeMutation,
  useDeleteProjectMutation,
  useGetProjectNotesQuery,
} = projectApi;
