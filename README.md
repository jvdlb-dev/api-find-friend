# FindAFriend API

API REST para adoção de animais, construída com princípios SOLID e testes automatizados.
Mesma stack do projeto `03-api-solid`: Fastify, Prisma 7 (PostgreSQL), Zod 4, JWT + refresh token em cookie, Vitest.

## Regras de negócio

- A cidade é obrigatória para listar pets
- Uma ORG deve ter endereço e número de WhatsApp
- Todo pet é vinculado a uma ORG
- O contato para adoção é feito direto com a ORG via WhatsApp
- Todos os filtros (exceto cidade) são opcionais
- Só uma ORG logada tem acesso administrativo (cadastro de pets)

## Rodando

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Testes

```bash
npm test          # unitários (repositórios in-memory)
npm run test:e2e  # e2e (precisa do Postgres rodando)
```

## Rotas

| Método | Rota             | Auth | Descrição                                   |
| ------ | ---------------- | ---- | ------------------------------------------- |
| POST   | `/orgs`          | não  | Cadastra uma ORG (endereço + WhatsApp)      |
| POST   | `/sessions`      | não  | Login da ORG (retorna `token` + cookie)     |
| PATCH  | `/token/refresh` | cookie | Renova o token                            |
| POST   | `/pets`          | JWT  | Cadastra pet vinculado à ORG logada         |
| GET    | `/pets`          | não  | Lista pets por cidade (`city` obrigatório)  |
| GET    | `/pets/:petId`   | não  | Detalhes do pet + dados de contato da ORG   |

Filtros opcionais em `GET /pets`: `age` (PUPPY/ADULT/SENIOR), `size`, `energy_level`,
`independence_level`, `environment` (SMALL/MEDIUM/LARGE ou LOW/MEDIUM/HIGH) e `page`.

Exemplo: `GET /pets?city=Goiânia&age=PUPPY&size=SMALL`
