import { Role, defineAbilitiesFor, userSchema } from '@saas/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role: role,
  })

  const ability = defineAbilitiesFor(authUser)

  return ability
}
