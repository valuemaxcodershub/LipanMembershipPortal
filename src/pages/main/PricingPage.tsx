import { Button, Card } from "flowbite-react";
import { BiBook, BiStar, BiCheckCircle, BiXCircle } from "react-icons/bi";

function PricingPage() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore our literacy platform with flexible plans tailored to your needs. Start for free or go premium for an enhanced experience.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="shadow-lg">
          <div className="flex justify-center items-center text-blue-500 mb-6">
            <BiBook size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Free Plan</h2>
          <p className="text-center text-gray-600 mt-2">
            Perfect for individuals who want to start their literacy journey at no cost.
          </p>
          <div className="mt-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-500" size={20} />
                Access to basic literacy resources
              </li>
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-500" size={20} />
                Community support
              </li>
              <li className="flex items-center gap-2">
                <BiXCircle className="text-red-500" size={20} />
                No premium learning tracks
              </li>
              <li className="flex items-center gap-2">
                <BiXCircle className="text-red-500" size={20} />
                No offline access
              </li>
            </ul>
          </div>
           <div className="mt-8 text-center">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-lg ml-2">/month</span>
          </div>
          <div className="mt-6 text-center">
            <Button color="blue" outline>
              Get Started
            </Button>
          </div>
        </Card>

        {/* Premium Plan */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-center items-center text-white mb-6">
            <BiStar size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center">Premium Plan</h2>
          <p className="text-center mt-2">
            For avid learners who want to unlock the full potential of the platform.
          </p>
          <div className="mt-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-300" size={20} />
                Access to all literacy resources
              </li>
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-300" size={20} />
                Premium learning tracks
              </li>
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-300" size={20} />
                Offline access
              </li>
              <li className="flex items-center gap-2">
                <BiCheckCircle className="text-green-300" size={20} />
                Dedicated support
              </li>
            </ul>
          </div>
          <div className="mt-8 text-center">
            <span className="text-4xl font-bold">$9.99</span>
            <span className="text-lg ml-2">/month</span>
          </div>
          <div className="mt-6 text-center">
            <Button color="light" className="text-gray-900 bg-white hover:bg-gray-100">
              Go Premium
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PricingPage;
