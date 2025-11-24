export interface Tier {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    monthlyPrice: string; // API returns string "45.00"
    annualPrice: string; // API returns string "540.00"
    quaterlyPrice: string; // API returns string "135.00"
    features: string[];
    status: string;
    stripeMonthlyPriceId: string;
    stripeQuarterlyPriceId: string;
    stripeAnnualPriceId: string;
    paypalMonthlyPlanId: string;
    paypalQuarterlyPlanId: string;
    paypalAnnualPlanId: string;
    qrCodeCount: number;
    description?: string;
    includesNfc?: boolean;
}

export enum PlanType {
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    ANNUALLY = 'ANNUALLY',
}

export enum PaymentProvider {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
}

export interface SubscribeDto {
    tier_id: string;
    plan_type: PlanType;
    provider?: PaymentProvider;
    payment_token?: string; // Required for Stripe
    return_url?: string;    // Required for PayPal
    cancel_url?: string;    // Required for PayPal
    is_trial?: boolean;
}

export interface StripeSubscriptionResponse {
    status: string;
    clientSecret: string;
    subscriptionId: string;
}

export interface PayPalSubscriptionResponse {
    status: string;
    orderId: string;
    approveLink: string;
}

export type SubscriptionResponse = StripeSubscriptionResponse | PayPalSubscriptionResponse;
