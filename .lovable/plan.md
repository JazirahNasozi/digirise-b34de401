

## Plan: Move Payment Gate to Publishing & Make Admin Dashboard Responsive

### 1. Move Payment Gate from Builder to Publish

Currently, users must have `payment_confirmed` before they can even access the website builder. The change moves this check so users can freely generate websites, but must have payment confirmed before they can **publish**.

**Changes:**

**`src/pages/Builder.tsx`**
- Remove the `payment_confirmed` check in `useEffect` -- only check for authentication (session).
- Remove the `accessChecked` gating state; just check for session.

**`src/pages/Dashboard.tsx`**
- Remove the payment-pending banner and the payment gate on "Create Website" button.
- Allow all authenticated users to click "Create Website" and navigate to `/builder`.

**`src/pages/WebsitePreview.tsx`**
- Before publishing, fetch the user's `payment_confirmed` status from `profiles`.
- If not confirmed, show a toast saying payment is required and block the publish action.
- The "Export HTML" and preview remain accessible regardless of payment status.

### 2. Make Admin Dashboard Responsive

**`src/pages/AdminDashboard.tsx`**
- Replace the HTML `<table>` on smaller screens with a card-based layout.
- On mobile, each user will be shown as a stacked card with their details (email, business, websites count, joined date, payment status, action button).
- On desktop (md and above), keep the existing table layout.
- Use Tailwind responsive classes (`hidden md:block` for table, `md:hidden` for cards).

### Technical Details

**Files modified (4):**
- `src/pages/Builder.tsx` -- Remove payment check, simplify to auth-only gate
- `src/pages/Dashboard.tsx` -- Remove payment banner and lock on create button
- `src/pages/WebsitePreview.tsx` -- Add payment check before publish
- `src/pages/AdminDashboard.tsx` -- Add mobile card layout alongside existing table

No database changes required.
