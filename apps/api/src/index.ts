import { defineAbilitiesFor } from '@saas/auth'
import { projectSchema } from '@saas/auth/src/models/project'

const ability = defineAbilitiesFor({
  role: 'MEMBER',
  id: '123',
})
const project = projectSchema.parse({
  id: '123',
  ownerId: '123',
  name: 'My Project',
})
console.log(ability.can('update', project)) // true
