export type CompanyStatus = 'ACTIVE' | 'INACTIVE'

/** `GET /companies/me` */
export interface Company {
  id: string
  name: string
  logoUrl: string | null
  contactNumber: string | null
  email: string | null
  address: string | null
  status: CompanyStatus
}

/** `PATCH /companies/{companyId}` — partial update. */
export interface UpdateCompanyInput {
  name?: string
  logoUrl?: string | null
  contactNumber?: string | null
  email?: string | null
  address?: string | null
}
