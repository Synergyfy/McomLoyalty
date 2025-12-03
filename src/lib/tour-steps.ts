
import { DriveStep } from "driver.js";

// Steps for Creating a Reward (inside the modal)
export const rewardCreationSteps: DriveStep[] = [
  {
    element: '#create-reward-modal-content',
    popover: {
      title: 'Create Your Reward',
      description: 'Follow this guide to set up a new reward for your customers.',
      side: "left",
      align: 'start'
    }
  },
  {
    element: '#reward-type-select-trigger',
    popover: {
      title: 'Choose Reward Type',
      description: 'Select the type of reward you want to offer (e.g., Voucher, Gift Card).',
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#reward-name-input',
    popover: {
      title: 'Name Your Reward',
      description: 'Give your reward a clear and catchy name.',
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#reward-description-input',
    popover: {
      title: 'Describe the Reward',
      description: 'Provide details about what the reward is and how to use it.',
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#reward-audience-select-trigger',
    popover: {
      title: 'Select Audience',
      description: 'Choose who can access this reward (All Businesses or Specific Sectors).',
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#reward-value-input',
    popover: {
      title: 'Set Value',
      description: 'Enter the monetary value of this reward.',
      side: "top",
      align: 'start'
    }
  },
  {
    element: '#reward-points-input',
    popover: {
      title: 'Points Required',
      description: 'Set how many points are needed to redeem this reward.',
      side: "top",
      align: 'start'
    }
  },
  {
    element: '#reward-next-btn',
    popover: {
      title: 'Next Step',
      description: 'Click Next to review your reward details.',
      side: "top",
      align: 'start'
    }
  }
];

// Campaign Creation Steps split by Wizard Step

export const campaignStep1Steps: DriveStep[] = [
  {
    element: '#campaign-step-indicator',
    popover: {
      title: 'Campaign Creation',
      description: 'Now that you have a reward, let\'s create a campaign to distribute it.',
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#campaign-type-selection',
    popover: {
      title: 'Campaign Type',
      description: 'Select the type of campaign (e.g., Standard, Promotional).',
      side: "bottom",
      align: 'start'
    }
  }
];

export const campaignStep3Steps: DriveStep[] = [
  {
    element: '#campaign-name-input',
    popover: {
      title: 'Campaign Name',
      description: 'Enter a name for your campaign.',
      side: "bottom",
      align: 'start'
    }
  }
];

export const campaignStep10Steps: DriveStep[] = [
  {
    element: '#campaign-submit-btn',
    popover: {
      title: 'Launch Campaign',
      description: 'Once you are done, click here to create and launch your campaign.',
      side: "top",
      align: 'start'
    }
  }
];

// Steps for Business/Staff Management
export const businessListTourSteps: DriveStep[] = [
    {
        element: '#business-table',
        popover: {
            title: 'Manage Staff',
            description: 'To add staff, first select the business they belong to.',
            side: "top",
            align: 'start'
        }
    }
];
