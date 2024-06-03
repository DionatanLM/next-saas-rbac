import { z } from 'zod'

export const userSubject = z.tuple([
  z.union([
    z.literal('get'),
    z.literal('manage'),
    z.literal('update'),
    z.literal('invite'),
    z.literal('delete'),
  ]),
  z.literal('User'),
])

export type UserSubject = z.infer<typeof userSubject>
