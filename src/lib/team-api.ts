import { apiClient } from './api-client'

export interface TeamResponse {
  id: string
  name: string
  ownerId: string
  maxUsers: number
  createdAt: string
}

export interface TeamMemberResponse {
  id: string
  teamId: string
  userId: string
  role: string
  createdAt: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

export interface WorkspaceResponse {
  id: string
  teamId: string
  name: string
  createdAt: string
}

export interface CreateTeamRequest {
  name: string
}

export interface InviteMemberRequest {
  email: string
  role: string
}

export interface CreateWorkspaceRequest {
  name: string
}

export const teamApi = {
  createTeam: (data: CreateTeamRequest) =>
    apiClient.post<TeamResponse>('/api/teams', data),
  
  getTeams: () =>
    apiClient.get<TeamResponse[]>('/api/teams'),
  
  getTeam: (teamId: string) =>
    apiClient.get<TeamResponse>(`/api/teams/${teamId}`),
  
  updateTeam: (teamId: string, data: Partial<CreateTeamRequest>) =>
    apiClient.put<TeamResponse>(`/api/teams/${teamId}`, data),
  
  deleteTeam: (teamId: string) =>
    apiClient.delete(`/api/teams/${teamId}`),
  
  inviteMember: (teamId: string, data: InviteMemberRequest) =>
    apiClient.post<TeamMemberResponse>(`/api/teams/${teamId}/invite`, data),
  
  removeMember: (teamId: string, userId: string) =>
    apiClient.delete(`/api/teams/${teamId}/members/${userId}`),
  
  getTeamMembers: (teamId: string) =>
    apiClient.get<TeamMemberResponse[]>(`/api/teams/${teamId}/members`),
  
  updateMemberRole: (teamId: string, userId: string, role: string) =>
    apiClient.put<TeamMemberResponse>(`/api/teams/${teamId}/members/${userId}`, { role }),
  
  createWorkspace: (teamId: string, data: CreateWorkspaceRequest) =>
    apiClient.post<WorkspaceResponse>(`/api/teams/${teamId}/workspaces`, data),
  
  getWorkspaces: (teamId: string) =>
    apiClient.get<WorkspaceResponse[]>(`/api/teams/${teamId}/workspaces`),
  
  deleteWorkspace: (teamId: string, workspaceId: string) =>
    apiClient.delete(`/api/teams/${teamId}/workspaces/${workspaceId}`)
}

export default teamApi
