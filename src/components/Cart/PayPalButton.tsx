import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalCheckoutButtonProps {
  amount: string | number;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

const initialOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_SANDBOX_CLIENT_ID_HERE", 
  currency: "USD",
  intent: "capture",
};

const PayPalButton: React.FC<PayPalCheckoutButtonProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(_data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: Number(amount).toFixed(2),
                  currency_code: 'USD',
                },
              },
            ],
            intent: 'CAPTURE'
          });
        }}
        onApprove={(_data, actions) => {
          return actions.order!.capture().then((details) => {
            onSuccess(details);
          });
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;