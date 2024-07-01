import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get all organization projects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  description: z.string(),
                  slug: z.string(),
                  organizationId: z.string().uuid(),
                  ownerId: z.string().uuid(),
                  avatarUrl: z.string().url().nullable(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.string().uuid(),
                    avatarUrl: z.string().url().nullable(),
                    name: z.string().nullable(),
                  }),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new BadRequestError(
            `You're not allowed to see organization project.`
          )
        }

        const projects = await prisma.project.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            organizationId: true,
            ownerId: true,
            avatarUrl: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                avatarUrl: true,
                name: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.send({
          projects,
        })
      }
    )
}
