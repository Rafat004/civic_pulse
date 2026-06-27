export interface Complaint {
  id: number;
  citizen_id: number | null;
  title: string | null;
  description: string;
  category: string;
  severity: number | null;
  urgency: number | null;
  evidence_score: number | null;
  recurrence_count: number;
  status: string;
  score: number | null;
  ai_justification: string | null;
  created_at: string;
  photo_url: string | null;
  lat: number;
  lng: number;
}

export interface ScoreOverride {
  id: number;
  complaint_id: number;
  admin_id: number;
  old_score: number;
  new_score: number;
  reason: string;
  created_at: string;
  admin_name: string;
  complaint_category: string;
}

export interface SystemSettings {
  auto_assign: boolean;
  smart_deduplication: boolean;
  ai_confidence_threshold: number;
  email_alerts: boolean;
  sms_alerts: boolean;
  require_2fa: boolean;
  session_timeout: number;
}

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://stunning-acceptance-production-9c5c.up.railway.app/api/v1";
if (API_BASE_URL.endsWith('/')) API_BASE_URL = API_BASE_URL.slice(0, -1);
if (!API_BASE_URL.endsWith('/api/v1')) API_BASE_URL += '/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const mergedOptions = {
    ...options,
    credentials: "include" as RequestCredentials,
  };

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Don't throw for 401s, just return null so AuthContext can handle it cleanly
      return null;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  
  return response.json();
}
export async function submitComplaint(formData: FormData): Promise<Complaint> {
  const response = await fetch(`${API_BASE_URL}/complaints/`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit complaint");
  }

  return response.json();
}

export async function getComplaints(own: boolean = false): Promise<Complaint[]> {
  const url = `${API_BASE_URL}/complaints/${own ? "?own=true" : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Adding no-store for now to ensure we see fresh data during development
    cache: "no-store", 
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
}

export async function updateComplaintStatus(id: number, status: string): Promise<Complaint> {
  const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update complaint status");
  }

  return response.json();
}

export interface StatsResponse {
  total: number;
  active: number;
  health_score: number;
  critical: number;
  resolved: number;
  pending: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
}

export async function getStats(): Promise<StatsResponse> {
  return fetchApi("/complaints/stats");
}

export async function getOverrides(): Promise<ScoreOverride[]> {
  return fetchApi("/admin/overrides");
}

export async function overrideComplaintScore(complaintId: number, newScore: number, reason: string): Promise<ScoreOverride> {
  return fetchApi(`/complaints/${complaintId}/override`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ new_score: newScore, reason }),
  });
}

export async function getSettings(): Promise<SystemSettings> {
  return fetchApi("/admin/settings");
}

export async function updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  return fetchApi("/admin/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
}

export async function localSignup(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/local/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Signup failed");
  }

  return response.json();
}

export async function localLogin(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/local/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login failed");
  }

  return response.json();
}
