import { useState, useEffect } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";
import Switch from "../../components/UI/Switch";
import { Skeleton } from "../../components/UI/Skeleton";
import axios from "../../config/axios";
import { Id, toast } from "react-toastify";

function PortalSettingsPage() {
  const [settings, setSettings] = useState({
    allowRegistration: true,
    allowContactAdmin: true,
    allowJournalUpload: true,
    requireJournalApproval: false,
  });

  const [areasOfInterest, setAreasOfInterest] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [newArea, setNewArea] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  type SettingsKey = keyof typeof settings;

  const handleToggle = (key: SettingsKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = async (type: string) => {
    let toastId;
    try {
      if (type === "interest" && newArea.trim()) {
        toastId = toast.loading("Adding area of interest...", {
          position: "top-center",
        });
        await axios.post("/interests/", {
          name: newArea.trim(),
        });
        setNewArea("");
        toast.update(toastId, {
          render: "Area of interest added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      if (type === "level" && newLevel.trim()) {
        toastId = toast.loading("Adding learning level...", {
          position: "top-center",
        });
        await axios.post("/levels/", { name: newLevel.trim() });
        setNewLevel("");
        toast.update(toastId, {
          render: "Learning level added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
      fetchData();
    } catch (err: any) {
      console.error(err.response);
      toast.update(toastId as Id, {
        render: "Failed to add item. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setNewLevel("");
      setNewArea("");
    }
  };

  const fetchData = async () => {
    setIsFetching(true);
    setError("");
    const toastId = toast.loading("Fetching data...", {
      position: "top-center",
    });
    try {
      const [levelsResponse, interestsResponse] = await Promise.all([
        axios.get("/levels"),
        axios.get("/interests"),
      ]);
      setLevels(levelsResponse.data);
      setAreasOfInterest(interestsResponse.data);
      toast.update(toastId, {
        render: "Data fetched successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to fetch data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isFetching) {
    return (
      <div className="space-y-10">
        <div className="mb-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>

        {/* Areas of Interest */}
        <Card>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Skeleton className="h-10 w-full sm:w-2/3" />
            <Skeleton className="h-10 w-full sm:w-1/3" />
          </div>
        </Card>

        {/* Levels of Learners */}
        <Card>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Skeleton className="h-10 w-full sm:w-2/3" />
            <Skeleton className="h-10 w-full sm:w-1/3" />
          </div>
        </Card>

        {/* Registration Settings */}
        <Card>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-10" />
          </div>
        </Card>

        {/* Contact Admin Settings */}
        <Card>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-10" />
          </div>
        </Card>

        {/* Journal Settings */}
        <Card>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={fetchData} color="blue">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <HiOutlineCog className="text-blue-600 dark:text-blue-400" />{" "}
            Application Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage core app functionality, user registration, journal settings,
            and customization fields.
          </p>
        </div>

        {/* Areas of Interest */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Areas of Interest
          </h2>
          <div className="mt-4 space-y-4">
            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {areasOfInterest.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {item.name}
                </span>
              ))}
            </div>

            {/* Input and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <TextInput
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add a new area of interest"
                className="flex-1"
              />
              <Button
                onClick={() => addItem("interest")}
                color="blue"
                className="w-full sm:w-auto"
              >
                Add Area
              </Button>
            </div>
          </div>
        </Card>

        {/* Levels of Learners */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Levels of Learners
          </h2>
          <div className="mt-4 space-y-4">
            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {levels.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                >
                  {item.name}
                </span>
              ))}
            </div>

            {/* Input and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <TextInput
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                placeholder="Add a new learning level"
                className="flex-1"
              />
              <Button
                onClick={() => addItem("level")}
                color="blue"
                className="w-full sm:w-auto"
              >
                Add Level
              </Button>
            </div>
          </div>
        </Card>

        {/* Registration Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Registration Settings
          </h2>
          <div className="flex justify-between items-center mt-4">
            <Label
              htmlFor="allow-registration"
              className="text-gray-700 dark:text-gray-300"
            >
              Allow New User Registration
            </Label>
            <Switch
              id="allow-registration"
              checked={settings.allowRegistration}
              onChange={() => handleToggle("allowRegistration")}
            />
          </div>
        </Card>

        {/* Contact Admin Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Contact Admin Settings
          </h2>
          <div className="flex justify-between items-center mt-4">
            <Label
              htmlFor="allow-contact-admin"
              className="text-gray-700 dark:text-gray-300"
            >
              Allow Users to Contact Admin
            </Label>
            <Switch
              id="allow-contact-admin"
              checked={settings.allowContactAdmin}
              onChange={() => handleToggle("allowContactAdmin")}
            />
          </div>
        </Card>

        {/* Journal Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Journal Settings
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 dark:text-gray-300">
                Allow Journal Uploads
              </Label>
              <Switch
                checked={settings.allowJournalUpload}
                onChange={() => handleToggle("allowJournalUpload")}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 dark:text-gray-300">
                Require Admin Approval for Journals
              </Label>
              <Switch
                checked={settings.requireJournalApproval}
                onChange={() => handleToggle("requireJournalApproval")}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PortalSettingsPage;
