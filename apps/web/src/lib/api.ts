const getApiBase = () => {
  if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
    return `${process.env.INTERNAL_API_URL}/api/v1`;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }
  return '/api/v1';
};

const API_BASE = getApiBase();


class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function toQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '' && val !== 'undefined' && val !== 'null') {
      searchParams.append(key, String(val));
    }
  }
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

let authToken: string | null = null;
let refreshToken: string | null = null;

function getCookieDomainAttr(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host.includes('kanbanex.vercel.app')) {
    return '; domain=.kanbanex.vercel.app';
  }
  if (host.includes('kabanex.vercel.app')) {
    return '; domain=.kabanex.vercel.app';
  }
  return '';
}

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('kanbanex_token');
  refreshToken = localStorage.getItem('kanbanex_refresh_token');
  if (authToken && !document.cookie.includes('kanbanex_token=')) {
    const domainAttr = getCookieDomainAttr();
    document.cookie = `kanbanex_token=${authToken}; path=/${domainAttr}; max-age=604800; SameSite=Lax`;
  }
}

export function setTokens(access: string | null, refresh: string | null) {
  authToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    const domainAttr = getCookieDomainAttr();
    if (access) {
      localStorage.setItem('kanbanex_token', access);
      document.cookie = `kanbanex_token=${access}; path=/${domainAttr}; max-age=604800; SameSite=Lax`;
    } else {
      localStorage.removeItem('kanbanex_token');
      document.cookie = `kanbanex_token=; path=/${domainAttr}; max-age=0; SameSite=Lax`;
      document.cookie = 'kanbanex_token=; path=/; max-age=0; SameSite=Lax';
    }
    if (refresh) {
      localStorage.setItem('kanbanex_refresh_token', refresh);
    } else {
      localStorage.removeItem('kanbanex_refresh_token');
    }
  }
}

export function getAccessToken(): string | null {
  return authToken;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401: Try token refresh
  if (response.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setTokens(refreshData.accessToken, refreshData.refreshToken);
        headers.set('Authorization', `Bearer ${refreshData.accessToken}`);
        response = await fetch(url, {
          ...options,
          headers,
        });
      } else {
        setTokens(null, null);
      }
    } catch {
      setTokens(null, null);
    }
  }

  if (!response.ok) {
    let errorMsg = `Erreur HTTP ${response.status}`;
    let data;
    try {
      data = await response.json();
      errorMsg = data.message || errorMsg;
    } catch {}
    throw new ApiError(errorMsg, response.status, data);
  }

  return response.json();
}

// ==============================================================================
// DOMAIN API METHODS
// ==============================================================================

