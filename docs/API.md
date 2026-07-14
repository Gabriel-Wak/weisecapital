# API Documentation

## Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-13T...",
  "tenant": { "name": "Weise Capital Imóveis", "active": true }
}
```

## Server Actions

### `submitLead(formData: FormData)`

Cria um lead a partir do formulário de interesse em imóvel.

**Campos:**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | Sim |
| phone | string | Sim |
| email | string | Não |
| message | string | Não |
| propertyId | string | Não |
| source | enum | Não (default: WEBSITE) |

### `submitContact(formData: FormData)`

Cria um lead a partir do formulário de contato.

**Campos:**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | Sim |
| email | string | Sim |
| phone | string | Sim |
| subject | string | Não |
| message | string | Sim |

### `searchPropertiesAction(searchParams)`

Busca imóveis com filtros avançados. Retorna resultado paginado.

**Filtros:** city, neighborhood, type, purpose, minPrice, maxPrice, bedrooms, suites, bathrooms, parkingSpaces, hasPool, code, page, pageSize, sortBy, sortOrder

## Autenticação

- Supabase Auth com cookies HTTP-only
- Middleware protege rotas `/admin/*`
- RBAC: ADMIN, MANAGER, BROKER, EDITOR

## Segurança

- Rate limiting: 100 req/min por IP
- Headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Validação Zod em todas as entradas
- Sanitização HTML em conteúdos rich text
