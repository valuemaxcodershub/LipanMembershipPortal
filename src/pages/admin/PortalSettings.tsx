import { useState } from "react";
import {
  Button,
  Card,
  Label,
     TextInput,
  getTheme
} from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";
import Switch from "../../components/UI/Switch";

function PortalSettingsPage() {
     console.log(getTheme());
  const [settings, setSettings] = useState({
    allowRegistration: true,
    allowContactAdmin: true,
    allowJournalUpload: true,
    requireJournalApproval: false,
  });

  const [areasOfInterest, setAreasOfInterest] = useState([
    "Literacy Development",
    "Educational Technology",
  ]);

  const [newArea, setNewArea] = useState("");

  const [levels, setLevels] = useState(["Beginner", "Intermediate"]);
  const [newLevel, setNewLevel] = useState("");

  type SettingsKey = keyof typeof settings;

  const handleToggle = (key: SettingsKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = (type: string) => {
    if (type === "area" && newArea.trim()) {
      setAreasOfInterest([...areasOfInterest, newArea.trim()]);
      setNewArea("");
    }
    if (type === "level" && newLevel.trim()) {
      setLevels([...levels, newLevel.trim()]);
      setNewLevel("");
    }
  };

  return (
    <div>
      <div className=" space-y-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <HiOutlineCog className="text-blue-600 dark:text-blue-400" /> Application Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage core app functionality, user registration, journal settings, and customization fields.
          </p>
        </div>

        {/* Registration Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Registration Settings</h2>
          <div className="flex justify-between items-center mt-4">
            <Label htmlFor="allow-registration" className="text-gray-700 dark:text-gray-300">
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Contact Admin Settings</h2>
          <div className="flex justify-between items-center mt-4">
            <Label htmlFor="allow-contact-admin" className="text-gray-700 dark:text-gray-300">
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Journal Settings</h2>
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

        {/* Areas of Interest */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Areas of Interest</h2>
          <div className="mt-4">
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {areasOfInterest.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-4">
              <TextInput
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add new area"
              />
              <Button onClick={() => addItem("area")} color="blue">
                Add
              </Button>
            </div>
          </div>
        </Card>

        {/* Levels of Learners */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Levels of Learners</h2>
          <div className="mt-4">
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              {levels.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-4 flex gap-4">
              <TextInput
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                placeholder="Add new level"
              />
              <Button onClick={() => addItem("level")} color="blue">
                Add
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PortalSettingsPage;
