import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { getPermissionsByRole } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем, является ли пользователь администратором
    const adminUser = await prisma.adminUser.findUnique({
      where: { 
        userId,
        isActive: true
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    // Получаем разрешения по роли
    const permissions = getPermissionsByRole(adminUser.role)

    // Обновляем время последнего входа
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() }
    })

    return NextResponse.json({
      isAdmin: true,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions,
        createdAt: adminUser.createdAt.toISOString(),
        lastLoginAt: adminUser.lastLoginAt?.toISOString(),
        isActive: adminUser.isActive
      },
      permissions
    })

  } catch (error) {
    console.error('Error verifying admin access:', error)
    return NextResponse.json(
      { error: 'Ошибка проверки прав администратора' },
      { status: 500 }
    )
  }
}
