# Services

All API communication MUST go through service classes in this directory.

## Pattern

```typescript
// src/services/example.service.ts
import { apiClient } from '@/lib/axios'

export class ExampleService {
  static async getAll() {
    const { data } = await apiClient.get('/examples')
    return data
  }
}
```

**Never** import `apiClient` or `axios` directly from components or pages.
