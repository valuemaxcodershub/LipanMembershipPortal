import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Modal,
  Badge,
  ToggleSwitch,
  Checkbox,
  Dropdown,
} from "flowbite-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import Switch from "../../components/UI/Switch";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";
import MultiSelect from "../../components/UI/MultiSelect";
import { HiMenu, HiPencil, HiTrash } from "react-icons/hi";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { formatDate } from "../../utils/app/time";

// Define event schema with featured field
const eventSchema = yup.object().shape({
  // image: yup.string(),
  title: yup.string().required("Event title is required"),
  location: yup.string().required("Event location is required"),
  description: yup.string().required("Description is required"),
  date: yup.string().required("Date is required"),
  tags: yup.array().of(yup.string().required("Tag cannot be empty")),
  allowed_memberships: yup
    .array()
    .required("Allowed memberships cannot be empty")
    .min(1, "At least one membership is required"),
  is_featured: yup.boolean(),
});

type EventsSchemaType = yup.InferType<typeof eventSchema>;

interface Event {
  id: number;
  // image: string;
  title: string;
  location: string;
  description: string;
  date: string;
  tags: string[];
  allowed_memberships: number[];
  is_featured: boolean;
}

export default function AdminEventsPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventsSchemaType>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      // image: "",
      tags: [""],
      allowed_memberships: [],
      is_featured: false,
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags" as never,
  });

  const [events, setEvents] = useState<Partial<Event>[]>([]);
  const [memberships, setMemberships] = useState([]);
  const [creationType, setCreationType] = useState("create");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value).toISOString().slice(0, 16);
    console.log(date);
    setValue("date", date);
  };

  const getEvents = async () => {
    setIsFetching(true);
    try {
      const [eventsResponse, membershipResponse] = await Promise.all([
        axios.get("/admin/events/"),
        axios.get("/membership/"),
      ]);
      setEvents(eventsResponse.data.results || []);
      setMemberships(
        (membershipResponse.data.results || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (formdata: EventsSchemaType) => {
    console.log("Form Data:", formdata);
    console.log("Processed Data:", formdata); // Debugging log

    if (creationType === "create") {
      await submit(formdata);
    } else {
      await handleEdit(formdata);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const intializeAction = (index: number, type: string) => {
    setSelectedIndex(index);
    if (type === "delete") {
      setOpenConfirmModal(true);
    }
    if (type === "edit") {
      setCreationType("edit");
      const event = events[index];

      // Format the date for the datetime-local input
      const formattedDate = new Date(event.date as string)
        .toISOString()
        .slice(0, 16);

      reset({
        // image: event.image,
        title: event.title,
        location: event.location,
        description: event.description,
        date: formattedDate, // Use the formatted date
        tags: event.tags || [""],
        allowed_memberships: event.allowed_memberships || [],
        is_featured: event.is_featured || false,
      });
      setOpenModal(true);
    }
  };

  const handleDelete = async () => {
    if (selectedIndex !== null) {
      setIsLoading(true);
      try {
        await axios.delete(`/admin/events/${events[selectedIndex].id}/`);
        toast.success("Event deleted successfully!");
        getEvents();
      } catch (err: any) {
        console.error("Error deleting event:", err);
        toast.error(err.message || "Failed to delete event.");
      } finally {
        setOpenConfirmModal(false);
        setIsLoading(false);
        setSelectedIndex(null);
      }
    }
  };

  const handleEdit = async (Data: EventsSchemaType) => {
    if (selectedIndex !== null) {
      try {
        await axios.put(`/admin/events/${events[selectedIndex].id}/`, Data);
        toast.success("Event updated successfully!");
        getEvents();
        setOpenModal(false);
        setCreationType("create");
        reset();
      } catch (err: any) {
        console.error("Error updating event:", err);
        toast.error(err.message || "Failed to update event.");
      } finally {
        setSelectedIndex(null);
      }
    }
  };

  const submit = async (Data: EventsSchemaType) => {
    try {
      await axios.post("/admin/events/", Data);
      toast.success("Event created successfully!");
      getEvents();
      reset();
      setOpenModal(false);
    } catch (err: any) {
      console.error("Error creating event:", err);
      toast.error(
        err.response.data.detail || err.message || "Failed to create event."
      );
    }
  };

  const filteredEvents = filterFeatured
    ? events.filter((event) => event.is_featured)
    : events;

  return (
    <div className="mx-auto max-w-6xl p-4 text-gray-800 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button
          color="blue"
          disabled={isFetching}
          onClick={() => {
            reset();
            setCreationType("create");
            setOpenModal(true);
          }}
        >
          + Create Event
        </Button>
      </div>

      {/* Filter Toggle for Featured Events */}
      <div className="mb-4 flex items-center gap-4">
        <Switch
          disabled={isFetching}
          checked={filterFeatured}
          onChange={setFilterFeatured}
          label="Show Featured Events Only"
        />
      </div>

      <Modal
        show={openModal}
        onClose={() => {
          if (!isSubmitting) {
            setCreationType("create");
            reset();
            setOpenModal(false);
          }
        }}
        size="2xl"
      >
        <Modal.Header>
          {creationType === "create" ? "Create New Event" : "Editing Event..."}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" value="Event Name" />
              <TextInput
                id="name"
                disabled={isSubmitting}
                {...register("title")}
                color={errors.title ? "failure" : undefined}
                helperText={errors.title?.message}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <Label htmlFor="location" value="Event Location" />
              <TextInput
                id="location"
                disabled={isSubmitting}
                {...register("location")}
                color={errors.location ? "failure" : undefined}
                helperText={errors.location?.message}
                placeholder="Enter event Location"
              />
            </div>

            <div>
              <Label htmlFor="date" value="Event Date & Time" />
              <TextInput
                id="date"
                disabled={isSubmitting}
                type="datetime-local"
                defaultValue={watch("date")}
                onChange={handleDateChange}
                min={new Date().toISOString().slice(0, 16)}
                color={errors.date ? "failure" : undefined}
                helperText={errors.date?.message}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                disabled={isSubmitting}
                rows={5}
                {...register("description")}
                color={errors.description ? "failure" : undefined}
                helperText={errors.description?.message}
              />
            </div>

            <div>
              <Label value="Event Tags" />
              {tagFields.map((field, index) => (
                <div key={field.id} className="mb-2 flex gap-2">
                  <TextInput
                    {...register(`tags.${index}`)}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button
                    color="failure"
                    disabled={isSubmitting}
                    size="sm"
                    type="button"
                    onClick={() => removeTag(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.tags && (
                <p className="text-sm text-red-500">
                  {errors.tags.message || errors.tags[0]?.message}
                </p>
              )}

              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => appendTag("")}
                size="sm"
                className="mt-2"
                color="blue"
              >
                + Add Tag
              </Button>
            </div>

            <div>
              <Label value="Allowed Memberships" />
              <MultiSelect<any>
                labelKey="label"
                valueKey="value"
                options={memberships}
                selected={(watch("allowed_memberships") || [])
                  .map((key: string) =>
                    memberships.find(
                      (membership: { value: string; label: string }) =>
                        membership.value === key
                    )
                  )
                  .filter((membership) => !!membership)}
                onChange={(selected) => {
                  const selectedValues = selected.map((item: any) =>
                    Number(item.value)
                  );
                  setValue("allowed_memberships", selectedValues);
                }}
              />
              {errors.allowed_memberships && (
                <p className="text-sm text-red-500">
                  {errors.allowed_memberships.message}
                </p>
              )}
            </div>

            <div className="space-x-3">
              <Checkbox
                id="is_featured"
                disabled={isSubmitting}
                className="size-6"
                {...register("is_featured")}
                color={errors.is_featured ? "failure" : undefined}
              />
              <Label
                htmlFor="is_featured"
                value="Mark this event as featured"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                color={creationType === "create" ? "blue" : "warning"}
                disabled={isSubmitting}
                isProcessing={isSubmitting}
              >
                {creationType === "create" ? "Create Event" : "Update Event"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {isFetching ? (
          <>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card
                key={idx}
                className="bg-white dark:bg-gray-800 shadow-md text-center"
              >
                <Skeleton className="rounded-md h-6 w-full" />
                <Skeleton className="rounded-md h-6 w-6/12 mx-auto" />
                <Skeleton className="rounded-md h-6 w-10/12 mx-auto" />
                <Skeleton className="rounded-md h-6 w-9/12 mx-auto" />

                <div className="mt-3 flex items-center gap-3 justify-center">
                  <Skeleton className="rounded-md h-5 w-9" />
                  <Skeleton className="rounded-md h-5 w-9" />
                  <Skeleton className="rounded-md h-5 w-9" />
                </div>
              </Card>
            ))}
          </>
        ) : filteredEvents.length ? (
          <>
            {filteredEvents.map((event, idx) => (
              <Card
                key={idx}
                className="bg-white dark:bg-gray-800 shadow-md relative"
              >
                {event.is_featured && (
                  <Badge
                    color="warning"
                    className="absolute -top-1 -left-1 text-xs"
                  >
                    ⭐ Featured
                  </Badge>
                )}
                <div className="absolute cursor-pointer top-2 right-2 p-2 rounded-md border border-white/30">
                  <Dropdown
                    label=""
                    dismissOnClick
                    renderTrigger={() => <HiMenu className="text-lg" />}
                    placement="left"
                  >
                    <Dropdown.Item onClick={() => intializeAction(idx, "edit")}>
                      <HiPencil className="mr-2 h-6 text-md text-yellow-300" />{" "}
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => intializeAction(idx, "delete")}
                    >
                      <HiTrash className="mr-2 h-6 text-md text-[#ff0000]" />{" "}
                      Delete
                    </Dropdown.Item>
                  </Dropdown>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                  {event.title}
                </h3>
                <h2 className="text-md font-semibold text-blue-500 dark:text-blue-100">
                  {event.location}
                </h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {event.description}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  📅 {formatDate(event.date as string)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.tags?.map((tag, tIdx) => (
                    <Badge key={tIdx} color="info" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="bg-white col-span-1 lg:col-span-2 xl:col-span-3 dark:bg-gray-800 shadow-md text-center p-6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No Events Found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Create your first event to get started!
              </p>
            </Card>
          </>
        )}
      </div>

      <ConfirmationModal
        open={openConfirmModal}
        onClose={() => !isloading && setOpenConfirmModal(false)}
        loading={isloading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
