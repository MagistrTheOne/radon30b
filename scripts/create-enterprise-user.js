const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createEnterpriseUser() {
  try {
    const email = 'magistrtheone@gmail.com'
    const userId = 'user_enterprise_owner_' + Date.now() // Временный ID, будет заменен Clerk ID после авторизации
    
    console.log('🚀 Создание Enterprise пользователя...')
    
    // 1. Создаем пользователя
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        subscription: 'enterprise',
        updatedAt: new Date()
      },
      create: {
        id: userId,
        clerkId: userId, // Временно, будет обновлен после Clerk авторизации
        email,
        name: 'MagistrTheOne',
        subscription: 'enterprise',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Пользователь создан/обновлен:', user.email)
    
    // 2. Создаем Enterprise подписку
    const subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        tier: 'enterprise',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        tier: 'enterprise',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Enterprise подписка создана:', subscription.tier)
    
    // 3. Создаем права Owner администратора
    const adminUser = await prisma.adminUser.upsert({
      where: { email },
      update: {
        role: 'owner',
        permissions: JSON.stringify([
          'canManageUsers',
          'canManageSubscriptions', 
          'canViewAnalytics',
          'canManageContent',
          'canAccessLogs',
          'canManageSettings'
        ]),
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        email,
        role: 'owner',
        permissions: JSON.stringify([
          'canManageUsers',
          'canManageSubscriptions',
          'canViewAnalytics', 
          'canManageContent',
          'canAccessLogs',
          'canManageSettings'
        ]),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Права Owner созданы:', adminUser.role)
    
    // 4. Создаем команду для пользователя
    const team = await prisma.team.create({
      data: {
        name: 'MagistrTheOne Enterprise Team',
        ownerId: user.id,
        maxUsers: 1000, // Enterprise лимит
        createdAt: new Date()
      }
    })
    
    console.log('✅ Enterprise команда создана:', team.name)
    
    // 5. Добавляем пользователя в команду как владельца
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: 'admin',
        createdAt: new Date()
      }
    })
    
    console.log('✅ Пользователь добавлен в команду как админ')
    
    // 6. Создаем рабочее пространство
    const workspace = await prisma.workspace.create({
      data: {
        teamId: team.id,
        name: 'Main Workspace',
        createdAt: new Date()
      }
    })
    
    console.log('✅ Рабочее пространство создано:', workspace.name)
    
    console.log('\n🎉 ENTERPRISE ПОЛЬЗОВАТЕЛЬ УСПЕШНО СОЗДАН!')
    console.log('📧 Email:', email)
    console.log('👑 Роль:', 'Owner')
    console.log('💎 Подписка:', 'Enterprise')
    console.log('👥 Команда:', team.name)
    console.log('🏢 Рабочее пространство:', workspace.name)
    console.log('\n📝 ВАЖНО: После авторизации через Clerk Google, обновите clerkId в базе данных!')
    
  } catch (error) {
    console.error('❌ Ошибка создания пользователя:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createEnterpriseUser()
