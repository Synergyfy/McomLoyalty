<<<<<<< HEAD

export interface GuideStep {
    title: string;
    description: string;
}

export const REWARD_CREATION_STEPS: GuideStep[] = [
    {
        title: "Create Your Reward",
        description: "Welcome to the reward creation wizard. This guide will walk you through setting up a new reward for your customers. Start by selecting the type of reward you want to offer."
    },
    {
        title: "Enter Details",
        description: "Great! Now enter a catchy name for your reward, a description, and the value. Don't forget to set the points required to redeem it."
    }
];

export const CAMPAIGN_CREATION_STEPS: GuideStep[] = [
    {
        title: "Choose Campaign Type",
        description: "You have a reward! Now let's create a campaign to distribute it. Select the type of campaign that best fits your goals (e.g., QR Code for in-store)."
    },
    {
        title: "Set Campaign Details",
        description: "Give your campaign a name and customize its appearance. You can preview how it looks on the right."
    },
    {
        title: "Review and Launch",
        description: "Review all your settings. When you are ready, click 'Create Campaign' to launch it!"
    }
];

export const STAFF_CREATION_STEPS: GuideStep[] = [
    {
        title: "Manage Staff",
        description: "Your campaign is live! To help manage redemptions, you can add staff members. Select a business from the list below to manage its staff."
    }
];

export const GUIDE_CONTENT: Record<string, GuideStep[]> = {
    'REWARD': REWARD_CREATION_STEPS,
    'CAMPAIGN': CAMPAIGN_CREATION_STEPS,
    'STAFF': STAFF_CREATION_STEPS
=======
export type GuideStep = 'PROFILE' | 'REWARD' | 'CAMPAIGN' | 'STAFF' | 'COMPLETED';

export const GUIDE_CONTENT: Record<GuideStep, string> = {
  PROFILE: "Welcome! To get started, please go to your Business Profile and complete your details (Address, Phone, etc).",
  REWARD: "Great job! Now, navigate to the Rewards section and create your first reward for your customers.",
  CAMPAIGN: "Next, go to Campaigns and launch a new campaign to engage your audience.",
  STAFF: "Almost there! Manage your team by adding Staff members to help run your business.",
  COMPLETED: "You're all set! You've completed the setup guide.",
>>>>>>> 94f632025b569a210ba0ec32f6615fdfeaf4c930
};
