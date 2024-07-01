import { auth } from '@/http/middlewares/auth'
import { createSlug } from '@/http/utils/create-slug'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
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

        if (cannot('create', 'Invite')) {
          throw new BadRequestError(`You're not allowed to create new invites.`)
        }

        const { email, role } = request.body

        const [, domain] = email

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with ${domain} domain should be attached to the organization automatically on login.`
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(`Invite for ${email} already exists.`)
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            user: {
              email,
            },
            organizationId: organization.id,
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            `A member with this e-mail already exists in the organization.`
          )
        }

        const invite = await prisma.invite.create({
          data: {
            email,
            role,
            organizationId: organization.id,
            authorId: userId,
          },
        })

        reply.status(201).send({
          inviteId: invite.id,
        })
      }
    )
}
