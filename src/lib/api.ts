// src/lib/api.ts
import { USER_ROLES } from "@/lib/constants";

/* ---------------- TYPES ---------------- */

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: any;
};

type ApiFail = {
  success: false;
  message: string;
  errors?: any;
};

type ApiResponse<T> = ApiSuccess<T> | ApiFail;

/* ---------------- CONFIG ---------------- */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

/** backend: user/vendor/admin | frontend: customer/vendor/admin */
function mapBackendRoleToFrontend(role: string) {
  if (role === "user") return USER_ROLES.CUSTOMER;
  return role;
}
function mapFrontendRoleToBackend(role?: string) {
  if (!role) return undefined;
  if (role === USER_ROLES.CUSTOMER) return "user";
  return role;
}

/** backend: confirmed | frontend: accepted */
function mapBackendStatusToFrontend(status: string) {
  if (status === "confirmed") return "accepted";
  return status;
}
function mapFrontendStatusToBackend(status: string) {
  if (status === "accepted") return "confirmed";
  return status;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<ApiSuccess<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    const msg = json?.message || "Request failed";
    throw new Error(msg);
  }

  return json as ApiSuccess<T>;
}

/* ---------------- AUTH ---------------- */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "vendor" | "customer";
  status: "active" | "blocked";
  createdAt: string;
  businessName?: string;
  address?: string;
};

export async function apiLogin(email: string, password: string, role?: string) {
  const backendRole = mapFrontendRoleToBackend(role);

  const res = await request<{
    token: string;
    user: any;
    vendor?: any;
  }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password, role: backendRole }),
    },
    false
  );

  const token = res.data.token;
  const rawUser = res.data.user;

  const user: AuthUser = {
    ...rawUser,
    role: mapBackendRoleToFrontend(rawUser.role),
  };

  return { token, user };
}

export async function apiRegisterUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const res = await request<{ token: string; user: any }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );

  const token = res.data.token;
  const rawUser = res.data.user;

  const user: AuthUser = {
    ...rawUser,
    role: mapBackendRoleToFrontend(rawUser.role),
  };

  return { token, user };
}

export async function apiRegisterVendor(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName?: string;
  address?: string;
  categories?: string[];
}) {
  const res = await request<{ token: string; user: any; vendor: any }>(
    "/auth/vendor/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );

  const token = res.data.token;
  const rawUser = res.data.user;

  const user: AuthUser = {
    ...rawUser,
    role: mapBackendRoleToFrontend(rawUser.role),
  };

  return { token, user };
}

export async function apiMe() {
  const res = await request<{ user: any }>("/auth/me", { method: "GET" }, true);
  const rawUser = res.data.user;

  const user: AuthUser = {
    ...rawUser,
    role: mapBackendRoleToFrontend(rawUser.role),
  };

  return user;
}

/* ---------------- SERVICES ---------------- */

export type ServiceDoc = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  subcategory: string;
  price: number;
  durationMinutes?: number;
  isActive: boolean;

  // ✅ vendor fields needed for customer vendor cards (rating compare)
  vendor?: {
    _id: string;
    businessName?: string;
    rating?: number;
    totalJobs?: number;
    isVerified?: boolean;
  };

  createdAt: string;
};

