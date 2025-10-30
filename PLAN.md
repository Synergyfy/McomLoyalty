*✅ Campaign Page & Structure Updates*
1. *Enable Multiple Rewards in Campaign Creation*
   - Allow users (Admin or Business Owner) to select and add multiple rewards when creating a campaign.

2. *Redesign the Campaign Front Page*
   - Update the layout of individual campaign pages - src/app/campaigns/[campaignId]/page.tsx  (not the campaign list view).
   - Include the following structure:
     - (1) Logo section (top right)
     - (2) Title section
     - (2b) Headline
     - (2c) Menu bar
     - (3) and the info the admin or business filled in the campaign creation wizard(src/app/admin/campaigns/create/page.tsx) check the components it imported to know the field the admin field 
     - (3b) Multiple rewards display
     - (4) Instructions section
     - (5) Footer
  - it should look like a full aesthetic page 

3. *Maintain Existing Campaign Creation Page*
   - Keep the current campaign creation flow but integrate the new layout elements mentioned above.

4. *Use Loyalty CardX Layout as Reference*
   - Follow the visual and structural approach used in Loyalty CardX for consistency and clarity.

5. *Retrieve Existing Code from Azeem*
   - Use available logic and code from Azeem to speed up implementation.

---

*🧩 Role-Based Campaign Access & Permissions*
6. *Admin Campaign Setup*
   - Admin should be able to create campaigns that Business Owners can claim.
   - Admin sets default elements (logo, header, rewards, footer).

7. *Business Owner Permissions Based on Subscription*
   - Business Owners in “Manage Mode” can claim campaigns.
   - Depending on their subscription level:
     - Higher tiers can edit logo, header, footer.
     - Lower tiers must use admin-defined defaults.

8. *White Label Members*
   - Only White Label users can create campaigns from scratch.

9. *Customer Campaign Interaction*
   - Customers cannot claim campaigns.
   - They can join campaigns, earn points, and redeem rewards.

10. *Redeem Button Logic*
    - Show redeem button only for rewards where the customer has earned enough points.

---

*📦 Wishlist Feature Enhancements*
11. *Rename & Expand Wishlist*
    - Rename “Wishlist” to “My Wishlist”.
    - Add “Create Wishlist” functionality.
    - Ensure “Edit”, “Share”, and “Remove” actions work properly.

12. *Wishlist Visibility Rules*
    - Move full wishlist insights to Admin dashboard.
    - Business Owners should only see:
      - Their own wishlist.
      - Products added to their wishlist by customers.

---

*📌 Page Assignments & Flow Adjustments*
13. *Business Owner Page Updates*
    - Move the reward-claim flow to the Business Owner page.
    - Do not delete existing logic—just relocate it.

14. *Deadline*
    - Complete the campaign front page redesign before the meeting tonight.