export const api = {
  // Auth
  signup: (dto: any) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(dto) }),
  verifyEmail: (token: string) => apiRequest('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  resendVerification: (email: string) => apiRequest('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  login: (dto: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  getMe: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  // Workspaces
  getUserWorkspaces: () => apiRequest('/workspaces'),
  getWorkspaceById: (id: string) => apiRequest(`/workspaces/${id}`),
  createWorkspace: (dto: any) => apiRequest('/workspaces', { method: 'POST', body: JSON.stringify(dto) }),
  updateWorkspace: (id: string, dto: any) => apiRequest(`/workspaces/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  inviteMember: (id: string, dto: any) => apiRequest(`/workspaces/${id}/members`, { method: 'POST', body: JSON.stringify(dto) }),

  // Projects Overview & Projects
  getProjectsOverview: (workspaceId: string) => apiRequest(`/projects/overview/workspace/${workspaceId}`),
  getProjectDetails: (id: string) => apiRequest(`/projects/${id}`),
  createProject: (workspaceId: string, dto: any) => apiRequest(`/projects/workspace/${workspaceId}`, { method: 'POST', body: JSON.stringify(dto) }),
  updateProject: (id: string, dto: any) => apiRequest(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  updateTheme: (id: string, dto: any) => apiRequest(`/projects/${id}/theme`, { method: 'PATCH', body: JSON.stringify(dto) }),
  reorderProjects: (workspaceId: string, projectIds: string[]) => apiRequest(`/projects/reorder/workspace/${workspaceId}`, { method: 'POST', body: JSON.stringify({ projectIds }) }),
  deleteProject: (id: string) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),

  // Boards & Lists
  getBoardById: (id: string) => apiRequest(`/boards/${id}`),
  createList: (boardId: string, dto: any) => apiRequest(`/boards/${boardId}/lists`, { method: 'POST', body: JSON.stringify(dto) }),
  updateList: (listId: string, dto: any) => apiRequest(`/boards/lists/${listId}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  reorderLists: (boardId: string, listIds: string[]) => apiRequest(`/boards/${boardId}/lists/reorder`, { method: 'POST', body: JSON.stringify({ listIds }) }),
  deleteList: (listId: string) => apiRequest(`/boards/lists/${listId}`, { method: 'DELETE' }),

  // Tasks
  getTaskDetails: (id: string) => apiRequest(`/tasks/${id}`),
  createTask: (listId: string, dto: any) => apiRequest(`/tasks/list/${listId}`, { method: 'POST', body: JSON.stringify(dto) }),
  updateTask: (id: string, dto: any) => apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  moveTask: (id: string, dto: any) => apiRequest(`/tasks/${id}/move`, { method: 'POST', body: JSON.stringify(dto) }),
  assignUser: (taskId: string, userId: string) => apiRequest(`/tasks/${taskId}/assignees/${userId}`, { method: 'POST' }),
  unassignUser: (taskId: string, userId: string) => apiRequest(`/tasks/${taskId}/assignees/${userId}`, { method: 'DELETE' }),
  deleteTask: (id: string) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),

  // Checklists
  addChecklist: (taskId: string, title: string) => apiRequest(`/tasks/${taskId}/checklists`, { method: 'POST', body: JSON.stringify({ title }) }),
  addChecklistItem: (checklistId: string, content: string) => apiRequest(`/tasks/checklists/${checklistId}/items`, { method: 'POST', body: JSON.stringify({ content }) }),
  toggleChecklistItem: (itemId: string, isCompleted: boolean) => apiRequest(`/tasks/checklists/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ isCompleted }) }),
  deleteChecklist: (checklistId: string) => apiRequest(`/tasks/checklists/${checklistId}`, { method: 'DELETE' }),

  // Labels
  getWorkspaceLabels: (workspaceId: string) => apiRequest(`/labels/workspace/${workspaceId}`),
  createLabel: (workspaceId: string, dto: any) => apiRequest(`/labels/workspace/${workspaceId}`, { method: 'POST', body: JSON.stringify(dto) }),
  attachLabel: (taskId: string, labelId: string) => apiRequest(`/tasks/${taskId}`, { method: 'PATCH' }), // or via task endpoint

  // Gantt
  getGanttData: (projectId: string) => apiRequest(`/gantt/project/${projectId}`),
  updateGanttDates: (taskId: string, dto: any) => apiRequest(`/gantt/tasks/${taskId}/dates`, { method: 'PATCH', body: JSON.stringify(dto) }),

  // Calendar
  getCalendarTasks: (projectId: string, start?: string, end?: string) => {
    const q = new URLSearchParams();
    if (start) q.set('start', start);
    if (end) q.set('end', end);
    return apiRequest(`/calendar/project/${projectId}?${q.toString()}`);
  },

  // Comments
  getComments: (taskId: string) => apiRequest(`/comments/task/${taskId}`),
  addComment: (taskId: string, content: string) => apiRequest(`/comments/task/${taskId}`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationAsRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsAsRead: () => apiRequest('/notifications/read-all', { method: 'PATCH' }),

  // Activity & Search
  getProjectActivity: (projectId: string) => apiRequest(`/activity/project/${projectId}`),
  globalSearch: (workspaceId: string, params: any) => {
    return apiRequest(`/search/workspace/${workspaceId}${toQueryString(params)}`);
  },

  // Billing
  getPlans: () => apiRequest('/billing/plans'),
  getWorkspaceSubscription: (workspaceId: string) => apiRequest(`/billing/workspace/${workspaceId}`),
  createCheckout: (workspaceId: string, dto: any) => apiRequest(`/billing/checkout/workspace/${workspaceId}`, { method: 'POST', body: JSON.stringify(dto) }),
  verifyPayment: (transactionId: string) => apiRequest('/billing/verify', { method: 'POST', body: JSON.stringify({ transactionId }) }),

  // Super Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminUsers: (params?: any) => {
    return apiRequest(`/admin/users${toQueryString(params)}`);
  },
  updateUserRole: (userId: string, role: string) => apiRequest(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  getAdminPlans: () => apiRequest('/admin/plans'),
  updateAdminPlan: (planId: string, dto: any) => apiRequest(`/admin/plans/${planId}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  getAdminTransactions: (params?: any) => {
    return apiRequest(`/admin/transactions${toQueryString(params)}`);
  },
  getAdminSettings: () => apiRequest('/admin/settings'),
  updateAdminSetting: (dto: any) => apiRequest('/admin/settings', { method: 'POST', body: JSON.stringify(dto) }),
};
