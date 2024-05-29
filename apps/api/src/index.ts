import { defineAbilitiesFor } from '@saas/auth'

const ability = defineAbilitiesFor({
  role: 'ADMIN',
})

const userCanInviteSomeoneElse = ability.can('invite', 'User')

console.log(userCanInviteSomeoneElse) // true

