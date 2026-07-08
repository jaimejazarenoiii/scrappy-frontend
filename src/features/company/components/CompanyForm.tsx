import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Company } from '../types/company.types'
import { companySchema, type CompanyFormValues } from '../validation/company.schema'

interface CompanyFormProps {
  company: Company
  canEdit: boolean
  isSubmitting: boolean
  onSubmit: (values: CompanyFormValues) => void
}

function toFormValues(company: Company): CompanyFormValues {
  return {
    name: company.name,
    email: company.email ?? '',
    contactNumber: company.contactNumber ?? '',
    address: company.address ?? '',
  }
}

export function CompanyForm({ company, canEdit, isSubmitting, onSubmit }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: toFormValues(company),
  })

  const disabled = !canEdit || isSubmitting

  const submitHandler = handleSubmit((values) => {
    onSubmit(values)
  })

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event)
      }}
      className="space-y-6"
      noValidate
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Company profile</CardTitle>
            <CardDescription>Information for your organization.</CardDescription>
          </div>
          <StatusBadge
            label={company.status.toLowerCase()}
            tone={company.status === 'ACTIVE' ? 'active' : 'inactive'}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Company name" htmlFor="name" error={errors.name?.message} required>
              <Input
                id="name"
                disabled={disabled}
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
            </FormField>
            <FormField label="Email" htmlFor="companyEmail" error={errors.email?.message}>
              <Input
                id="companyEmail"
                type="email"
                disabled={disabled}
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </FormField>
            <FormField
              label="Contact number"
              htmlFor="contactNumber"
              error={errors.contactNumber?.message}
            >
              <Input id="contactNumber" disabled={disabled} {...register('contactNumber')} />
            </FormField>
            <FormField label="Address" htmlFor="address" error={errors.address?.message}>
              <Input id="address" disabled={disabled} {...register('address')} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {canEdit ? (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isDirty}
            onClick={() => {
              reset(toFormValues(company))
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      ) : null}
    </form>
  )
}
