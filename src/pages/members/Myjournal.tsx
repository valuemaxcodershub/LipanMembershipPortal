import { useState } from "react";
import {
  Button,
  Card,
  Label,
  Modal,
  FileInput,
  TextInput,
} from "flowbite-react";
import {
  HiOutlineDocumentText,
  HiDownload,
  HiEye,
  HiPlus,
  HiUpload,
} from "react-icons/hi";
import { FiFilter } from "react-icons/fi";
import { FileDropzone } from "../../components/UI/FiledropZone";

const sampleJournals = [
  {
    id: 1,
    title: "Literacy Engagement in Rural Areas",
    format: "PDF",
    date: "2024-09-01",
    tags: ["Community", "Literacy"],
  },
  {
    id: 2,
    title: "Teacher Training Impact Report",
    format: "DOCX",
    date: "2024-07-15",
    tags: ["Professional Development"],
  },
];

const allTags = ["All", "Community", "Literacy", "Professional Development"];

const MyJournalPage = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filteredJournals, setFilteredJournals] = useState(sampleJournals);
  const [uploadedFile, setUploadedFile] = useState<File[] | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    if (tag === "All") {
      setFilteredJournals(sampleJournals);
    } else {
      setFilteredJournals(
        sampleJournals.filter((journal) => journal.tags.includes(tag))
      );
    }
  };

  const parseTags = (input: string) => {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  };

  const handleFiles = (files: FileList | File[] |  null) => {
    if (files) {
      console.log("Selected files:", Array.from(files));
      setUploadedFile(Array.from(files));
    }
  };

  return (
    <div className="max-w- mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            My Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Access, upload, and manage your professional journals and activity
            documents.
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} color="blue">
          <HiPlus className="mr-2" /> Upload Journal
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
          Filter by Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`px-3 py-1 rounded-full border text-sm transition-all ${
                selectedTag === tag
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[200px]">
        {filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJournals.map((journal) => (
              <Card
                key={journal.id}
                className="shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {journal.title}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {journal.format}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded: {journal.date}
                </p>
                <div className="flex gap-2 mt-2">
                  {journal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" color="light">
                    <HiEye className="mr-1" /> View
                  </Button>
                  <Button size="sm" color="gray">
                    <HiDownload className="mr-1" /> Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <HiOutlineDocumentText className="mx-auto text-4xl mb-2" />
            <p className="text-lg font-medium">
              No journals found for selected tag.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Journal Guidelines
        </h2>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1">
          <li>Only upload PDF or Word documents up to 10MB.</li>
          <li>Ensure your content is original and appropriate.</li>
          <li>Tag your journals properly to enhance discoverability.</li>
          <li>Use this page as your professional portfolio of works.</li>
        </ul>
      </div>

      {/* Upload Modal */}
      <Modal
        show={uploadModalOpen}
           onClose={() => setUploadModalOpen(false)}
        size="2xl"
        position="center"
      >
        <Modal.Header>Upload New Journal</Modal.Header>
        <Modal.Body>
          <form className="space-y-5">
            <div>
              <Label htmlFor="title" value="Journal Title" />
              <TextInput id="title" required placeholder="Enter title" />
            </div>
            <div>
              <Label htmlFor="tags" value="Tags (comma separated)" />
              <TextInput
                id="tags"
                placeholder="e.g. Literacy, Training"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
            <FileDropzone onFilesSelected={handleFiles}/>
            {uploadedFile && uploadedFile.length > 0 && (
            <ul className="space-y-2">
               {uploadedFile.map((file) => (
                 <li
                    key={file.name}
                    className="flex flex-wrap items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                 >
                    <div className="flex items-center">
                      <HiUpload className="mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                         {file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 md:mt-0 md:ml-2">
                      {file.size < 1_000_000
                         ? `${Math.floor(file.size / 1_000)} KB`
                         : `${(file.size / 1_000_000).toFixed(2)} MB`}
                    </span>
                 </li>
               ))}
            </ul>
            )}
            <Button type="submit" color="blue" className="w-full">
              Upload Journal
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyJournalPage;
