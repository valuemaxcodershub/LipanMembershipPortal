import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserType } from "../contexts/createContexts/auth";

const useProfileCompletionGuard = (
  isOpen: boolean,
  runUserProfileCompletionCheck: () => void,
  user: UserType
) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      pathname.startsWith("/member") &&
      pathname !== "/member/profile" &&
      !["unpaid", "pending"].includes(user?.payment_status as string)
    ) {
      runUserProfileCompletionCheck(); // Initial check immediately

      const id = setInterval(() => {
        console.log("running periodic check...");
        if (!isOpen) {
          runUserProfileCompletionCheck();
          console.log("checked profile completion");
        } else {
          console.log("modal open – skipping check");
        }
      }, 10000); // 10 seconds

      return () => clearInterval(id);
    }
  }, [pathname, isOpen, runUserProfileCompletionCheck]);
};

export default useProfileCompletionGuard;
