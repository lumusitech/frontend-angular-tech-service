// @ts-nocheck
export interface UserPreferences {
  theme: string;
  language: string;
  dashboardLayout?: string[];
  dashboardWidgets?: Record<string, boolean>;
}
export interface UpdateUserPreferencesDto {
  theme?: string;
  language?: string;
  preferences?: Record<string, unknown>;
}
export interface LoginPreferencesResponse {
  theme: string;
  language: string;
  dashboardLayout?: string[];
  dashboardWidgets?: Record<string, boolean>;
}