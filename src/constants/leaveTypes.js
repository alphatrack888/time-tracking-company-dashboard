/** API leave type codes (must match time-tracker Leavemanagement.type). */
export const LEAVE_TYPES = ['casual', 'sick', 'earn', 'wp'];

export const LEAVE_TYPE_LABELS = {
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  earn: 'Earn Leave',
  wp: 'Without Pay Leave',
};

/** Dashboard form field on Leavebalance ↔ API type code. */
export const LEAVE_BALANCE_FIELD_TO_API = {
  casualLeave: 'casual',
  sickLeave: 'sick',
  earnLeave: 'earn',
  wpLeave: 'wp',
};

export function leaveTypeLabel(typeCode) {
  if (!typeCode) return '';
  const key = String(typeCode).toLowerCase();
  return LEAVE_TYPE_LABELS[key] ?? typeCode;
}
