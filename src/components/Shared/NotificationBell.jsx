import { useState } from "react";
import { Badge, IconButton, Popover, Button, CircularProgress } from "@mui/material";
import { PiBellSimpleRingingBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../Redux/api/notificationApi";

dayjs.extend(relativeTime);

const DROPDOWN_LIMIT = 20;
const POLL_INTERVAL_MS = 45_000;

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const { data } = useGetNotificationsQuery(
    { page: 1, limit: DROPDOWN_LIMIT },
    { pollingInterval: POLL_INTERVAL_MS }
  );
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const notifications = data?.data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const open = Boolean(anchorEl);

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

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="bg-[#f0f0f0] hover:bg-[#E0E1E2] transition-colors duration-300"
      >
        <Badge badgeContent={unreadCount > 9 ? "9+" : unreadCount} color="error">
          <PiBellSimpleRingingBold fontSize={24} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="w-[360px] max-h-[420px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
            <p className="font-medium text-[#1c1c1c]">Notifications</p>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll || unreadCount === 0}
              className="text-xs font-medium text-[#3F80AE] disabled:text-[#a0a0a0] disabled:cursor-not-allowed hover:underline"
            >
              {isMarkingAll ? <CircularProgress size={12} /> : "Mark all read"}
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <p className="text-sm text-[#6b7280]">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  type="button"
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`w-full text-left flex items-start gap-2 px-4 py-3 border-b border-[#f7f7f7] last:border-b-0 ${
                    n.isRead ? "" : "bg-[#EAF3FA]"
                  }`}
                >
                  {!n.isRead && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#3F80AE] shrink-0" />
                  )}
                  <div className={`min-w-0 ${n.isRead ? "pl-4" : ""}`}>
                    <p className="text-sm font-medium text-[#1c1c1c] truncate">{n.title}</p>
                    <p className="text-xs text-[#4b5563] mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-[#9ca3af] mt-1">
                      {dayjs(n.createdAt).fromNow()}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-[#f0f0f0] px-4 py-2">
            <Button
              fullWidth
              size="small"
              onClick={() => {
                setAnchorEl(null);
                navigate("/notifications");
              }}
              sx={{ textTransform: "none", color: "#3F80AE" }}
            >
              View all
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
}
