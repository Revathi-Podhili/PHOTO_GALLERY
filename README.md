# Celebrare Photo Gallery

A responsive React photo gallery using the Picsum Photos API.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Implementation notes

- `src/hooks/useFetchPhotos.js` requests 30 photos once on mount and exposes `photos`, `loading`, and `error`. An `AbortController` cancels the request when the component unmounts.
- `src/components/Gallery.jsx` uses `useReducer` to toggle photo IDs in the favourites list. The reducer's initializer restores saved IDs from `localStorage`; an effect persists changes.
- The search handler uses `useCallback`. `useMemo` filters the photos already held in memory, so typing does not make another request.
- Tailwind breakpoints provide one column on mobile, two at `sm`, and four at `lg`.

## Manual verification

- On first load, the spinner is visible until the Picsum request finishes; the gallery then shows 30 photos and author names.
- If the Picsum request fails, the gallery displays an error message.
- Resize to a phone width, tablet width, and desktop width to check the one-, two-, and four-column layouts.
- Search for a visible author name and confirm matching results update as you type. Clear the search and confirm all photos return; the Network panel should show no request caused by typing.
- Toggle a heart off and on, refresh the page, and confirm the saved heart state remains.


