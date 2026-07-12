import { Link } from 'react-router'

import type { PermissionKey } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'

export function EntityLink({
  href,
  label,
  permission,
}: {
  href: string
  label: string
  permission: PermissionKey
}) {
  return (
    <PermissionGate permission={permission}>
      <Link to={href} className="text-primary font-medium hover:underline">
        {label}
      </Link>
    </PermissionGate>
  )
}
