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

## FEatures : watch list & anime list

```prompt
An authenticated user would be able to own watch lists and followed anime list.

A watch list may be public so it can be shared, but it is owned by a user. Only the owner can modifiy the list.

The following publishers are owned by a user. Only the owner can modifiy its content. The persistence of followings

The followed anime
```

```prompt

The animelist is only read-only, the anime list is load from the database, not anymore from the localstorage.
```