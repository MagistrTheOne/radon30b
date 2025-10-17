/**
 * Admin Authentication
 * Аутентификация и авторизация администраторов
 */

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin' | 'owner'
  permissions: string[]
  createdAt: string
  lastLoginAt?: string
  isActive: boolean
}

export interface AdminPermissions {
  canManageUsers: boolean
  canManageSubscriptions: boolean
  canViewAnalytics: boolean
  canManageContent: boolean
  canAccessLogs: boolean
  canManageSettings: boolean
}

/**
 * Проверка прав администратора
 */
export async function checkAdminAccess(userId: string): Promise<{
  isAdmin: boolean
  adminUser?: AdminUser
  permissions?: AdminPermissions
}> {
  try {
    const response = await fetch(`/api/admin/verify?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return { isAdmin: false }
    }

    const data = await response.json()
    return {
      isAdmin: true,
      adminUser: data.adminUser,
      permissions: data.permissions
    }

  } catch (error) {
    console.error('Error checking admin access:', error)
    return { isAdmin: false }
  }
}

/**
 * Получить список всех администраторов
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка получения списка администраторов')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

/**
 * Создать нового администратора
 */
export async function createAdminUser(adminData: {
  email: string
  role: 'admin' | 'super_admin'
  permissions: string[]
}): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    })

    return response.ok
  } catch (error) {
    console.error('Error creating admin user:', error)
    return false
  }
}

/**
 * Обновить администратора
 */
export async function updateAdminUser(
  adminId: string, 
  updates: Partial<AdminUser>
): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/users/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    return response.ok
  } catch (error) {
    console.error('Error updating admin user:', error)
    return false
  }
}

/**
 * Удалить администратора
 */
export async function deleteAdminUser(adminId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/users/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return response.ok
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return false
  }
}

/**
 * Проверка конкретного разрешения
 */
export function hasPermission(
  permissions: AdminPermissions | undefined,
  permission: keyof AdminPermissions
): boolean {
  if (!permissions) return false
  return permissions[permission] === true
}

/**
 * Проверка роли администратора
 */
export function hasAdminRole(adminUser: AdminUser | undefined, role: string): boolean {
  if (!adminUser) return false
  return adminUser.role === role
}

/**
 * Получить разрешения по роли
 */
export function getPermissionsByRole(role: string): AdminPermissions {
  switch (role) {
    case 'owner':
      return {
        canManageUsers: true,
        canManageSubscriptions: true,
        canViewAnalytics: true,
        canManageContent: true,
        canAccessLogs: true,
        canManageSettings: true
      }
    case 'super_admin':
      return {
        canManageUsers: true,
        canManageSubscriptions: true,
        canViewAnalytics: true,
        canManageContent: true,
        canAccessLogs: true,
        canManageSettings: false
      }
    case 'admin':
      return {
        canManageUsers: false,
        canManageSubscriptions: true,
        canViewAnalytics: true,
        canManageContent: true,
        canAccessLogs: false,
        canManageSettings: false
      }
    default:
      return {
        canManageUsers: false,
        canManageSubscriptions: false,
        canViewAnalytics: false,
        canManageContent: false,
        canAccessLogs: false,
        canManageSettings: false
      }
  }
}

/**
 * Middleware для проверки прав администратора
 */
export function requireAdmin(requiredPermission?: keyof AdminPermissions) {
  return async (userId: string) => {
    const { isAdmin, adminUser, permissions } = await checkAdminAccess(userId)
    
    if (!isAdmin || !adminUser) {
      throw new Error('Недостаточно прав для доступа к этой странице')
    }

    if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
      throw new Error(`Недостаточно прав: требуется разрешение ${requiredPermission}`)
    }

    return { adminUser, permissions }
  }
}
