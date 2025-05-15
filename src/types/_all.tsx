export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  benefits: string[];
}

export type Transaction = {
  id: string;
  date: string;
  time: string;
  amount: string;
  fee: string;
  total: string;
  paymentMethod: string;
  recipient: string;
  status: string;
  authCode: string;
};
