### **PLAN.md: Campaign Creation Wizard - Comprehensive Preview Implementation**

**Objective:** To integrate a full, interactive preview of the customer-facing campaign pages (`[campaignId]/page.tsx`, `earn-points/page.tsx`, `redeem-points/page.tsx`, `contact-us/page.tsx`, `my-points/page.tsx`) into the `StepReviewAndCreate.tsx` component of the campaign creation wizard. The preview will dynamically render content based on the `formData` collected throughout the wizard.

---

**Phase 1: Create Reusable Preview Components**

The core idea is to create "preview" versions of the customer-facing pages that can accept campaign data as props, rather than fetching it or relying on global state. This will allow `StepReviewAndCreate` to render them directly with the wizard's `formData`.

1.  **`CampaignDetailPagePreview.tsx` (for `src/app/campaigns/[campaignId]/page.tsx`)**
    *   **Location:** `src/components/dashboard/campaigns/previews/CampaignDetailPagePreview.tsx`
    *   **Purpose:** Renders the main campaign detail page layout.
    *   **Inputs:** Will accept `campaignData` (of type `CampaignFormData`) as a prop.
    *   **Implementation:** Extract the core JSX structure from `src/app/campaigns/[campaignId]/page.tsx` (excluding the `useState` hooks for `isJoinDialogOpen`, `joinedCampaignTitle`, `isMobileMenuOpen`, and the `Header`/`Footer` components, as these will be handled by the wizard's context or the overall layout). Replace all references to `campaign` with `campaignData`.

2.  **`EarnPointsPagePreview.tsx` (for `src/app/campaigns/earn-points/page.tsx`)**
    *   **Location:** `src/components/dashboard/campaigns/previews/EarnPointsPagePreview.tsx`
    *   **Purpose:** Renders the Earn Points page layout.
    *   **Inputs:** Will accept `campaignData` (specifically `earnTitle`, `earnText`) as a prop.
    *   **Implementation:** Extract the core JSX from `src/app/campaigns/earn-points/page.tsx`. Replace hardcoded titles/descriptions with `campaignData.earnTitle` and `campaignData.earnText`. Remove any `useState` hooks related to modals, as these are not part of the static preview.

3.  **`RedeemPointsPagePreview.tsx` (for `src/app/campaigns/redeem-points/page.tsx`)**
    *   **Location:** `src/components/dashboard/campaigns/previews/RedeemPointsPagePreview.tsx`
    *   **Purpose:** Renders the Redeem Points page layout.
    *   **Inputs:** Will accept `campaignData` (specifically `redeemTitle`, `redeemText`) as a prop.
    *   **Implementation:** Extract the core JSX from `src/app/campaigns/redeem-points/page.tsx`. Replace hardcoded titles/descriptions with `campaignData.redeemTitle` and `campaignData.redeemText`.

4.  **`ContactUsPagePreview.tsx` (for `src/app/campaigns/contact-us/page.tsx`)**
    *   **Location:** `src/components/dashboard/campaigns/previews/ContactUsPagePreview.tsx`
    *   **Purpose:** Renders the Contact Us page layout.
    *   **Inputs:** Will accept `campaignData` (specifically `contactTitle`, `contactText`, `contactEmail`, `contactPhone`) as a prop.
    *   **Implementation:** Extract the core JSX from `src/app/campaigns/contact-us/page.tsx`. Replace hardcoded contact details with `campaignData.contactTitle`, `campaignData.contactText`, `campaignData.contactEmail`, and `campaignData.contactPhone`.

5.  **`MyPointsPagePreview.tsx` (for `src/app/campaigns/my-points/page.tsx`)**
    *   **Location:** `src/components/dashboard/campaigns/previews/MyPointsPagePreview.tsx`
    *   **Purpose:** Renders the My Points page layout.
    *   **Inputs:** Will accept `campaignData` (specifically `pointBalance` and `transactionHistory` if these are configurable in the wizard, otherwise use mock data for preview).
    *   **Implementation:** Extract the core JSX from `src/app/campaigns/my-points/page.tsx`. Use mock data for `pointBalance` and `transactionHistory` for the preview, as these are dynamic user-specific data not configured in the wizard.

---

**Phase 2: Integrate Previews into `StepReviewAndCreate.tsx`**

1.  **Modify `StepReviewAndCreate.tsx`:**
    *   Import all the new `*PagePreview.tsx` components.
    *   Remove the existing "Campaign Preview" section.
    *   Introduce a state variable (e.g., `previewPage`) to control which preview component is currently displayed (e.g., 'main', 'earn', 'redeem', 'contact', 'my-points').
    *   Add a navigation mechanism (e.g., a `Tabs` component or a simple button group) within `StepReviewAndCreate` to switch between the different preview pages.
    *   Conditionally render the selected preview component, passing the `formData` from `useCampaignForm()` as props to each preview component.
    *   Ensure the overall layout of `StepReviewAndCreate` accommodates these previews gracefully.

---

**Phase 3: Clean Up and Refine**

1.  **Remove redundant code:** Ensure that the original customer-facing pages (`src/app/campaigns/[campaignId]/page.tsx`, etc.) do not contain any duplicate logic or UI that has been moved to the preview components. They should continue to function as actual pages, likely fetching data from an API.
2.  **Update `CampaignFormContext`:** Double-check that all necessary fields for the new preview components are correctly defined in `CampaignFormData`. (Already done in the previous step).
3.  **Styling consistency:** Verify that all preview components maintain the application's aesthetic.
