# Prompts

## Add anime Ttile

```prompt
Please generate a script to add an anime title to the list by filling all details, add a command in the makefile so to easily add a title in the future. Each time a title is added into the database, update the animelist.json as well. And add the "The Other Side of Deep Space" title to the anime list.
```

```prompt
please fetch new donghua 3D animation tiltes from "lucifer donghua", "bilibili", "youku", "animedonghua", "donghuazone", "donghuastream", "anime4i", "animecube live" websites, and suggest them to be added to the list.
```

## TODOs
1. schedule of upcoming episodes

```prompt
Let's add a page to display upcoming episodes of followed animes.

Please try to apply the atomic hexagon architecture:
The page displays a featured region. This region can be put on another page in the future if needed to change.
A featured region is composed of featured views.
A featured view is composed of featured objects
A featured object is an instance of a generic components with behavior.

On this page, we would have list all followed animes. For each followed anime, show the last published episode, and the upcoming episode, with date.

Then the list is ordered by upcoming date, using the closest to current date on top.

Fetch the upcoming episode from several sources :
- "lucifer donghua"
- "bilibili"
- "youku"
- "animedonghua"
- "donghuazone"
- "donghuastream"
- "anime4i"
- "animecube live"

For each of the upcoming episode, let's show the same card design as on the anime list page, add icon buttons to search for viewing.
```

2. auto feeding and recommend new series

```prompt
Let's fetch new published series, and add a banner with carrousel to recommand new anime title on the schedule page.

Please try to apply the atomic hexagon architecture:
The page displays a featured region. This region can be put on another page in the future if needed to change.
A featured region is composed of featured views.
A featured view is composed of featured objects
A featured object is an instance of a generic components with behavior.

This caroussel is a featured view composed of severals featured objects. Here we would have one featured card (object) displaying an anime title. The behavior is to have the icon buttons to follow, or search. These 2 behavior are present on cards on the anime list results.

New anime title are only the ones that are not yet added to the animelist. So if there is no new anime to be suggested, do not display the caroussel.
```

## Refactor

```prompt
Let's refactor the codebase to apply the atomic hexagon architecture:
The page displays a featured region. This region can be put on another page in the future if needed to change.
A featured region is composed of featured views.
A featured view is composed of featured objects
A featured object is an instance of a generic components with behavior.

Featured components (objects, views, regions) are context specific, thus to be move into donghua context, in which there are hexagons (ex. animelist-feature, schedule-feature, videsearch-feature).
```

## Watch List feature

```prompt
I want to be allow users to managers watch lists. Each watch list holds anime titles. Watch lists are to be stored in a db table identified by a uuid.
Users can access a watch-list page with that uuid as param in the URL. Upon accessing that URL, the watch lists page is open to render a list of watch lists.
Add a button in the header to access that watch lists page.

On the watch lists page, upon click on a watch list item, open a watch list page with all anime cards.

On the watch lists page, display each watch list as an item in a list. Use the same design as "Followed animes" view.
Each watch list has a title, createdAt and updateAt. Users cann add/delete or click on the watch list to view the watch list content, on a separate page.

On a selected watch list page, all animes that have been added as watched animes are displayed with cards, just like the "anime card", using AnimeCard component.
The user can then update the list of anime titles, by removing an anime from the watch list.
He can rename the watch list, on the selected watch list page.

On the animelist page, let's add a watch list button in the anime card on the animelist page. Upon click on the add to watch list button, a menu popups to suggest a list of watch lists so the user can choose to add the anime to a selected watch list.
```

```prompt
On the detail watch list page, there is no need of a removableItem button on the card, we can use the "add watch list" button as a toggle.

Also for the menu when click on add to watch list, let's use a blurring background for the menu list watch listes (title item) to users.

The "add watch list" toogle button is highlighted when added, un-highlighted when removed. Apply of the detail watch list page and animelist page.

Also the watch lists and animes added to a watch list are stored into the database, not using any localstorage.
```

## OIDC

