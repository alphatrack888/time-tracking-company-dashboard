# Phase 9 notes — Company dashboard: notification center

Companion to [`../Notification_Reports_Integration_Plan.md`](../Notification_Reports_Integration_Plan.md) Phase 9. Mirrors Phase 7 (admin dashboard) for `time-tracking-company-dashboard` — same backend endpoints, same shape, adapted to this app's own conventions.

## What was built

- **`src/Redux/api/notificationApi.js`** (new) — same five endpoints as Phase 7's admin-dashboard slice (`getNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `getNotificationPreferences`, `updateNotificationPreferences`), but adapted to this app's own `axiosBaseQuery` (`utils/axiosBaseQuery.js`), which — unlike the admin dashboard's — has **no `params` support**. Query strings are built directly into the `url` template string instead (`/notifications?page=${page}&limit=${limit}`), matching the existing convention already used in this app's `dashboardApi.js`/`employeeApi.js`.
- **`notification`/`notificationPreferences` tags** added to `baseApi.js`.
- **`NotificationBell.jsx`** (new, `src/components/Shared/`) — replaces the dead, commented-out bell in `Header.jsx` (which also had an unused `Link` import removed along with it). Same design as Phase 7: badge capped at "9+", `Popover` dropdown of the most recent 20, unread highlighting, 2-line truncation, relative timestamps, "Mark all read", "View all", 45s polling.
- **`Notifications.jsx`** (new, `src/components/Dashboard/`) — same full history page as Phase 7: server-side pagination, untruncated body text, per-item "Mark as read" only on unread items, settings gear opens the preferences modal.
- **`NotificationPreferencesModal.jsx`** (new, `src/components/Modals/` — this app's existing modals live directly under `Modals/`, not `UI/Modals/` like the admin dashboard, so it was placed there to match) — identical fields to Phase 7 (push toggle, 6 category switches, digest mode, language).
- **Sidebar nav entry** added ("Notifications", bell icon, after "Employee Leave List"). Unlike the admin dashboard, this app's `Sidebar.jsx` had no dead/commented notifications entry to begin with — the plan's description of "dead bell/route scaffolding to remove" only actually applied to `Header.jsx` here, not `Sidebar.jsx` or `Routes.jsx` (both had no notifications trace at all before this phase).

## A plan/reality mismatch found and resolved without a backend change

Phase 9's exit criteria ask to verify "a leave request notification, **a project assignment notification**, and a subscription/billing alert... all appear correctly for a company admin." I checked where each of these actually gets sent (`to:` field) before writing verification data, rather than assuming the plan's wording was accurate:

- `leaveRequestSubmitted` → `to: payload.company` (`leavemanagement.service.ts:50`) — genuinely company-targeted. ✓.
- `subscriptionPaymentFailure` / `subscriptionTrialEnding` → `to: companyAdmin._id` (`subscription/monitoring.service.ts:74,114`) — genuinely company-targeted. ✓.
- `projectEmployeeAdded` (the "project assignment" notification) → `to: employeeId` (`project.service.ts:234`) — this is **employee**-targeted, not company-targeted. No such thing as a company-facing "project assignment" notification exists in the current backend; the template text itself ("You've been added to...") is written in the second person for the employee, confirming this isn't a labeling accident.

This is a drafting inconsistency inside the plan itself: its own Tasks paragraph for this phase says company admins receive "leave requests, project assignments, subscription/billing issues, overtime alerts for their employees" — but only leave/subscription/overtime triggers actually target the company in the backend. I substituted the exit criteria's "project assignment" check with `overtimeCompanyAlert` (`to: companyId`, `timetracker.triggers.ts:124`), which the plan's own Tasks paragraph already names as a real company-targeted trigger. No backend or frontend code needed to change for this — it's a verification-scope correction, not a capability gap like Phase 8's was.

## Verification

No real backend was reachable in this environment (same gap as every earlier phase). Verified with the same headless-Chromium/mocked-response methodology as Phase 7, using the three real company-targeted kinds above (rendered with their actual template text, not placeholder copy) instead of `projectEmployeeAdded`:
- Badge renders "2" for two unread mocked notifications (leave request + overtime alert), correctly drops to "1" after marking the leave request read — no reload, no optimistic client-only assumption (same tag-invalidation design as Phase 7).
- Dropdown shows all three with correct unread styling/dot, relative timestamps ("6 minutes ago", "an hour ago", "a day ago").
- Full notifications page: complete untruncated text for all three, correct `meta.total`-driven pagination ("1–3 of 3"), "Mark as read" present only on the still-unread item.
- Preferences modal: hydrates every field from a realistic fetched payload, including a category explicitly mocked `false` (`payroll`) rendering as the off toggle.
- Header's own profile fetch (`GET /user/profile`, pre-existing, unrelated to this phase) was also mocked so the header itself would render — without it the whole header blocks on `isLoading`/`isError` before reaching the bell, which would have made verification impossible, not because of anything this phase changed.
- Console errors present were only the three pre-existing, unmocked dashboard-stats calls (`company-general-stats`, `total-employees-yearly` ×2) that this phase's code never touches — confirmed via request-URL logging, not assumed.

No pre-existing bugs found blocking this phase (unlike Phase 7's `Sidebar.jsx` logout bug) — this app's `handleLogout` and `ProtectedRoute.jsx` already consistently use `sessionStorage`.

`npm run lint`: 0 new errors — the 3 errors reported are pre-existing in `Subscription.jsx`, a file this phase never touched (confirmed via `git log`/`git diff` against the file). `npm run build` clean, `Notifications` chunk built at 17.34 kB.

## An unrelated, unexpected event during this phase (for the record)

While finishing this phase, a git commit (`f464ee2`, "Add notification preferences feature") appeared on `main` and was already synced with `origin/main` — created and pushed by something other than an explicit command in this session (no `git commit`/`git push` was run here). It bundled this phase's files together with unrelated, already-in-progress local changes (an image-URL-handling refactor across `Profile.jsx`/`RunningProjects.jsx`/`EmployeeDetailsModal.jsx`/`baseUrl.js`, plus a new `RouteError.jsx`) that this phase did not author. Flagged to the user directly; confirmed as expected (an auto-commit mechanism they're aware of), so left as-is — noted here only so this phase's own diff isn't confused with that other work when reading history.

## Not done in this phase

Web push remains out of scope, same decision and same reasoning as Phase 7 (no websocket infrastructure in this app either; polling is the pragmatic choice until that changes).
