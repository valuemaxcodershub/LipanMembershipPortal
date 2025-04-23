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
  Datepicker,
} from "flowbite-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import Switch from "../../components/UI/Switch";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";

// Define event schema with featured field
const eventSchema = yup.object().shape({
  image: yup.string(),
  title: yup.string().required("Event title is required"),
  location: yup.string().required("Event location is required"),
  description: yup.string().required("Description is required"),
  date: yup.string().required("Date is required"),
  tags: yup.array().of(yup.string().required("Tag cannot be empty")),
  allowed_memberships: yup
    .array()
    .of(yup.string().required("Allowed memberships cannot be empty")),
  is_featured: yup.boolean(), // New field for featured status
});

type EventsSchemaType = yup.InferType<typeof eventSchema>;

interface Event {
  title: string;
  location: string;
  description: string;
  date: string;
  tags: string[];
  allowed_memberships: string[]; // Memberships that can access the event
  is_featured: boolean; // Featured status
}

export default function AdminEventsPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventsSchemaType>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      tags: [""],
      allowed_memberships: [""],
      is_featured: false, // Default value for is_featured
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

  const {
    fields: membershipFields,
    append: appendMembership,
    remove: removeMembership,
  } = useFieldArray({
    control,
    name: "allowed_memberships" as never,
  });

  const [events, setEvents] = useState<Partial<Event>[]>([]);
  const [memberships, setMemberships] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false); // New state for filtering featured events

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long", // e.g., "April"
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Set to false for 24-hour format
    };
    const date = new Date(e.target.value).toLocaleString("en-US", options);
    console.log(date)
    setValue("date", date)
  }

  const getEvents = async () => {
    setIsFetching(true)
      try {
        const { data:membershipData } = await axios.get("/membership/");
        const { data } = await axios.get("/admin/events/");
        console.log("Fetched Events:", data, membershipData); 
        setEvents(data.results);
        setIsFetching(false)
      }catch(err) {
        console.error("Error fetching events:", err);
      }
    }
  const onSubmit = async (formdata: EventsSchemaType) => {
    console.log("Submitted Event:", formdata);
    const Data = {
      ...formdata,
      image: formdata.image ? formdata.image[0] : null,
    }
    try {
      const { data } = await axios.post("/admin/events/", Data);
      // console.log("Created Event:", data);
      toast.success("Event created successfully!");
      getEvents()
      reset(); // Reset the form after successful submission
      setOpenModal(false); // Close the modal
    } catch (err: any) {
      console.error("Error creating event:", err);
      toast.error(err.message || "Failed to create event.");
    }
  };

  useEffect(()=>{
   getEvents()
  }, [])

  // Filtered events based on "Featured" toggle
  const filteredEvents = filterFeatured
    ? events.filter((event) => event.is_featured)
    : events;

  return (
    <div className="mx-auto max-w-6xl p-4 text-gray-800 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button onClick={() => setOpenModal(true)}>+ Create Event</Button>
      </div>

      {/* Filter Toggle for Featured Events */}
      <div className="mb-4 flex items-center gap-4">
        <Switch
          checked={filterFeatured}
          onChange={setFilterFeatured}
          label="Show Featured Events Only"
        />
      </div>

      <Modal
        show={openModal}
        onClose={() => !isSubmitting && setOpenModal(false)}
        size="2xl"
      >
        <Modal.Header>Create New Event</Modal.Header>
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
                onChange={handleDateChange}
                // Disable past dates and Time
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
              >
                + Add Tag
              </Button>
            </div>

            <div>
              <Label value="Allowed Memberships" />
              {membershipFields.map((field, index) => (
                <div key={field.id} className="mb-2 flex gap-2">
                  <TextInput
                    {...register(`allowed_memberships.${index}`)}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button
                    color="failure"
                    disabled={isSubmitting}
                    size="sm"
                    type="button"
                    onClick={() => removeMembership(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.allowed_memberships && (
                <p className="text-sm text-red-500">
                  {errors.allowed_memberships.message ||
                    errors.allowed_memberships[0]?.message}
                </p>
              )}
              <div>
                <select
                  className="mt-2 p-2 border rounded"
                  onChange={(e) => {
                    const selectedMembership = e.target.value;
                    if (selectedMembership) {
                      appendMembership(selectedMembership);
                      e.target.value = ""; // Reset the dropdown
                    }
                  }}
                >
                  <option value="">Select Membership</option>
                  {["Gold", "Silver", "Bronze"].map(
                    (membership) =>
                      !membershipFields.some(
                        (field) => field.value === membership
                      ) && (
                        <option key={membership} value={membership}>
                          {membership}
                        </option>
                      )
                  )}
                </select>
              </div>
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
              <Button type="submit" disabled={isSubmitting}>
                Save Event
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
                <Skeleton className="rounded-md h-6 w-12/12" />
                <Skeleton className="rounded-md h-6 w-6/12" />
                <Skeleton className="rounded-md h-6 w-10/12" />
                <Skeleton className="rounded-md h-6 w-9/12" />

                <div className="mt-3 flex items-center gap-3">
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
                    className="absolute -top-1 -right-1 text-xs"
                  >
                    ⭐ Featured
                  </Badge>
                )}
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
                  📅 {event.date}
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
            <Card className="bg-white dark:bg-gray-800 shadow-md text-center p-6">
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
    </div>
  );
}
