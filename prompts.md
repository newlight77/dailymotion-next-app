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
