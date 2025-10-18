"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Plus, 
  Mail, 
  Crown, 
  User, 
  Trash2,
  Loader2,
  Building2 
} from 'lucide-react'
import { toast } from 'sonner'
import { teamApi, TeamResponse, TeamMemberResponse, WorkspaceResponse } from '@/lib/team-api'
import { useUser } from '@clerk/nextjs'

export default function TeamPage() {
  const { user } = useUser()
  const [teams, setTeams] = useState<TeamResponse[]>([])
  const [currentTeam, setCurrentTeam] = useState<TeamResponse | null>(null)
  const [members, setMembers] = useState<TeamMemberResponse[]>([])
  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [inviting, setInviting] = useState(false)

  // Forms
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await teamApi.getTeams()
      setTeams(response.data)
      if (response.data.length > 0) {
        setCurrentTeam(response.data[0])
        loadTeamData(response.data[0].id)
      }
    } catch (error) {
      console.error('Error loading teams:', error)
      toast.error('Ошибка загрузки команд')
    } finally {
      setLoading(false)
    }
  }

  const loadTeamData = async (teamId: string) => {
    try {
      const [membersResponse, workspacesResponse] = await Promise.all([
        teamApi.getTeamMembers(teamId),
        teamApi.getWorkspaces(teamId)
      ])
      setMembers(membersResponse.data)
      setWorkspaces(workspacesResponse.data)
    } catch (error) {
      console.error('Error loading team data:', error)
      toast.error('Ошибка загрузки данных команды')
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Введите название команды')
      return
    }

    try {
      setCreating(true)
      const response = await teamApi.createTeam({ name: newTeamName.trim() })
      setTeams(prev => [response.data, ...prev])
      setCurrentTeam(response.data)
      setNewTeamName('')
      toast.success('Команда создана')
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Ошибка создания команды')
    } finally {
      setCreating(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !currentTeam) {
      toast.error('Введите email и выберите команду')
      return
    }

    try {
      setInviting(true)
      await teamApi.inviteMember(currentTeam.id, {
        email: inviteEmail.trim(),
        role: inviteRole
      })
      setInviteEmail('')
      setInviteRole('member')
      loadTeamData(currentTeam.id)
      toast.success('Приглашение отправлено')
    } catch (error) {
      console.error('Error inviting member:', error)
      toast.error('Ошибка отправки приглашения')
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!currentTeam) return

    try {
      await teamApi.removeMember(currentTeam.id, userId)
      loadTeamData(currentTeam.id)
      toast.success('Участник удален')
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Ошибка удаления участника')
    }
  }

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim() || !currentTeam) {
      toast.error('Введите название рабочего пространства')
      return
    }

    try {
      const response = await teamApi.createWorkspace(currentTeam.id, {
        name: newWorkspaceName.trim()
      })
      setWorkspaces(prev => [response.data, ...prev])
      setNewWorkspaceName('')
      toast.success('Рабочее пространство создано')
    } catch (error) {
      console.error('Error creating workspace:', error)
      toast.error('Ошибка создания рабочего пространства')
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8" />
            Управление командой
          </h1>
          <p className="text-muted-foreground mt-2">
            Создавайте команды, приглашайте участников и управляйте рабочими пространствами
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Команды
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create Team Form */}
              <div className="space-y-2">
                <Label htmlFor="teamName">Создать команду</Label>
                <div className="flex gap-2">
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Название команды"
                  />
                  <Button 
                    onClick={handleCreateTeam}
                    disabled={creating}
                    size="sm"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator /> {/* Divider */}

              {/* Teams List */}
              <div className="space-y-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentTeam?.id === team.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setCurrentTeam(team)
                      loadTeamData(team.id)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {team.maxUsers} участников
                        </p>
                      </div>
                      {team.ownerId === user?.id && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2 space-y-6">
          {currentTeam ? (
            <>
              {/* Team Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {currentTeam.name}
                  </CardTitle>
                  <CardDescription>
                    Управление участниками и рабочими пространствами
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Invite Member Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Email участника"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="member">Участник</option>
                      <option value="admin">Администратор</option>
                    </select>
                    <Button onClick={handleInviteMember} disabled={inviting}>
                      {inviting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Участники команды</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.user?.firstName && member.user?.lastName
                                ? `${member.user.firstName} ${member.user.lastName}`
                                : member.user?.email || 'Неизвестный пользователь'
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {member.role === 'admin' ? 'Администратор' : 'Участник'}
                          </Badge>
                          {currentTeam.ownerId === user?.id && member.userId !== user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Workspaces */}
              <Card>
                <CardHeader>
                  <CardTitle>Рабочие пространства</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Create Workspace Form */}
                  <div className="flex gap-2">
                    <Input
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Название рабочего пространства"
                    />
                    <Button onClick={handleCreateWorkspace}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator /> {/* Divider */}

                  {/* Workspaces List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workspaces.map((workspace) => (
                      <div key={workspace.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{workspace.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Создано {new Date(workspace.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Нет команд</h3>
                <p className="text-muted-foreground">
                  Создайте команду, чтобы начать совместную работу
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
