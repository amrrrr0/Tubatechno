import PaymentSimulatorClient from "./PaymentSimulatorClient";

export function generateStaticParams() {
  return [{ order_id: "preview" }];
}

export default function PaymentSimulatorPage() {
  return <PaymentSimulatorClient />;
}
