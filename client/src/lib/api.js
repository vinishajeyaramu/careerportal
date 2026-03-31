const jobUrl = import.meta.env.VITE_JOB_URL || "";

export const serverBaseUrl = jobUrl.replace(/\/api\/v1\/jobpost\/?$/, "");
export const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL || "http://localhost:5174";

export const authStorageKey = "career_portal_user_auth";

export const getAuthHeaders = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
