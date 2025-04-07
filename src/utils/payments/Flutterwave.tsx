// import React from "react";
import {
  closePaymentModal,
  useFlutterwave,
} from "flutterwave-react-v3";
import {
  defaultCustomizations,
  getFlutterConfig,
} from "../../config/flutterwave.config";
import { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";
import { Button } from "flowbite-react";

export default function FlutterWavePayment() {
  //   const configp = {
  //     public_key: "FLWPUBK-**************************-X",
  //     tx_ref: Date.now(),
  //     amount: 100,
  //     currency: "NGN",
  //     payment_options: "card,mobilemoney,ussd",
  //     customer: {
  //       email: "user@gmail.com",
  //       phone_number: "070********",
  //       name: "john doe",
  //     },
  //     customizations: {
  //       title: "My store",
  //       description: "Payment for items in cart",
  //       logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
  //     },
  //   };

  const config = getFlutterConfig({
    amount: 200,
    customer: {
      email: "user@gmail.com",
      phone_number: "070********",
      name: "john doe",
    },
    customizations: {
      ...defaultCustomizations,
      description: "test payment",
    },
  });

  //   const fwConfig = {
  //     ...config,
  //     text: "Pay with Flutterwave!",
  //     callback: (response: FlutterWaveResponse) => {
  //       console.log(response);
  //       closePaymentModal(); // this will close the modal programmatically
  //     },
  //     onClose: () => console.log("Modal Closed"),
  //   };

  const handlePayment = useFlutterwave(config);

  return (
    <Button
      onClick={() =>
        handlePayment({
          callback: (response: FlutterWaveResponse) => {
            console.log(response);
            closePaymentModal(); // this will close the modal programmatically
          },
          onClose: () => console.log("Modal Closed"),
        })
      }
    >
      Pay with Flutterwave
    </Button>
  );
}
