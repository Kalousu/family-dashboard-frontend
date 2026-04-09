import { fetchApi } from './api';

export interface WidgetPosition {
  col: string;
  row: string;
  colSpan: string;
  rowSpan: string;
}

export interface WidgetConfig {
  title: string;
  color: string;
  settings: Record<string, any>;
}

export interface Widget {
  id: number;
  type: string;
  widgetConfig: WidgetConfig;
  position: WidgetPosition;
  createdAt: string;
  data: any;
}

export interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
}

export interface DashboardResponse {
  id: number;
  familyId: number;
  widgets: Widget[];
  permissions: Permissions;
}

export const dashboardService = {
  async getDashboard(familyId: number): Promise<DashboardResponse> {
    return fetchApi<DashboardResponse>(`/api/families/${familyId}/dashboard`, 'GET');
  },

  async addWidget(familyId: number, widget: { type: string, position: WidgetPosition, config: any }): Promise<Widget> {
    return fetchApi<Widget>(`/api/families/${familyId}/dashboard/widgets`, 'POST', widget);
  },

  async removeWidget(familyId: number, widgetId: number): Promise<void> {
    return fetchApi<void>(`/api/families/${familyId}/dashboard/widgets/${widgetId}`, 'DELETE');
  }
};
