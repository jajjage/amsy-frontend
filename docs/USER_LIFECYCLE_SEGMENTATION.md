# User lifecycle segmentation (AMSY admin)

## Status

Lifecycle segment tabs and row badges are now implemented in the AMSY admin users list and use the shared backend filter/count contract. Transition history and export are not part of this increment. Coordinate remaining work with [`../../nexus-data-multi-tenant/docs/USER_LIFECYCLE_SEGMENTATION.md`](../../nexus-data-multi-tenant/docs/USER_LIFECYCLE_SEGMENTATION.md) and the parent tracking doc [`../../.scratch/user-lifecycle-segmentation/README.md`](../../.scratch/user-lifecycle-segmentation/README.md).

## Users-page behavior

The existing admin users list now has selectable tabs for All Customers, Never Activated, Active, At Risk, Churned, and Dormant, with server-provided counts. Each customer row shows a segment badge, last activity, and inactive duration. Never-activated users show an explicit no-qualifying-activity explanation rather than a blank date.

The users list requests 25 users per page by default, with the existing previous/next pagination. Lifecycle counts describe the full tenant-scoped segment, not just the current page.

Expose lifecycle transition history with access to all transitions returned within the backend's 24-month retention window. Do not silently truncate history to a small fixed number of entries. Ensure row density remains usable on narrow viewports and that missing optional dates/history render safely.

CSV export should preserve the current lifecycle filter and use the backend export contract; do not reconstruct or recalculate lifecycle state in the browser. Keep URL/query state consistent with the existing user filters so links and pagination preserve the selected segment.

## Data contract expectations

The backend is authoritative for `lifecycleSegment`, `activatedAt`, `lastMeaningfulActivityAt`, `daysInactive`, `lastReactivatedAt`, `lifecycleHistory`, lifecycle counts, and the display timezone. Timestamps represent UTC instants; format them using the server-provided timezone (default `Africa/Lagos`). The frontend should not decide whether a user is at risk/churned/dormant based on local date arithmetic.

No contact, campaign, or send-message action is included in v1. A future feedback outreach UI must wait for backend consent/channel preference, suppression, caps, and outreach-history safeguards.

## AMSY code discovery points

- Users table: `src/components/features/admin/users/UserListTable.tsx`.
- Admin users API client: `src/services/admin/user.service.ts`.
- Existing admin usage guide: `docs/ADMIN_GUIDE.md`.

The implementation should also update the relevant frontend response types and fixtures, and verify empty/error/loading states along with type checking and the appropriate UI checks.
