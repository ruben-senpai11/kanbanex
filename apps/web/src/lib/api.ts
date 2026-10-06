const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : '/api/v1';

class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let authToken: string | null = null;
let refreshToken: string | null = null;

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('kanbanex_token');
  refreshToken = localStorage.getItem('kanbanex_refresh_token');
}

export function setTokens(access: string | null, refresh: string | null) {
  authToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    if (access) {
      localStorage.setItem('kanbanex_token', access);
    } else {
      localStorage.removeItem('kanbanex_token');
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

  // Activity & Search
  getProjectActivity: (projectId: string) => apiRequest(`/activity/project/${projectId}`),
  globalSearch: (workspaceId: string, params: any) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/search/workspace/${workspaceId}?${q}`);
  },

  // Billing
  getPlans: () => apiRequest('/billing/plans'),
  getWorkspaceSubscription: (workspaceId: string) => apiRequest(`/billing/workspace/${workspaceId}`),
  createCheckout: (workspaceId: string, dto: any) => apiRequest(`/billing/checkout/workspace/${workspaceId}`, { method: 'POST', body: JSON.stringify(dto) }),
  verifyPayment: (transactionId: string) => apiRequest('/billing/verify', { method: 'POST', body: JSON.stringify({ transactionId }) }),

  // Super Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminUsers: (params?: any) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users?${q}`);
  },
  updateUserRole: (userId: string, role: string) => apiRequest(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  getAdminPlans: () => apiRequest('/admin/plans'),
  updateAdminPlan: (planId: string, dto: any) => apiRequest(`/admin/plans/${planId}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  getAdminTransactions: (params?: any) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/admin/transactions?${q}`);
  },
  getAdminSettings: () => apiRequest('/admin/settings'),
  updateAdminSetting: (dto: any) => apiRequest('/admin/settings', { method: 'POST', body: JSON.stringify(dto) }),
};