```prompt
Let's implement the authentication feature, and integrate with open ID connect using, basic auth, google microsoft and apple as providers for authentication.

Create a "sign in" button as a featured object, named SigninButton.
Create a "sign out" button as a featured object, named SignoutButton.
Create signin form wrapped as UI component, as a featured view component, named SigninWithSocialForm.
Create signup form wrapped as UI component, as a featured view component, named SignupWithSocialForm, with email, password, firstname and lastname.

Create an Authentication hook, with context and provideer such to inject into the SigninWithSocialForm.

On the sign in form, add a sign up button so users can create an account if he does not yet have one.
```

```prompt
For the basic auth, let's add a next backend route to ensure the authentication by managing credentials in the supabase, thus creating the required tables.

For the password, nesure there are at least 8 characters with 1 capital and one digit and one special character.

Once the user is authentcation, he is redirected to the home page. The token is stored in the localstorage.
```

## Refactor

```prompt
Let's rename all localstorage keys by adding a prefix "dailymotion_donghua".
```

```prompt
Let's move everything under shared to core/core-lib.
now let's rename the folder "react-mui-joy" to "core-ui", and move directly under a new folder named core.

That way, we would have core/core-lib and core/core-ui.

The authentication feature, named auth-feature, has to be put under core/capabilities.
```

## Features : watch list & anime list

```prompt
An authenticated user would be able to own watch lists and followed anime list.

A watch list may be private or public. If it is public, it can be shared with a link, but it is still owned by a user who created it. Only the owner can add/remove an anime to the list, or change the alias of the watch list. Let's use the localstorage as local cache. Upon click on the "share" or "share link" button, let's copy the link into the clipboard. If the watch list is private, disable the share button. The user can not share the link, it has to be made public first. A public watch list is visible publicly, no sign in is required. A private watch list is only visible by the owner. A user can list he's own watch lists that have created.

The followed video publishers are persisted into the database, They are owned by a user. Only the owner can follow/unfolow. Let's use the localstorage as local cache.

The followed anime are persisted into the database. They are owned by a user. Only the owner can follow/unfolow. Let's use the localstorage as local cache.

The animelist is only read-only, the anime list is load from the database. Only the admin can modify the list. The localstorage is used as local cache.

```

```prompt
Then add:
- Admin enforcement for animelist updates
- Public sharing endpoints for watch lists
- UI toggles for public/private watch lists

Add a public share UI (copy link) and a public watchlist page that consumes the new endpoint. And a “Share” button in the watchlist list view.
```

```prompt
For the authentication, when the token is generated, let's set the ttl to be valid for 1 day.
```

```prompt
Let's remove the "follow anime" feature, and everything that is related to that, such as "followed animes" views, pages and components
```

```prompt
And I have added a few anime titles to one watch list. But the page displays all items added to the first watch list on both watch lists.
```

```prompt
For the watch list, let's order items with the same rule as applied on the anime list page.
```

## Features : rating and review

```prompt
Let's add ratings, reviews, and comments to animes in the anime list, they are to be persisted into the database. Create respective tables for that purpose. A rating and a comment are associated to a user, as he is the owner.
A review is a concept, it represents a combination of a rating and a comment.

On the anime card, users can only add/modify a rating, via the icon button.

On the anime detail page, a user can add/modify a rating and a comment. A user can modify the rating and the review, only if he is the owner of the rating and comment
Comments are displayed at the bottom of the page with a "add" button and an input field for a comment to be added.

The rating is set via the icon button on the card, shown as a serie of 5 stars decribed below. On click on the "rating" button, allow users to choose the rating.

Let's add an icon button on every anime card so to allow users to rate (with 1 to 5 stars):
1 star = first star highlighted, and 4 stars not highlighted
2 stars = first 2 stars highlighted, and 3 stars not highlighted
3 stars = first 3 stars highlighted, and 2 stars not highlighted
4 stars = first 4 stars highlighted, and 1 last star not highlighted
5 stars = all 5 stars highlighted

For the colors : un-highlighted = primary, highlighted = tertiary

On the anime card or anime detail page, we display the global rating.

The global rating of an anime is the average of all ratings from users. It is displayed on the anime card, top right with 5 star, un-highlighted by default.

```

```prompt
Let's update the scoring of the anime order in the list, by taking into account the global rating, and apply that on the anime list page and watch lists.
```