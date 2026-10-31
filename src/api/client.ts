/**
 * ScholarBridge Frontend REST API Client
 * Connects React UI state handlers directly to Express backend.
 * Zero UI alterations; strictly communicates with API endpoints.
 */

import {
  Opportunity,
  StudentProfileData,
  ApplicationRecord,
  NotificationItem,
  VerificationStatus,
  ApplicationStatus,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('scholarbridge_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) errorMsg = data.error;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Authentication
  async login(email: string, password: string, role?: 'student' | 'admin') {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await handleResponse<{
      token: string;
      user: { id: string; email: string; role: 'student' | 'admin' };
      profile?: any;
    }>(res);

    localStorage.setItem('scholarbridge_token', data.token);
    return data;
  },

  async register(profileData: StudentProfileData, password = 'Password@123') {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profileData.email,
        password,
        fullName: profileData.fullName,
        institution: profileData.institution,
        educationLevel: profileData.educationLevel,
        fieldOfStudy: profileData.fieldOfStudy,
        currentYear: profileData.currentYear,
      }),
    });
    const data = await handleResponse<{
      token: string;
      user: { id: string; email: string; role: 'student' };
      profile: any;
    }>(res);

    localStorage.setItem('scholarbridge_token', data.token);
    return data;
  },

  async getMe() {
    const token = localStorage.getItem('scholarbridge_token');
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: getAuthHeader(),
      });
      return await handleResponse<{ user: { id: string; email: string; role: 'student' | 'admin' }; profile?: any }>(res);
    } catch {
      localStorage.removeItem('scholarbridge_token');
      return null;
    }
  },

  logout() {
    localStorage.removeItem('scholarbridge_token');
  },

  // Opportunities Catalogue
  async getOpportunities(params?: {
    search?: string;
    category?: string;
    educationLevel?: string;
    location?: string;
    verificationStatus?: string;
    sortBy?: string;
  }): Promise<Opportunity[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.educationLevel) query.set('educationLevel', params.educationLevel);
    if (params?.location) query.set('location', params.location);
    if (params?.verificationStatus) query.set('verificationStatus', params.verificationStatus);
    if (params?.sortBy) query.set('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/api/opportunities?${query.toString()}`);
    return handleResponse<Opportunity[]>(res);
  },

  async getOpportunity(id: string): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/api/opportunities/${id}`);
    return handleResponse<Opportunity>(res);
  },

  // Student Profile & Matching
  async getStudentProfile(): Promise<StudentProfileData> {
    const res = await fetch(`${API_BASE}/api/students/profile`, {
      headers: getAuthHeader(),
    });
    return handleResponse<StudentProfileData>(res);
  },

  async updateStudentProfile(profile: StudentProfileData): Promise<StudentProfileData> {
    const res = await fetch(`${API_BASE}/api/students/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profile),
    });
    return handleResponse<StudentProfileData>(res);
  },

  async getMatches(): Promise<{
    matched: { opportunity: Opportunity; evaluation: any }[];
    possiblyMatched: { opportunity: Opportunity; evaluation: any }[];
    ineligible: { opportunity: Opportunity; evaluation: any }[];
  }> {
    const res = await fetch(`${API_BASE}/api/students/matches`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  // Saved Opportunities
  async getSavedIds(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/api/saved-opportunities`, {
      headers: getAuthHeader(),
    });
    return handleResponse<string[]>(res);
  },

  async toggleSave(opportunityId: string, currentlySaved: boolean): Promise<boolean> {
    const method = currentlySaved ? 'DELETE' : 'POST';
    const res = await fetch(`${API_BASE}/api/saved-opportunities/${opportunityId}`, {
      method,
      headers: getAuthHeader(),
    });
    await handleResponse(res);
    return !currentlySaved;
  },

  // Applications
  async getApplications(): Promise<ApplicationRecord[]> {
    const res = await fetch(`${API_BASE}/api/applications`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ApplicationRecord[]>(res);
  },

  async startOrUpdateApplication(opportunityId: string, status?: ApplicationStatus): Promise<ApplicationRecord> {
    const res = await fetch(`${API_BASE}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ opportunityId, status }),
    });
    return handleResponse<ApplicationRecord>(res);
  },

  async updateApplication(id: string, updates: { status?: ApplicationStatus; notes?: string; nextAction?: string }): Promise<ApplicationRecord> {
    const res = await fetch(`${API_BASE}/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<ApplicationRecord>(res);
  },

  async toggleApplicationDoc(id: string, docName: string): Promise<ApplicationRecord> {
    const res = await fetch(`${API_BASE}/api/applications/${id}/documents`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ docName }),
    });
    return handleResponse<ApplicationRecord>(res);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: getAuthHeader(),
    });
    return handleResponse<NotificationItem[]>(res);
  },

  async markNotificationRead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    await handleResponse(res);
  },

  async markAllNotificationsRead(): Promise<void> {
    const res = await fetch(`${API_BASE}/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    await handleResponse(res);
  },

  // Administrator Controls
  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/admin/analytics`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  async saveOpportunity(opp: Opportunity, isEdit: boolean): Promise<Opportunity> {
    const url = isEdit ? `${API_BASE}/api/admin/opportunities/${opp.id}` : `${API_BASE}/api/admin/opportunities`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(opp),
    });
    return handleResponse<Opportunity>(res);
  },

  async updateVerification(id: string, status: VerificationStatus, auditNotes?: string): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/api/admin/opportunities/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, auditNotes }),
    });
    return handleResponse<Opportunity>(res);
  },

  async toggleArchive(id: string): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/api/admin/opportunities/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return handleResponse<Opportunity>(res);
  },
};
