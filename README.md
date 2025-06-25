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

## TODO

- there is a small bug

```
While editing an anime, I can search videos with the anime title and episode.
Upon search via the search icon, I'm navigated to the search page, but the search keywords is empty.
```

- next feature

Feature: display last viewed episode per anime in the list
```
Usually, I browse a list of animes with filters (ony followed checked, excluded completed checked and only with updates checked).
On the list, typically the ones I follow, I want to know which was the last episode I have viewed for each anime.
And from that knowledge, I can search video for an anime based its title and the last episode I viewed.
And the search will use the exact same keywords from the viewed video.
```

Feature : exclude short films
```
In the anime list page, I want to be able to exclude short films, that have length of less than 10 minutes.
Short films are characterized by the frequency of 2 updates weekly, while long films have only one update per week.
```

Feature : list of watched anime (all episodes viewed) in my history
```
I want to track all watched animes, so I can add a filter to exclude watched anime in the list.
```

Feature : new anime (not followed)
```
I want to tag new animes in the list, that are not yet viewed, with a filter as well.
```

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
