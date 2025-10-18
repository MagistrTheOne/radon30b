import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/about',
  '/features',
  '/api',
  '/status',
  '/support',
  '/faq',
  '/docs',
  '/community',
  '/blog',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/gdpr',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk',
  '/api/webhooks/stripe',
  '/api/search',
  '/api/contact',
  '/api/upload',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
