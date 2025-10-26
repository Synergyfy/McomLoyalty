
# Wishlist Feature Frontend Prototype Plan

This document outlines the step-by-step plan to build the frontend prototype for the Wishlist feature. The implementation will be based on the existing project structure and will use mock data for backend interactions.

## Phase 1: Customer-Facing Wishlist Flow

### 1. Create Wishlist Components:
- **`WishlistButton`**: A heart icon button to be placed on campaign cards. Clicking it will open the `WishlistModal`.
- **`WishlistModal`**: A dialog for adding or editing a wishlist item. It will include fields for:
    - Item Name (string, pre-filled)
    - Category (string, optional)
    - Occasion (dropdown: Birthday, Anniversary, None)
    - Target Date (date picker, optional)
    - Priority (radio: Low, Medium, High)
    - Consent Checkbox ("Yes - I want to receive offers...")
- **`WishlistItemCard`**: A card to display a single wishlist item on the customer's dashboard. It will show item details and actions (Edit, Share, Remove).

### 2. Integrate Wishlist Button:
- Add the `WishlistButton` to the existing campaign cards displayed to customers. I will investigate `src/app/(customer)/my-campaigns/page.tsx` and its related components to identify the correct location.

### 3. Create Customer Wishlist Page:
- Create a new page at `src/app/(customer)/wishlist/page.tsx`.
- This page will display a list of the customer's wishlist items using the `WishlistItemCard` component.
- The page will be populated with mock data to simulate a real user's wishlist.
- Add a navigation link to this new page in the customer sidebar, located at `src/components/customer/sidebar/index.tsx`.

### 4. Implement Wishlist Settings:
- Add a new section to the customer settings page for managing global wishlist preferences. This will include a global opt-out toggle for wishlist-based marketing. If a settings page doesn't exist, one will be created.

## Phase 2: Business-Facing Wishlist Insights

### 1. Create Wishlist Insights Page:
- Create a new page at `src/app/admin/wishlist-insights/page.tsx`. (WRONG: page should be created at src/app/dashboard/wishlist-insights/page.tsx` just cut what you  did at src/app/admin/wishlist-insights/page.tsx` and paste it in src/app/dashboard/wishlist-insights/page.tsx`)
- Add a link to this page in the admin/business sidebar (`src/components/admin/sidebar/index.tsx`).(WRONG: the link should instead be  in the business side bar src/components/dashboard/sidebar/index.tsx not admin)
- The page will feature:
    - A header: "Customers waiting for your products".
    - Search and filter options for wishlist items.
    - A table or list of aggregated wishlist items (using mock data), showing `item_name`, `category`, `estimated_count`, etc.
    - A "Create campaign for this audience" CTA button.

## Phase 3: Campaign Creation Integration (CORRECT)

### 1. Pre-fill Campaign Form:
- On clicking the "Create campaign" button from the Wishlist Insights page, the user will be redirected to the campaign creation page (`src/app/dashboard/campaigns/create`).
- The campaign creation form will be pre-filled with data from the selected wishlist item. This will be achieved by passing data through URL query parameters or using a state management solution.

### 2. Audience Estimate Modal:
- Create a modal that appears before the campaign creation form, displaying the estimated audience size for the targeted wishlist item.

### 3. Update Campaign Targeting Options:
- In the campaign creation flow, add a new targeting option: "Target by Wishlist".
- This will allow businesses to select a wishlist item to target for their campaign (this has not beem added to the src/components/dashboard/campaigns/StepSetCampaignDetails.tsx input fields).
