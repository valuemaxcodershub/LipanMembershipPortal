import { useState } from "react";
import {
  Button,
  Card,
  Label,
  Modal,
  TextInput,
  Select,
  Carousel,
} from "flowbite-react";
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
} from "react-icons/hi";
const upcomingEvents = [
  {
    id: 1,
    name: "Community Volunteer Workshop",
    date: "2025-04-10 09:00 AM",
    location: "Community Center, Main Street",
    tags: ["Workshop", "Volunteer"],
    description:
      "A hands-on workshop for volunteers to learn how to coordinate community service activities effectively.",
      is_featured: true,
  },
  {
    id: 2,
    name: "Tech Innovation Seminar",
    date: "2025-04-15 02:00 PM",
    location: "Zoom Meeting",
    tags: ["Seminar", "Tech"],
    description:
      "Explore the latest in tech innovation and how it's transforming the world.",
      is_featured: false,
  },
  {
    id: 3,
    name: "Leadership Training",
    date: "2025-04-20 10:00 AM",
    location: "Leadership Hall",
    tags: ["Training", "Leadership"],
    description:
      "Develop leadership skills with experts and unlock your true potential.",
      is_featured: true,
  },
];

const eventTags = [
  "All",
  "Workshop",
  "Seminar",
  "Volunteer",
  "Tech",
  "Training",
  "Leadership",
];

const UpcomingEventsPage = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(upcomingEvents);
  const [featuredEvent] = useState(upcomingEvents);

  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof upcomingEvents)[0] | null
  >(null);

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredEvents(upcomingEvents);
    } else {
      setFilteredEvents(
        upcomingEvents.filter((event) => event.tags.includes(tag))
      );
    }
  };

  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    setFilteredEvents(
      upcomingEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(lowercasedSearchTerm) ||
          event.location.toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  };

  const openDetails = (event: (typeof upcomingEvents)[0]) => {
    setSelectedEvent(event);
    setViewDetailsModal(true);
  };

  const openRegister = (event: (typeof upcomingEvents)[0]) => {
    setSelectedEvent(event);
    setRegisterModal(true);
  };

  return (
    <>
      <div className="">
        <div className="pt-6 pb-8 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Upcoming Events
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Explore and register for upcoming events in your area or online.
            </p>
          </div>

          {featuredEvent && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Featured Event
              </h2>
              <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                <Carousel pauseOnHover>
                  {featuredEvent.map((evnt, index) => (
                    <Card key={index} className="bg-blue-100 dark:bg-blue-900 max-w-5xl m-auto">
                      <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                          {evnt.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {evnt.date}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {evnt.location}
                        </p>
                        <div className="flex gap-2 mt-4">
                          {evnt.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          className="mt-6"
                          color="blue"
                          size="md"
                          onClick={() => openDetails(evnt)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </Carousel>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="tag-filter">Filter by Tag</Label>
              <Select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) => handleTagFilter(e.target.value)}
              >
                {eventTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <TextInput
                id="search"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button onClick={handleSearch} color="gray">
                <HiOutlineSearch />
              </Button>
            </div>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {event.date}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.location}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {event.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => openDetails(event)}
                      >
                        <HiOutlineCalendar className="mr-1" /> View Details
                      </Button>
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => openRegister(event)}
                      >
                        <HiOutlineLocationMarker className="mr-1" /> Register
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12 col-span-full">
                <p className="text-lg font-medium">
                  No events found for the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal show={viewDetailsModal} onClose={() => setViewDetailsModal(false)}>
        <Modal.Header>{selectedEvent?.name}</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <p>
              <strong>Date:</strong> {selectedEvent?.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent?.location}
            </p>
            <p>
              <strong>Tags:</strong> {selectedEvent?.tags.join(", ")}
            </p>
            <p>
              <strong>Description:</strong>
            </p>
            <p>{selectedEvent?.description}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setViewDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Register Modal */}
      <Modal show={registerModal} onClose={() => setRegisterModal(false)}>
        <Modal.Header>Register for {selectedEvent?.name}</Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <TextInput
                id="name"
                type="text"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <TextInput
                id="notes"
                type="text"
                placeholder="Anything you'd like us to know?"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  // Placeholder for submission logic
                  setRegisterModal(false);
                }}
              >
                Submit
              </Button>
              <Button color="gray" onClick={() => setRegisterModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpcomingEventsPage;
