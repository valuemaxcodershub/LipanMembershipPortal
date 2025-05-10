import { useState } from "react";
import { Card, Button, Label, Select, TextInput, Badge } from "flowbite-react";
import {
  HiOutlineDownload,
  HiOutlineDocumentSearch,
  HiOutlineEye,
} from "react-icons/hi";
import { BsJournalBookmark, BsInfoCircle } from "react-icons/bs";
import { PageMeta } from "../../utils/app/pageMetaValues";

type Resource = {
  id: number;
  title: string;
  type: string;
  author: string;
  date: string;
  fileUrl: string;
  tags: string[];
};

const mockResources: Resource[] = [
  {
    id: 1,
    title: "Understanding Mental Health in Youth",
    type: "Article",
    author: "Dr. Elaine Rivers",
    date: "2025-03-01",
    fileUrl: "#",
    tags: ["Mental Health", "Youth", "Awareness"],
  },
  {
    id: 2,
    title: "Annual Volunteer Impact Journal 2024",
    type: "Journal",
    author: "Community Research Org",
    date: "2024-12-20",
    fileUrl: "#",
    tags: ["Community", "Impact", "Volunteers"],
  },
  {
    id: 3,
    title: "Nutrition & Wellness for Families",
    type: "eBook",
    author: "Healthy Living Institute",
    date: "2025-02-10",
    fileUrl: "#",
    tags: ["Wellness", "Nutrition", "Family Health"],
  },
];

const resourceTypes = ["All", "Article", "Journal", "eBook", "Video"];

const MyResourcesPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = mockResources.filter((res) => {
    const matchType = selectedType === "All" || res.type === selectedType;
    const matchSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
      <PageMeta>
        <title>My Resources | LIPAN</title>
        <meta
          name="description"
          content="Access and explore articles, journals, eBooks, and other resources."
        />
      </PageMeta>
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📚 My Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Here are all the articles, journals, eBooks, and materials you
            currently have access to. Use filters and search to find what you
            need.
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900 border-none">
            <div className="text-blue-800 dark:text-blue-200">
              <BsJournalBookmark className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Total Resources</h4>
              <p className="text-sm">
                You have access to {mockResources.length} resources
              </p>
            </div>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900 border-none">
            <div className="text-green-800 dark:text-green-200">
              <HiOutlineDocumentSearch className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Search & Filter</h4>
              <p className="text-sm">Quickly find the resources you need</p>
            </div>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-900 border-none">
            <div className="text-yellow-800 dark:text-yellow-200">
              <BsInfoCircle className="text-2xl mb-2" />
              <h4 className="text-xl font-bold">Support</h4>
              <p className="text-sm">
                Need help? Visit our FAQ or contact support
              </p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-full md:w-1/3">
            <Label htmlFor="type" value="Filter by Type" />
            <Select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {resourceTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-2/3">
            <Label htmlFor="search" value="Search Resources" />
            <TextInput
              id="search"
              placeholder="Search by title or author"
              icon={HiOutlineDocumentSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Resource Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <Card
                key={res.id}
                className="flex flex-col justify-between h-full shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {res.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {res.type} · {res.date}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    By {res.author}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {res.tags.map((tag) => (
                      <Badge key={tag} color="info" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button color="blue" size="sm" href={res.fileUrl}>
                    <HiOutlineDownload className="mr-2" /> Download
                  </Button>
                  <Button color="gray" size="sm" href={res.fileUrl}>
                    <HiOutlineEye className="mr-2" /> Preview
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500 dark:text-gray-400 py-12">
              <p className="text-lg">No resources match your filter.</p>
            </div>
          )}
        </div>

        {/* Recent Access Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            🕘 Recently Accessed
          </h2>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li>
              ✔️ <strong>"Mental Health in Youth"</strong> downloaded on March
              20, 2025
            </li>
            <li>
              ✔️ <strong>"Volunteer Impact Journal 2024"</strong> previewed on
              March 15, 2025
            </li>
            <li>
              ✔️ <strong>"Wellness for Families"</strong> downloaded on March
              10, 2025
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyResourcesPage;
