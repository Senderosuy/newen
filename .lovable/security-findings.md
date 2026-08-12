# Security Audit: NEWEN (newen.com.uy)

## Findings

### 1. Security Definer Functions Exposed to Public
- **Issue**: The functions `has_role` and `handle_new_user_role` are defined as `SECURITY DEFINER`. While recent migrations attempted to revoke privileges, the Supabase linter still flags them as executable by `public` or `authenticated` roles in some contexts, or the revocation wasn't complete across all schemas/roles.
- **Risk**: A malicious user might attempt to brute-force or invoke these functions directly to probe role existence or trigger logic.
- **Status**: **FAILING** (Linter Warnings 1, 2, 3)

### 2. Role-Based Access Control (RBAC) Implementation
- **Issue**: The RBAC system is implemented via a `user_roles` table and RLS policies.
- **Status**: **PASSING** (Verified in `src/routes/admin.tsx` and migrations)

---

## Action Plan

1.  **Tighten Function Permissions**: Explicitly revoke `EXECUTE` on `has_role` and `handle_new_user_role` from `PUBLIC` and `anon`. Ensure `authenticated` only has access to `has_role` as it's required for RLS policies to function for logged-in users.
2.  **Verify RLS Coverage**: Ensure no new tables were added without corresponding RBAC policies.
