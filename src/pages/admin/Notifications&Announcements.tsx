import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
  Textarea,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiBell, FiPlus } from "react-icons/fi";
import { NotificationsSchema, NotificationsType } from "../../schemas/admin";
import axios from "../../config/axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/api/errors";
import { AiFillInfoCircle, AiOutlineSend } from "react-icons/ai";
import { Skeleton } from "../../components/UI/Skeleton";
import MultiSelect from "../../components/UI/MultiSelect";
import SelectableSection from "../../components/UI/SelectionCard";
import { FaBell, FaBellSlash } from "react-icons/fa";

type Notifications = NotificationsType & {
  id: number;
  created_at: string;
};
const NotificationAnnouncementPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [notifications, setNofications] = useState<Notifications[]>([]);
  const [plans, setPlans] = useState([]);
  const [plansMap, setPlansMap] = useState<any>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const search = searchParams.get("search") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<NotificationsType>({
    resolver: yupResolver(NotificationsSchema),
    defaultValues: {
      is_urgent: false,
    },
  });
  const urgent = watch("is_urgent");
  useEffect(() => console.log(urgent), [urgent]);
  const getNotifications = async () => {
    setError("");
    setIsFetching(true);
    try {
      const [notificationsResponse, membershipResponse] = await Promise.all([
        axios.get(`/admin/notifications/?page=${page}&search=${search}`),
        axios.get("/membership/"),
      ]);
      setNofications(notificationsResponse.data.results);
      setPlans(
        membershipResponse.data.results.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
      setPlansMap(
        membershipResponse.data.results.reduce((acc: any, item: any) => {
          acc[item.id] = item.name;
          return acc;
        }, {})
      );
      setIsFetching(false);
    } catch (err) {
      const errorMessage = errorHandler(err);
      setError(errorMessage);
    }
  };

  const toggleModal = () => {
    reset();
    setOpenModal((prev) => !prev);
  };

  const onSendNotification = async (data: NotificationsType) => {
    console.log(data);
    const id = toast.loading("Sending notification...", {
      position: "top-center",
    });
    try {
      const { data: _ } = await axios.post("/admin/notifications/", data); // Replace with your API endpoint
      toast.success("Notification sent successfully!");
      reset();
      toggleModal();
    } catch (err) {
      const errorMessage = errorHandler(err);
      toast.error(errorMessage);
    } finally {
      toast.done(id);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [page, search]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiBell className="text-blue-600 dark:text-blue-400" /> Notifications
        </h1>
        <Button color="blue" onClick={toggleModal}>
          <FiPlus className="mr-2" /> New Notification
        </Button>
      </div>

      {/* Notification Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isFetching ? (
          Array.from({ length: 12 }, (_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 dark:text-white shadow-sm animate-pulse"
            >
              <Skeleton className="h-7 rounded w-full mb-1" />
              <Skeleton className="h-7 rounded w-10/12 mb-1" />
              <Skeleton className="h-7 rounded w-9/12 mb-1" />
            </Card>
          ))
        ) : !notifications.length ? (
          <Card className="bg-white md:col-span-2 lg:cols-span-3 w-full max-w-2xl mx-auto dark:bg-gray-800 dark:text-white shadow-sm">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
              No notifications found.
            </h5>
          </Card>
        ) : (
          notifications.map((notif, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 dark:text-white shadow-sm hover:shadow-md relative"
            >
              {notif.is_urgent && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                  Urgent
                </span>
              )}
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                {notif.subject}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-300 h-[100px] max-h-[100px]">
                {notif.message}
              </p>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                <div>
                  Sent to:{" "}
                  {notif.send_to === "members"
                    ? "members with membership type"
                    : notif.send_to}
                  {notif.membership_types &&
                    notif.membership_types?.length > 0 && (
                      <p className="text-gray-500 dark:text-gray-300 flex flex-wrap gap-1">
                        of{" "}
                        {notif.membership_types?.map((item, idx) => (
                          <span key={idx}>{plansMap[item]}, </span>
                        ))}
                      </p>
                    )}
                </div>
                <p className="mt-3 font-bold">• {notif.created_at}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal for Creating Notification */}
      <Modal
        show={openModal}
        onClose={() => !isSubmitting && toggleModal()}
        size="xl"
      >
        <Modal.Header>Send Notification</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSendNotification)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="send_to" value="Send to" />
              <Select
                id="send_to"
                {...register("send_to")}
                color={errors.send_to ? "failure" : undefined}
                helperText={errors.send_to?.message}
                disabled={isSubmitting}
              >
                <option value="all">All Users</option>
                <option value="members">Members Only</option>
                <option value="admins">Admins Only</option>
              </Select>
            </div>
            {watch("send_to") === "members" && (
              <div>
                <Label htmlFor="membership_type" value="Membership type" />

                <div className="flex items-center gap-2">
                  <MultiSelect
                    labelKey="label"
                    valueKey="value"
                    options={plans}
                    onChange={(selected) => {
                      const selectedValues = selected.map((item: any) =>
                        Number(item.value)
                      );
                      setValue("membership_types", selectedValues);
                    }}
                  />
                  <Tooltip
                    content={
                      <p className="w-max !text-xs">
                        Select the membership types to send the notification to.
                      </p>
                    }
                  >
                    <div className="text-blue-600 ">
                      <AiFillInfoCircle className="text-2xl" />
                    </div>
                  </Tooltip>
                </div>
                {errors.membership_types && (
                  <p className="text-sm text-red-500">
                    {errors.membership_types.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="subject" value="Subject" />
              <TextInput
                id="subject"
                placeholder="Enter notification subject"
                {...register("subject")}
                color={errors.subject ? "failure" : undefined}
                helperText={errors.subject?.message}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="message" value="Message" />
              <Textarea
                id="message"
                rows={4}
                {...register("message")}
                color={errors.message ? "failure" : undefined}
                disabled={isSubmitting}
                placeholder="Write your notification message..."
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label value="Mark urgenence" />

              <SelectableSection
                options={[
                  {
                    id: false,
                    label: "Not urgent",
                    icon: <FaBellSlash className="textblue-600" />,
                  },
                  {
                    id: true,
                    label: "Urgent",
                    icon: <FaBell className="textblue-600" />,
                  },
                ]}
                onChange={(val) => setValue("is_urgent", val as boolean)}
                allowBooleanToggle
                value={urgent}
                renderItem={(item, isSelected) => (
                  <div
                    className={`w-[90px] rounded-md cursor-pointer bg-gray-200 dark:bg-gray-800 p-3 ${isSelected ? "border-2 border-blue-600 !text-blue-600" : "border"}`}
                  >
                    <div
                      className={`text-4xl ${isSelected ? "text-blue-600" : "text-gray-500"} m-auto w-fit`}
                    >
                      {item.icon}
                    </div>
                    <p className="text-xs font-semibold text-center dark:text-gray-200">
                      {item.label}
                    </p>
                  </div>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                disabled={isSubmitting}
                color="gray"
                onClick={() => !isSubmitting && toggleModal()}
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} color="blue" type="submit">
                <AiOutlineSend className="mr-2 h-6" />
                Send
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationAnnouncementPage;
