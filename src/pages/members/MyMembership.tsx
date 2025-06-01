import { Card, Button, Table, Tooltip, Progress } from "flowbite-react";
import { FiArrowUpRight, FiClock, FiCheckCircle, FiInfo } from "react-icons/fi";
import { usePayment } from "../../hooks/payment";
import { motion } from "framer-motion";
import { PageMeta } from "../../utils/app/pageMetaValues";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { formatDate } from "../../utils/app/time";
import { Skeleton } from "../../components/UI/Skeleton";

type DetailsType = {
  membership: {
    id: number;
    name: string;
    benefits: any[];
  } | null;
  membershipStart: string;
  membershipEnd: string;
  isMembershipActive: boolean;
  planType: string;
  transactions: any[];
  membershipProgress: number;
};

const MyMembershipPage = () => {
  // const { openMembershipModal } = usePayment();
  const [isFetching, setIsFetching] = useState(true);
  const [pageDetails, setPageDetails] = useState<DetailsType>({
    membership: null,
    membershipStart: "",
    membershipEnd: "",
    isMembershipActive: false,
    planType: "",
    transactions: [],
    membershipProgress: 0,
  });

  const getMembershipProgress = (membershipStart: string, membershipEnd: string) => {
    const start = new Date(membershipStart).getTime();
    const end = new Date(membershipEnd).getTime();
    const now = Date.now();
  
    if (now <= start) return 0;
    if (now >= end) return 100;
  
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const fetchMembershipDetails = async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get("/accounts/user/membership/");
      // console.log(data)
      setPageDetails({
        membership: data.membership,
        isMembershipActive: data.is_active,
        membershipEnd: data.end_date,
        membershipStart: data.start_date,
        planType: data.plan_type,
        transactions: [data.last_transaction],
        membershipProgress: getMembershipProgress(data.start_date, data.end_date),
      });
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {
    fetchMembershipDetails();
  }, []);

  return (
    <>
      <PageMeta>
        <title>My Membership | LIPAN</title>
        <meta
          name="description"
          content="View and manage your membership details and transaction history."
        />
      </PageMeta>
      <div className="mx-auto dark:bg-gray-900 dark:text-gray-200">
        {isFetching ? (
          <>
            <Skeleton className="h-10 w-4/12 rounded-xl mb-6" />
            <Card>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-3 w-6/12">
                  <Skeleton className="h-10 w-8/12 rounded-xl" />
                  <Skeleton className="h-10 w-5/12 rounded-xl" />
                </div>
                <div className="w-6/12">
                  <Skeleton className="h-14 w-24 rounded-xl justify-self-end" />
                </div>
              </div>
              <Skeleton className="h-10 w-4/12 rounded-xl mt-4" />

              <div className="mt-4 space-y-3">
                <Skeleton className="h-10 w-6/12 rounded-xl" />
                <Skeleton className="h-5 w-full rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {[...Array(4)].map((_, index: number) => (
                  <Skeleton key={index} className="h-12 rounded-xl" />
                ))}
              </div>
            </Card>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              My Membership
            </h1>

            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                      Membership:
                    </h2>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {pageDetails.membership?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                      Plan Type:
                    </h2>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {pageDetails.planType}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      pageDetails.isMembershipActive
                        ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300"
                    }`}
                  >
                    {pageDetails.isMembershipActive ? "Active" : "Expired"}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Expiry Date: {formatDate(pageDetails.membershipEnd)}
              </p>

              {/* Progress Tracker */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Membership Progress
                </p>
                <Progress
                  progress={pageDetails.membershipProgress}
                  color="blue"
                  size="lg"
                  className="dark:bg-gray-700"
                />
              </div>

              {/* Membership Benefits */}
              <h3 className="mt-6 text-lg font-medium">Membership Benefits</h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-4 mt-4"
              >
                {pageDetails.membership?.benefits?.map(
                  (benefit: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <FiCheckCircle className="text-green-500 dark:text-green-300" />
                      <p>{benefit}</p>
                      <Tooltip content="More info" placement="top">
                        <FiInfo className="text-gray-400 dark:text-gray-500 cursor-pointer" />
                      </Tooltip>
                    </div>
                  )
                )}
              </motion.div>

              <div className="mt-6 flex gap-4">
                <Button
                  color="blue"
                  // onClick={openMembershipModal}
                  className="flex items-center gap-2"
                >
                  Upgrade Membership <FiArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Transaction History */}
            {/* <h2 className="mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Transaction History
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Here are your recent transactions related to your membership.
            </p>
            <div className="overflow-hidden overflow-x-auto max-w-full">
              <Table className="mt-4">
                <Table.Head>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {pageDetails.transactions.map((tx) => (
                    <Table.Row
                      key={tx.id}
                      className="bg-white dark:bg-gray-800"
                    >
                      <Table.Cell>{tx.date}</Table.Cell>
                      <Table.Cell>{tx.amount}</Table.Cell>
                      <Table.Cell>
                        {tx.status === "success" ? (
                          <span className="text-green-600 dark:text-green-300 flex items-center gap-2">
                            <FiCheckCircle /> {tx.status}
                          </span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-300 flex items-center gap-2">
                            <FiClock /> Pending
                          </span>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default MyMembershipPage;
