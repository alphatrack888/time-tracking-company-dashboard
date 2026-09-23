import { useState } from "react";
import { LinearProgress, TablePagination, IconButton } from "@mui/material";
import { IoSettingsOutline } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../Redux/api/notificationApi";
import NotificationPreferencesModal from "../Modals/NotificationPreferencesModal";

dayjs.extend(relativeTime);

export default function Notifications() {
  const [page, setPage] = useState(0); // MUI TablePagination is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPreferences, setOpenPreferences] = useState(false);

  const { data, isLoading, isError } = useGetNotificationsQuery({
    page: page + 1, // backend pagination is 1-indexed
    limit: rowsPerPage,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const notifications = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? { total: 0 };
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id).unwrap();
    } catch {
      toast.error("Couldn't mark that notification as read. Please try again.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead().unwrap();
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Couldn't mark all notifications as read. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LinearProgress sx={{ width: "300px" }} />
      </div>
    );
  if (isError) return <div className="px-10 py-8">Error fetching notifications...</div>;

  return (
    <div className="px-10 py-8 bg-[#efefef] h-[92vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c] font-medium text-2xl capitalize">notifications</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll || !hasUnread}
            className="text-sm font-medium text-[#3F80AE] disabled:text-[#a0a0a0] disabled:cursor-not-allowed hover:underline"
          >
            Mark all read
          </button>
          <IconButton
            onClick={() => setOpenPreferences(true)}
            sx={{ bgcolor: "#fff", border: "1px solid #e6e6e6" }}
            title="Notification preferences"
          >
            <IoSettingsOutline fontSize={20} />
          </IconButton>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-[#e6e6e6] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-[#1c1c1c] font-medium">No notifications yet</p>
            <p className="text-[#6b7280] text-sm mt-1">
              You&apos;ll see leave requests, overtime alerts, billing issues, and other alerts
              here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start justify-between gap-4 px-6 py-4 border-b border-[#f0f0f0] last:border-b-0 ${
                notification.isRead ? "" : "bg-[#EAF3FA]"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {!notification.isRead && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#3F80AE] shrink-0" />
                )}
                <div className={`min-w-0 ${notification.isRead ? "pl-5" : ""}`}>
                  <p className="font-medium text-[#1c1c1c]">{notification.title}</p>
                  <p className="text-sm text-[#4b5563] mt-0.5 break-words">
                    {notification.body}
                  </p>
                  <p
                    className="text-xs text-[#9ca3af] mt-1"
                    title={dayjs(notification.createdAt).format("YYYY-MM-DD HH:mm")}
                  >
                    {dayjs(notification.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              {!notification.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(notification._id)}
                  className="text-xs font-medium text-[#3F80AE] shrink-0 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}

        {notifications.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={meta.total ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </div>

      <NotificationPreferencesModal
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
      />
    </div>
  );
}
