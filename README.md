This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Pre-requisites

1. create/update the database schema


```bash
make migrate

# or
npx prisma migrate dev --name first_prisma_migration
```

2. populate the database with data

```bash
make seed

# or
npx prisma db seed
```

## Developement

Run the development server:

```bash
make dev

# or
yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

Refer the schema under /docs :

1. atomic design
2. atomic design with feature objects (views)
3. hexagonal architecture with react/next example

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
