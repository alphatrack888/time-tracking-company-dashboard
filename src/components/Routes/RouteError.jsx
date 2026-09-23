import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@mui/material";

export default function RouteError() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message || "Unknown error";

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
      <h1 className="text-xl font-semibold">Something went wrong loading this page</h1>
      <p className="text-sm text-gray-500 max-w-md">
        This can happen if a browser extension (ad-blocker/privacy filter) blocked one of the
        page's files, or a network request failed. {message}
      </p>
      <Button variant="contained" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
}
