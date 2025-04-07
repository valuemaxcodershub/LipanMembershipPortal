import { FlutterwaveConfig, FlutterWaveProps } from "flutterwave-react-v3/dist/types";

type ConfigProps = Partial<FlutterwaveConfig>;
type DefaultCustomizationsType = FlutterWaveProps['customizations']

const flwPublicKey: string = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const defaultCustomizations: DefaultCustomizationsType = {
  title: "Lipan Literracy Payment",
  description: "Lipan Payment",
  logo: `${import.meta.env.VITE_APP_DOMAIN}/icon-logo.png`,
};


function getFlutterConfig({
  public_key = flwPublicKey,
  currency = "NGN",
  payment_options = "card,mobilemoney,ussd",
  customizations = defaultCustomizations,
  tx_ref = Date.now().toString(),
  ...otherConfig
}: ConfigProps) {
  const flutterwaveConfig = {
    public_key,
    tx_ref,
    currency,
    payment_options,
    customizations,
    ...otherConfig,
  };
  return flutterwaveConfig;
}

export { defaultCustomizations, getFlutterConfig };