export async function apiListServices(params?: {
  q?: string;
  category?: string;
  subcategory?: string;
  vendorId?: string;
  page?: number;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set("q", params.q);
  if (params?.category) sp.set("category", params.category);
  if (params?.subcategory) sp.set("subcategory", params.subcategory);
  if (params?.vendorId) sp.set("vendorId", params.vendorId);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));

  const res = await request<{
    items: ServiceDoc[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/services?${sp.toString()}`, { method: "GET" }, false);

  return res.data;
}

export async function apiGetService(id: string) {
  const res = await request<{ service: ServiceDoc }>(
    `/services/${id}`,
    { method: "GET" },
    false
  );
  return res.data.service;
}

/* ---------------- BOOKINGS ---------------- */

export type Booking = {
  _id: string;
  status: string;
  scheduledAt: string;
  address: string;
  notes?: string;
  totalPrice: number;
  service?: any;
  user?: any;
  vendor?: any;
  timeline?: { type: string; message: string; byRole: string; at: string }[];
};

export async function apiCreateBooking(payload: {
  serviceId: string;
  scheduledAt: string;
  address: string;
  notes?: string;
}) {
  const res = await request<{ booking: Booking }>(
    "/bookings",
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  return res.data.booking;
}

export async function apiCustomerBookings() {
  const res = await request<{ items: Booking[] }>(
    "/bookings/my",
    { method: "GET" },
    true
  );
  return res.data.items.map((b) => ({
    ...b,
    status: mapBackendStatusToFrontend(b.status),
  }));
}

export async function apiVendorBookings() {
  const res = await request<{ items: Booking[] }>(
    "/vendor/bookings",
    { method: "GET" },
    true
  );
  return res.data.items.map((b) => ({
    ...b,
    status: mapBackendStatusToFrontend(b.status),
  }));
}

export async function apiVendorUpdateBookingStatus(
  bookingId: string,
  status: string
) {
  const backendStatus = mapFrontendStatusToBackend(status);

  const res = await request<{ booking: Booking }>(
    `/vendor/bookings/${bookingId}/status`,
    { method: "PATCH", body: JSON.stringify({ status: backendStatus }) },
    true
  );

  return {
    ...res.data.booking,
    status: mapBackendStatusToFrontend(res.data.booking.status),
  };
}

/* ---------------- VENDOR SERVICES ---------------- */

export async function apiVendorMyServices() {
  const res = await request<{ items: ServiceDoc[] }>(
    `/vendor/services`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

export async function apiVendorCreateService(payload: Partial<ServiceDoc>) {
  const res = await request<{ service: ServiceDoc }>(
    `/vendor/services`,
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  return res.data.service;
}

export async function apiVendorUpdateService(
  id: string,
  payload: Partial<ServiceDoc>
) {
  const res = await request<{ service: ServiceDoc }>(
    `/vendor/services/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    true
  );
  return res.data.service;
}

export async function apiVendorDeleteService(id: string) {
  const res = await request<{ serviceId: string }>(
    `/vendor/services/${id}`,
    { method: "DELETE" },
    true
  );
  return res.data.serviceId;
}

/* ---------------- ADMIN ---------------- */

export type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "vendor" | "admin";
  status: "active" | "blocked";
  createdAt: string;
  address?: string;
  businessName?: string;
};

