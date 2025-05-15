import { Modal, Button, Card, Tabs, TabItem } from "flowbite-react";
import { useEffect, useState } from "react";
import { MembershipPlan } from "../../types/_all";
import FlutterWavePayment from "../../utils/payments/Flutterwave";
import PaystackPayment from "../../utils/payments/PayStack";
import { UserType } from "../../contexts/createContexts/auth";
import { BsCalendarDay, BsCalendarMonth } from "react-icons/bs";
import axios from "../../config/axios";
import { Skeleton } from "./Skeleton";

const membershipPlans: MembershipPlan[] = [
  {
    id: 56,
    name: "Student Member",
    price: 25,
    benefits: [
      "Access to literacy scholars",
      "Access to resources",
      "Reduced membership & conference fees",
      "Participation in literacy projects",
    ],
  },
  {
    id: 67,
    name: "Regular Member",
    price: 50,
    benefits: [
      "Personal development",
      "Conference attendance",
      "Community engagement",
      "Research and professional development",
      "Access to LiPAN publications",
      "Funding announcements",
      "Literacy advocacy",
    ],
  },
];

const keyMap = {
  "0": "month",
  "1": "year",
};

export const MembershipSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plan: MembershipPlan) => void;
}) => {
  const [activeTab, setActiveTab] = useState<keyof typeof keyMap>("0");
  const [isFetching, setIsFetching] = useState(true);
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [membershipsFilter, setMembershipsFilter] = useState<MembershipPlan[]>(
    []
  );

  const fetchMembership = async () => {
    setIsFetching(true)
    try {
      const { data } = await axios.get("/membership/");
      const plans = data.results.map((plan: any) => ({
        ...plan,
        price: Math.round(Number(plan.price)),
      }));
      setMemberships(plans);
      setMembershipsFilter(plans);
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  useEffect(() => {
    if (!memberships.length) return;
    setMembershipsFilter(memberships);
    setMembershipsFilter((prev) =>
      prev.map((plan) => ({
        ...plan,
        price: keyMap[activeTab] === "month" ? plan.price : plan.price * 12,
      }))
    );
  }, [activeTab]);

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl" position="center">
      <Modal.Header>
        <span className="text-2xl font-bold text-blue-700">
          Choose Your Membership Plan
        </span>
      </Modal.Header>
      <Modal.Body className="relative">
        {isFetching ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full my-4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="p-4 space-y-2 mt-2">
                <Skeleton className="h-2 w-4/4" />
                <Skeleton className="h-2 w-2/4" />
                <Skeleton className="h-2 w-3/4" />
              </div>
            </Card>
          ))}
          </div>
        ) : (
          <>
            {" "}
            <div className="z-50 overflow-x-auto w-full max-w-[300px] mx-auto sticky top-2">
              <Tabs
                aria-label="Full width tabs"
                style="fullWidth"
                onActiveTabChange={(tab) =>
                  setActiveTab(String(tab) as keyof typeof keyMap)
                }
              >
                <TabItem active title="Monthly" icon={BsCalendarDay} />
                <TabItem title="Yearly" icon={BsCalendarMonth} />
              </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipsFilter.map((plan) => (
                <Card
                  key={plan.name}
                  className="p-6 shadow-xl border-2 border-blue-100 hover:border-blue-500 transition-all duration-200"
                >
                  <p className="text-2xl text-blue-600 font-semibold mb-2">
                    &#8358;{plan.price}{" "}
                    <span className="text-sm text-black dark:text-white">
                      /{keyMap[activeTab]}
                    </span>
                  </p>
                  <h3 className="text-xl font-bold text-blue-700">
                    {plan.name}
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-100 mt-2 list-disc pl-4 h-[100px] max-h-[100px] overflow-y-auto">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold"
                    onClick={() => onSelect(plan)}
                  >
                    Select Plan
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export const PaymentModal = ({
  isOpen,
  onClose,
  membership,
  userInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  membership: MembershipPlan | null;
  userInfo: UserType;
}) => {
  if (!membership) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="lg" position="center">
      <Modal.Header>
        <span className="text-xl font-bold text-blue-700">
          Membership Payment Receipt
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="bg-white border rounded-lg p-6 shadow-md font-mono text-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-semibold text-blue-600 mb-2">
              Billed To
            </h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Full Name:</span>{" "}
                {userInfo.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {userInfo.email}
              </p>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-base font-semibold text-blue-600 mb-2">
              Membership Details
            </h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Type:</span> {membership.name}
              </p>
              <p>
                <span className="font-medium">Amount:</span> ₦
                {membership.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-b">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Total
            </h2>
            <div className="text-lg font-bold text-blue-600">
              ₦{membership.price.toLocaleString()}
            </div>
          </div>

          <div className="pt-6 space-y-4">
            {/* <FlutterWavePayment
              amount={membership.price}
              email={userInfo.email}
              name={userInfo.full_name}
              membershipType={membership.name}
            /> */}
            <PaystackPayment
              amount={membership.price}
              email={userInfo.email}
              name={userInfo.full_name}
              description={`Payment for LiPAN Membership (${membership.name})`}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
