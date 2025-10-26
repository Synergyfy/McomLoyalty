# Wishlist Feature: Frontend Prototype Flow

## Introduction

This document outlines the user flow for the new Wishlist feature prototype. It demonstrates the complete journey from both the customer's perspective and the business owner's perspective, showcasing how the feature enables customers to save items and provides businesses with actionable, consent-based data to create targeted campaigns.

This prototype uses mock data to simulate backend interactions and focuses on demonstrating a seamless user experience.

---

## Part 1: The Customer's Experience

This journey follows a customer as they interact with the wishlist functionality.

### 1. Adding an Item to the Wishlist

- **Starting Point**: The customer is browsing the "My Campaigns" page.
- **Action**: They see a **heart icon** on each campaign card. Clicking this icon signifies their interest in the item or a similar offer.
- **Result**: A `WishlistModal` appears, allowing them to save the item. (In the current prototype, this opens a placeholder modal).

### 2. Viewing and Managing The Wishlist

- **Navigation**: A new **"Wishlist"** link is now present in the customer's main sidebar menu.
- **Destination**: Clicking this link takes the customer to the "My Wishlist" page.
- **Content**: This page displays all their saved items as individual cards (`WishlistItemCard`). Each card shows key details, including the item's name, category, priority, and whether they have consented to receive offers for it. Each card also includes `Edit`, `Share`, and `Remove` buttons to manage the item.

### 3. Controlling Privacy and Preferences

- **Navigation**: A new **"Settings"** link has been added to the customer's sidebar menu.
- **Destination**: This leads to the main Settings page.
- **Control**: Here, under "Wishlist Settings," the customer has a global toggle switch. This allows them to easily opt in or out of receiving all marketing communications based on their wishlist items, giving them full control over their data and privacy.

---

## Part 2: The Business Owner's Experience

This journey follows a business owner using wishlist data to create a targeted marketing campaign.

### 1. Discovering Customer Intent

- **Navigation**: A new **"Wishlist Insights"** link is available in the Admin Panel sidebar.
- **Destination**: This page provides the business owner with valuable, aggregated data about items their potential customers are interested in.
- **Content**: The page displays a table of wishlist items, showing:
    - The name of the item (e.g., "Gourmet Burger").
    - The **estimated count** of customers who have wishlisted it and consented to offers.
    - Other data points like popular dates and priority distributions.
- **Privacy**: This data is anonymized and aggregated to protect customer privacy.

### 2. Initiating a Targeted Campaign

- **Action**: Next to each item in the insights table, there is a **"Create Campaign"** button.
- **Confirmation**: Clicking this button opens the `AudienceEstimateModal`. This modal informs the owner of the potential audience size (e.g., "Your offer matches ~124 customers.").
- **Decision**: The owner can then choose to "Use Targeting" to proceed.

### 3. Launching the Campaign with Ease

- **Navigation**: After confirming in the modal, the business owner is taken directly to the **"Create New Campaign"** wizard.
- **Automation and Pre-filling**: The campaign creation process is streamlined:
    1.  The **Campaign Name** is automatically pre-filled based on the item (e.g., "Gourmet Burger Campaign").
    2.  The **Audience Type** is automatically selected as **"Target Wishlist"**, with the specific item name shown.
- **Result**: The business owner can create a highly targeted campaign in just a few clicks, without needing to manually define the audience. This ensures the offer reaches the most interested customers.

---

## Conclusion

This Wishlist feature creates a powerful, symbiotic relationship between customers and businesses. Customers get a tool to save and track their interests, while businesses gain access to direct, consent-driven intent signals. This allows for more relevant marketing, which leads to higher engagement, better conversion rates, and increased sales, all while respecting user privacy.
