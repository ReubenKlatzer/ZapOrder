# Fix Login After AI Assist → Order Refresh Issue (Mobile/Phone)

## Plan Overview
- Issue: After AI chat prompts login (sets loginOpen), user logs in via phone/name (fake OTP), session sets, but active order not refreshing in OrderContext (/api/order SWR).
- Solution: Expose mutate to OrderContext consumers (OrderPage), call after login success. Add useEffect refetch on session change.

## Steps
1. [x] Update `src/components/context/Order.tsx`: Add `mutate` to context value, useEffect on session.status === 'authenticated'.
2. [x] Update `src/app/[restaurant]/_components/Menu/OrderPage.tsx`: Import/use mutate, call on loginOpen change to false.
3. [x] Update `src/app/[restaurant]/_components/Menu/UserLogin.tsx`: On successful signIn, dispatch custom event or use ref callback to trigger parent refresh.
4. [ ] Test: `npm run dev`, /demo-restaurant?table=1, chat→login→check order loads on mobile.
5. [ ] Update this TODO_PLAN.md as steps complete.
6. [ ] attempt_completion

**Progress: All code updates complete (1-3). Ready for testing.**
