import { useEffect, useState } from "react";
import {
  Modal,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../Redux/api/notificationApi";

const CATEGORY_LABELS = {
  leave: "Leave requests",
  project: "Project assignments",
  payroll: "Payroll",
  overtime: "Overtime alerts",
  attendance: "Attendance reminders",
  subscription: "Subscription & billing",
};

const DEFAULT_PREFERENCES = {
  pushEnabled: true,
  categories: {
    leave: true,
    project: true,
    payroll: true,
    overtime: true,
    attendance: true,
    subscription: true,
  },
  digestMode: "realtime",
  language: "en",
};

export default function NotificationPreferencesModal({ open, onClose }) {
  const { data, isFetching } = useGetNotificationPreferencesQuery(undefined, {
    skip: !open,
  });
  const [updatePreferences, { isLoading: isSaving }] =
    useUpdateNotificationPreferencesMutation();

  const [form, setForm] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (data?.data) {
      setForm({
        pushEnabled: data.data.pushEnabled,
        categories: data.data.categories,
        digestMode: data.data.digestMode,
        language: data.data.language,
      });
    }
  }, [data]);

  const handleToggleCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category],
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences(form).unwrap();
      toast.success("Notification preferences saved.");
      onClose();
    } catch {
      toast.error("Couldn't save your preferences. Please try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="bg-white p-5 rounded-lg shadow-lg w-[440px] max-h-[85vh] overflow-y-auto">
        <p className="font-medium text-lg text-[#1c1c1c] mb-4">
          Notification preferences
        </p>

        {isFetching ? (
          <div className="flex justify-center py-10">
            <CircularProgress size={28} />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-[#1c1c1c]">Push notifications</p>
                <p className="text-xs text-[#6b7280]">
                  Turn off to stop receiving push alerts entirely. You&apos;ll still see
                  everything in your notification list.
                </p>
              </div>
              <Switch
                checked={form.pushEnabled}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, pushEnabled: e.target.checked }))
                }
              />
            </div>

            <div>
              <p className="font-medium text-sm text-[#1c1c1c] mb-2">Categories</p>
              <div className="flex flex-col gap-2">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-sm text-[#374151]">{label}</p>
                    <Switch
                      checked={Boolean(form.categories?.[key])}
                      onChange={() => handleToggleCategory(key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <FormControl size="small" fullWidth>
              <InputLabel>Delivery</InputLabel>
              <Select
                label="Delivery"
                value={form.digestMode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, digestMode: e.target.value }))
                }
              >
                <MenuItem value="realtime">Real-time — push each notification as it happens</MenuItem>
                <MenuItem value="daily">Daily digest — one summary push per day</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                label="Language"
                value={form.language}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, language: e.target.value }))
                }
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                onClick={onClose}
                sx={{ color: "#1c1c1c", textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                  bgcolor: "#3F80AE",
                  color: "#fff",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { bgcolor: "#70a4c7" },
                  "&.Mui-disabled": { bgcolor: "#a0c3d9", color: "#fff" },
                }}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