export async function apiAdminUsers(params?: {
  role?: string;
  status?: string;
  q?: string;
}) {
  const sp = new URLSearchParams();
  if (params?.role) sp.set("role", params.role);
  if (params?.status) sp.set("status", params.status);
  if (params?.q) sp.set("q", params.q);

  const res = await request<{ items: AdminUserRow[] }>(
    `/admin/users?${sp.toString()}`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

export async function apiAdminBlockUser(id: string) {
  await request(`/admin/users/${id}/block`, { method: "PATCH" }, true);
}

export async function apiAdminUnblockUser(id: string) {
  await request(`/admin/users/${id}/unblock`, { method: "PATCH" }, true);
}

export type AdminVendorRow = {
  _id: string;
  user: any;
  businessName: string;
  address?: string;
  categories?: string[];
  isVerified: boolean;
  rating?: number;
  totalJobs?: number;
  createdAt: string;
};

export async function apiAdminVendors() {
  const res = await request<{ items: AdminVendorRow[] }>(
    `/admin/vendors`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

export async function apiAdminVerifyVendor(id: string) {
  await request(`/admin/vendors/${id}/verify`, { method: "PATCH" }, true);
}
export async function apiAdminUnverifyVendor(id: string) {
  await request(`/admin/vendors/${id}/unverify`, { method: "PATCH" }, true);
}

export async function apiAdminServices() {
  const res = await request<{ items: ServiceDoc[] }>(
    `/admin/services`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

export async function apiAdminToggleService(id: string) {
  await request(`/admin/services/${id}/toggle`, { method: "PATCH" }, true);
}

export async function apiAdminBookings(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));

  const res = await request<{
    items: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/admin/bookings?${sp.toString()}`, { method: "GET" }, true);

  return {
    ...res.data,
    items: res.data.items.map((b) => ({
      ...b,
      status: mapBackendStatusToFrontend(b.status),
    })),
  };
}

export async function apiAdminUpdateBookingStatus(
  bookingId: string,
  status: string
) {
  const backendStatus = mapFrontendStatusToBackend(status);
  const res = await request<{ booking: Booking }>(
    `/admin/bookings/${bookingId}/status`,
    { method: "PATCH", body: JSON.stringify({ status: backendStatus }) },
    true
  );
  return {
    ...res.data.booking,
    status: mapBackendStatusToFrontend(res.data.booking.status),
  };
}

/* ---------------- CATEGORIES (READ ONLY) ---------------- */

export async function apiCategories() {
  const res = await request<{ categories: any[] }>(
    `/meta/categories`,
    { method: "GET" },
    false
  );
  return res.data.categories;
}

/* ---------------- CHAT ---------------- */

export type ChatThread = {
  _id: string;
  booking: string;
  user: string;
  vendor: string;
  lastMessageAt: string;
};

export type ChatMessage = {
  _id: string;
  thread: string;
  senderRole: "user" | "vendor" | "admin" | "ai" | "system";
  text: string;
  createdAt: string;
};

export async function apiGetOrCreateThread(bookingId: string) {
  const res = await request<{ thread: ChatThread }>(
    `/chat/booking/${bookingId}/thread`,
    { method: "GET" },
    true
  );
  return res.data.thread;
}

export async function apiListMessages(threadId: string) {
  const res = await request<{ items: ChatMessage[] }>(
    `/chat/threads/${threadId}/messages`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

export async function apiSendMessage(threadId: string, text: string) {
  const res = await request<{ message: ChatMessage }>(
    `/chat/threads/${threadId}/messages`,
    { method: "POST", body: JSON.stringify({ text }) },
    true
  );
  return res.data.message;
}

export async function apiAIReply(threadId: string, text: string) {
  const res = await request<{ message: ChatMessage }>(
    `/chat/threads/${threadId}/ai`,
    { method: "POST", body: JSON.stringify({ text }) },
    true
  );
  return res.data.message;
}

/* ---------------- VENDOR CHAT THREADS (NEW) ---------------- */

export async function apiVendorChatThreads() {
  const res = await request<{ items: ChatThread[] }>(
    `/chat/vendor/threads`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

/* ---------------- SETTINGS (NEW) ---------------- */

export type AppSettings = {
  notifications?: boolean;
  appearance?: "light" | "dark";
  general?: string;

  // vendor extras (if your backend stores it here)
  businessName?: string;
  phone?: string;
  address?: string;
  categories?: string[];
};

export async function apiGetSettings(role: "admin" | "vendor") {
  const res = await request<{ settings: AppSettings }>(
    `/settings/${role}`,
    { method: "GET" },
    true
  );

  // return real DB values (no forced defaults)
  return res.data.settings || {};
}

export async function apiUpdateSettings(
  role: "admin" | "vendor",
  payload: AppSettings
) {
  const res = await request<{ settings: AppSettings }>(
    `/settings/${role}`,
    { method: "PUT", body: JSON.stringify(payload) },
    true
  );
  return res.data.settings;
}

/* ---------------- REVIEWS (NEW) ---------------- */

export type ReviewDoc = {
  _id: string;
  booking: string;
  vendor: string;
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;

  // optional populated fields
  service?: { _id: string; name?: string };
  userObj?: { _id: string; name?: string };
};

export async function apiCreateReview(payload: {
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const res = await request<{ review: ReviewDoc }>(
    `/reviews`,
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  return res.data.review;
}

/**
 * ✅ Vendor reviews list
 * Backend route you shared: GET /api/reviews/vendor
 */
export async function apiVendorReviews() {
  const res = await request<{ items: ReviewDoc[] }>(
    `/reviews/vendor`,
    { method: "GET" },
    true
  );
  return res.data.items;
}

/* ---------------- CHAT HELPERS (SAFE) ---------------- */

/**
 * Optional helper: avoids UI crash if thread doesn't exist yet.
 * Your /chat/booking/:bookingId/thread endpoint should create if missing.
 */
export async function apiSafeThread(bookingId: string) {
  return await apiGetOrCreateThread(bookingId);
}

/* ---------------- END ---------------- */
