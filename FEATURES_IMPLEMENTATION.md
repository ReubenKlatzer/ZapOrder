# ZapOrder New Features Implementation Guide

## Features Added:

### 1. Order Tracking System
**Status:** Backend Complete - Frontend Needs Implementation

**Database Changes:**
- Added `trackingStatus` field to Order model (placed, confirmed, preparing, transit, delivered)
- Added `estimatedTime` field to Order model (in minutes)
- Created `OrderTracking` model for tracking history
- Created `order_tracking` table

**API Endpoints:**
- `POST /api/order/tracking` - Update order status (Kitchen staff only)
  - Body: `{ orderId, status, estimatedTime?, message? }`
- `GET /api/order/tracking?orderId=xxx` - Get order tracking info

**Frontend TODO:**
1. Create order tracking component for customers
2. Add tracking status update UI in kitchen dashboard
3. Display estimated time and status updates in real-time

---

### 2. Order Export (Multiple Formats)
**Status:** Backend Complete - Frontend Needs Implementation

**API Endpoint:**
- `GET /api/order/export?orderId=xxx&format=csv|excel|txt|json`

**Supported Formats:**
- CSV/Excel - Comma-separated values
- TXT - Plain text formatted
- JSON - Raw JSON data

**Frontend TODO:**
1. Add export buttons to order history page
2. Add download functionality for each format

---

### 3. AI Add to Cart
**Status:** Backend Complete - Frontend Needs Implementation

**Changes Made:**
- Updated AI prompt to ask if user wants to add suggested items
- Modified `chatService.ts` to parse `<<<ADD_TO_CART:[...]>>>` tags
- Returns `addToCart` array with menu items

**Frontend TODO:**
1. Handle `addToCart` response from chat API
2. Automatically add items to cart when AI confirms
3. Show confirmation toast when items are added

---

### 4. Meal Suggestions
**Status:** Backend Complete - Frontend Needs Implementation

**Database Changes:**
- Created `MealSuggestion` model
- Created `meal_suggestions` table with fields:
  - restaurantID, customerName, phone, mealName, description, status

**API Endpoints:**
- `POST /api/meal-suggestion` - Submit meal suggestion
  - Body: `{ restaurantID, customerName, phone, mealName, description? }`
- `GET /api/meal-suggestion?restaurantID=xxx` - Get all suggestions for restaurant

**Frontend TODO:**
1. Create meal suggestion form for customers
2. Add meal suggestions management page in admin dashboard
3. Allow admin to mark suggestions as reviewed/added

---

## Database Migration Required

Run these commands to apply database changes:

```bash
npx prisma migrate dev --name add_tracking_and_suggestions
npx prisma generate
```

---

## Testing Checklist

### Order Tracking:
- [ ] Kitchen can update order status
- [ ] Customer can view order tracking
- [ ] Estimated time displays correctly
- [ ] Tracking history shows all status changes

### Order Export:
- [ ] CSV export works
- [ ] TXT export works
- [ ] JSON export works
- [ ] Downloaded files have correct data

### AI Add to Cart:
- [ ] AI asks if user wants to add items
- [ ] Items are added to cart when confirmed
- [ ] Cart updates correctly
- [ ] Toast notification shows

### Meal Suggestions:
- [ ] Customer can submit suggestions
- [ ] Admin can view all suggestions
- [ ] Admin can update suggestion status
- [ ] Suggestions are stored correctly

---

## Next Steps:

1. Run database migration
2. Implement frontend components for each feature
3. Test all features thoroughly
4. Deploy to production

---

## API Response Examples:

### Order Tracking Response:
```json
{
  "trackingStatus": "preparing",
  "estimatedTime": 25,
  "trackingHistory": [
    {
      "id": "xxx",
      "status": "placed",
      "message": null,
      "createdAt": "2024-01-01T10:00:00Z"
    },
    {
      "id": "yyy",
      "status": "confirmed",
      "message": "Order confirmed by kitchen",
      "createdAt": "2024-01-01T10:02:00Z"
    }
  ]
}
```

### Chat with Add to Cart:
```json
{
  "text": "Great choice! Would you like me to add these to your cart?",
  "toolResults": [[{...menu items...}]],
  "addToCart": [{...menu items to add...}]
}
```

### Meal Suggestion Response:
```json
{
  "message": "Meal suggestion submitted successfully",
  "suggestion": {
    "id": "xxx",
    "restaurantID": "nova",
    "customerName": "John Doe",
    "phone": "+27821234567",
    "mealName": "Spicy Chicken Wrap",
    "description": "With extra cheese and jalapeños",
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```
