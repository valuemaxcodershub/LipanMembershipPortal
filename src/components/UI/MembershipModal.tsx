import { Modal, Button, Card } from "flowbite-react";
import { useState } from "react";
import { MembershipPlan } from "../../types/_all";

const membershipPlans: MembershipPlan[] = [
  {
    type: "Student Member",
    price: "$25/month",
    benefits: [
      "Access to literacy scholars",
      "Access to resources",
      "Reduced membership & conference fees",
      "Participation in literacy projects",
    ],
  },
  {
    type: "Regular Member",
    price: "$50/month",
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
  {
    type: "Institutional Member",
    price: "$200/month",
    benefits: [
      "Collaboration for literacy promotion",
      "Recruit researchers/facilitators from LiPAN",
      "Participate in workshops and conferences",
      "Policy and curricula development",
    ],
  },
];

const MembershipModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="6xl" position="center">
      <Modal.Header>Select Your Membership Plan</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {membershipPlans.map((plan) => (
            <Card key={plan.type} className="p-4 shadow-lg">
              <h3 className="text-xl font-bold">{plan.type}</h3>
              <p className="text-lg text-blue-600 font-semibold">
                {plan.price}
              </p>
              <ul className="text-sm text-gray-700 mt-2 list-disc pl-4 h-[170px] max-h-[170px] overflow-y-auto">
                {plan.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                Pay Now
              </Button>
            </Card>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} color="gray">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MembershipModal;
