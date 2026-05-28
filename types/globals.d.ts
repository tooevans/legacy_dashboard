import { Role } from "@prisma/client"

export {}

// Create a type for the Roles
export type Roles = Role;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}