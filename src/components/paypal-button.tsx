
// @ts-nocheck
'use client'

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initiatePaypalPayment, verifyPaypalPayment } from "@/services/payment/paypal";

interface PayPalButtonProps {
  tier_id: string;
  plan_type: "monthly" | "annual" | "quaterly";
  coupon_code: string;
  onPaymentSuccess: (details: any) => void;
  onPaymentError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  tier_id,
  plan_type,
  coupon_code,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const createOrder = async () => {
    try {
      const { orderId } = await initiatePaypalPayment({ tier_id, plan_type, coupon_code });
      if (orderId) {
        return orderId;
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      onPaymentError(error);
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await verifyPaypalPayment({ transaction_id: data.orderID });
      onPaymentSuccess(details);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      onPaymentError(error);
    }
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    onPaymentError(err);
  };

  if (!paypalClientId) {
    return (
      <div className="text-center text-red-500">
        PayPal client ID is not configured. Please contact support.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": paypalClientId,
        currency: "GBP",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
