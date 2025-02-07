

1. Create customer user for Prisma

```
-- Create custom user
create user "prisma" with password 'custom_password' bypassrls createdb;

-- extend prisma's privileges to postgres (necessary to view changes in Dashboard)
grant "prisma" to "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;


-- alter prisma password if needed
alter user "prisma" with password 'new_password';

```

2. install Prisma in project

```
yarn add prisma
yarn dlx prisma init
```


3. add connection to .env

```
# Used for Prisma Migrations and within your application
DATABASE_URL="postgres://[DB-USER].[PROJECT-REF]:[PRISMA-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
```


4. Create the migration

```
model Anime {
  uid        String   @id @default(uuid())
  title      String
  type       String
  status     String
  summary    String
  thumbnail  String
  studio     String

  releaseAt    DateTime
  updatedAt    DateTime
  publishedAt  DateTime
  publishedBy  String?

  subtitle      String?
  originalTitle String?
  lastEpisode   Int?
  totalEpisodes Int?
}
```

5. commit the migration

```
npx prisma migrate dev --name first_prisma_migration

```

6. install prisma client

```
yarn add @prisma/client
yarn dlx prisma generate

```

7. add prisma seed to package.json

```
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},

yarn add ts-node
npx prisma db seed
```


7. run / test