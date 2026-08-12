# Security Audit: NEWEN (newen.com.uy)

## Findings

### 1. Security Definer Function Executable by Authenticated Users
- **Issue**: The function `has_role` is required by the `authenticated` role to evaluate RLS policies. However, the Supabase linter flags this as a warning because it's a `SECURITY DEFINER` function callable by signed-in users.
- **Risk**: Low. The function is read-only and only returns a boolean. It is necessary for the current RBAC implementation.
- **Status**: **PASSING (with justification)**

### 2. Role-Based Access Control (RBAC) Implementation
- **Issue**: The RBAC system is implemented via a `user_roles` table and RLS policies.
- **Status**: **PASSING** (Verified in `src/routes/admin.tsx` and migrations)

---

## Action Plan

1.  **Monitor Linter**: Keep an eye on new linter rules. The current warning is a known trade-off for implementing RBAC in Supabase without recursion.

