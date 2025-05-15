import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import {
  defaultCustomizations,
  getFlutterConfig,
} from "../../config/flutterwave.config";
import {
  FlutterWaveResponse,
  FlutterwaveConfig,
} from "flutterwave-react-v3/dist/types";
import { Button } from "flowbite-react";

export default function FlutterWavePayment({
  amount,
  email,
  name,
  membershipType,
}: {
  amount: number;
  email: string;
  name: string;
  membershipType: string;
}) {
  const config: FlutterwaveConfig = getFlutterConfig({
    amount,
    customer: {
      email,
      name,
    },
    customizations: {
      ...defaultCustomizations,
      description: `Payment for ${membershipType} membership`,
    },
  });

  const handlePayment = useFlutterwave(config);

  return (
    <Button
      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white font-bold"
      onClick={() =>
        handlePayment({
          callback: (response: FlutterWaveResponse) => {
            console.log(response);
            closePaymentModal();
          },
          onClose: () => console.log("Modal Closed"),
        })
      }
    >
      Pay with Flutterwave
    </Button>
  );
}
