import { Modal, Button, Card, Tabs, TabItem } from "flowbite-react";
import { useEffect, useState } from "react";
import { MembershipPlan } from "../../types/_all";
import PaystackPayment from "../../utils/payments/PayStack";
import { UserType } from "../../contexts/createContexts/auth";
import { BsCalendarDay, BsCalendarMonth } from "react-icons/bs";
import axios from "../../config/axios";
import { Skeleton } from "./Skeleton";
import { FaCalendar } from "react-icons/fa";

const keyMap = {
  "0": "month",
  "1": "year",
};

function getPlanDisplayPrice(
  plan: MembershipPlan,
  isRenewal: boolean,
  period: "month" | "year"
) {
  const base = isRenewal
    ? Number(plan.renewal_price != null ? plan.renewal_price : plan.price)
    : Number(plan.price);
  const rounded = Math.round(base);
  return period === "month" ? rounded : rounded * 12;
}

export const MembershipSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (membership: MembershipPlan & { plan: string }) => void;
}) => {
  const [activeTab, setActiveTab] = useState<keyof typeof keyMap>("0");
  const [isFetching, setIsFetching] = useState(true);
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [isRenewal, setIsRenewal] = useState(false);

  const fetchMembership = async () => {
    setIsFetching(true);
    try {
      const [{ data }, membershipRes] = await Promise.all([
        axios.get("/membership/"),
        axios.get("/accounts/user/membership/").catch(() => ({ data: null })),
      ]);

      const renewal =
        !!membershipRes?.data?.subscription_exists &&
        membershipRes?.data?.is_active === false;
      setIsRenewal(renewal);

      const plans = (data.results || []).map((plan: any) => ({
        ...plan,
        price: Math.round(Number(plan.price)),
        renewal_price: Math.round(
          Number(plan.renewal_price != null ? plan.renewal_price : plan.price)
        ),
      }));
      setMemberships(plans);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchMembership();
  }, [isOpen]);

  const period = keyMap[activeTab] as "month" | "year";

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl" position="center">
      <Modal.Header>
        <span className="text-2xl font-bold text-blue-700">
          {isRenewal ? "Renew Your Membership Plan" : "Choose Your Membership Plan"}
        </span>
      </Modal.Header>
      <Modal.Body className="relative">
        {isRenewal && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Your membership has expired. Prices shown are{" "}
            <strong>renewal fees</strong>.
          </p>
        )}
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
            <div className="z-50 overflow-x-auto w-full max-w-[400px] mx-auto sticky top-2">
              <Tabs
                aria-label="Full width tabs"
                style="fullWidth"
                onActiveTabChange={(tab) =>
                  setActiveTab(String(tab) as keyof typeof keyMap)
                }
              >
                {/* <TabItem active title="Monthly" icon={BsCalendarMonth} /> */}
                <TabItem title="Yearly" icon={FaCalendar} />
              </Tabs>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.map((membShip) => {
                const displayPrice = getPlanDisplayPrice(
                  membShip,
                  isRenewal,
                  period
                );
                return (
                  <Card
                    key={membShip.id || membShip.name}
                    className="p-6 shadow-xl border-2 border-blue-100 hover:border-blue-500 transition-all duration-200"
                  >
                    <p className="text-2xl text-blue-600 font-semibold mb-2">
                      &#8358;{displayPrice.toLocaleString()}{" "}
                      <span className="text-sm text-black dark:text-white">
                        /{period}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      {isRenewal ? "Renewal fee" : "Registration fee"}
                    </p>
                    <h3 className="text-xl font-bold text-blue-700">
                      {membShip.name}
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-100 mt-2 list-disc pl-4 h-[100px] max-h-[100px] overflow-y-auto">
                      {membShip.permissions.map((permission, index) => (
                        <li key={index}>{permission.label}</li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold"
                      onClick={() =>
                        onSelect({
                          ...membShip,
                          price: displayPrice,
                          plan: `${period}ly`,
                        })
                      }
                    >
                      {isRenewal ? "Renew Plan" : "Select Plan"}
                    </Button>
                  </Card>
                );
              })}
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
  membership: MembershipPlan & { plan: string };
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
        <Card className="font-mono space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-semibold text-blue-600 mb-2">
              Billed To
            </h2>
            <div className="space-y-1 dark:text-gray-200">
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
            <div className="space-y-1 dark:text-gray-200">
              <p>
                <span className="font-medium">Name:</span> {membership.name}
              </p>
              <p>
                <span className="font-medium">Type:</span> {membership.plan}
              </p>
              <p>
                <span className="font-medium">Amount:</span> ₦
                {membership.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-b">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-500 mb-2">
              Total
            </h2>
            <div className="text-lg font-bold text-blue-600">
              ₦{membership.price.toLocaleString()}
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <PaystackPayment
              amount={membership.price}
              email={userInfo.email}
              name={
                userInfo.full_name ||
                `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() ||
                "Member"
              }
              description={`Payment for LiPAN Membership (${membership.name})`}
              plan={membership.plan}
              membership={membership.id}
            />
          </div>
        </Card>
      </Modal.Body>
    </Modal>
  );
};
