// Centralized fallback path variants for admin notification endpoints
// Each entry returns ordered variants to probe until a non-404 (or last response) is obtained.

export const NOTIFICATION_FALLBACKS = {
  send: [
    "/api/proxy/wallet/admin/notifications/send",
    "/api/proxy/wallet/admin/notification/send",
  ],
  failedDeliveries: (page: number, perPage: number, filters: { event_type?: string; channel?: string } = {}) => {
    const baseQuery = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (filters.event_type) baseQuery.set("event_type", filters.event_type);
    if (filters.channel) baseQuery.set("channel", filters.channel);
    const qs = baseQuery.toString();
    return [
      `/api/proxy/wallet/admin/notifications/failed-deliveries?${qs}`,
      `/api/proxy/wallet/admin/notification/failed-deliveries?${qs}`,
      `/api/proxy/wallet/admin/notifications/failed?${qs}`,
    ];
  },
  failedDeliveryRetry: (id: string) => [
    `/api/proxy/wallet/admin/notifications/failed-deliveries/${id}/retry`,
    `/api/proxy/wallet/admin/notifications/failed/${id}/retry`,
    `/api/proxy/wallet/admin/notification/failed-deliveries/${id}/retry`,
    // Alternative naming
    `/api/proxy/wallet/admin/notifications/failed-deliveries/${id}/requeue`,
  ],
  templatesList: [
    "/api/proxy/wallet/admin/notifications/templates",
    "/api/proxy/wallet/admin/notification/templates",
  ],
  templatesCreate: [
    "/api/proxy/wallet/admin/notifications/templates",
    "/api/proxy/wallet/admin/notification/templates",
  ],
  templateUpdate: (id: string) => [
    `/api/proxy/wallet/admin/notifications/templates/${id}`,
    `/api/proxy/wallet/admin/notification/templates/${id}`,
  ],
};

export type NotificationFilters = { event_type?: string; channel?: string };
