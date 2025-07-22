export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  permissions: any[];
}

export type Transaction = {
  id: string;
  amount: string;
  created_at: string;
  description: string;
  payment_method: string;
  status: string;
  subscriber: number;
  total: string;
  transaction_id: string;
  transaction_ref: string;
};
