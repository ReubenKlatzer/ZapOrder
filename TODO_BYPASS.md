# Dev QR Bypass + Restaurant Selector + Developing Notice

## Plan
- Use **database data** for restaurant selector (fetch /api/restaurants list usernames).
- Add dropdown if no ?table= param.
- "Still developing" banner.
- For each restaurant, list its tables.

## Steps
1. [x] Create /api/restaurants/route.ts - list accounts (usernames, name).
2. [x] Update OrderPage.tsx - selector if !table, fetch restaurants/tables, router.replace.
3. [ ] Add developing banner.
4. [ ] Update TODOs.
5. [ ] Test.

**Progress: Selector + banner added. Test ?dev=1 on any /rest.**
