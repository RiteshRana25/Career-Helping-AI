"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState(""); // Store the user input (skills or languages)
  const [languages, setLanguages] = useState([]); // Store the skills/languages array
  const [jobType, setJobType] = useState("fullTime"); // Store selected job type
  const [onsiteRemote, setOnsiteRemote] = useState(""); // Store selected onsiteRemote

  // Handle the change in the input field
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle change in job type select
  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  // Handle change in onsiteRemote select
  const handleOnsiteRemoteChange = (e) => {
    setOnsiteRemote(e.target.value);
  };

  // Convert the comma-separated string to an array of languages
  const handleSearchClick = () => {
    const enteredLanguages = searchQuery.split(",").map((item) => item.trim());
    setLanguages(enteredLanguages);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (languages.length === 0) return; // Don't fetch jobs if no languages are provided

      try {
        setLoading(true);
        let allJobs = [];

        // Loop through each language and make an API request
        for (let language of languages) {
          const response = await axios.get(
            "https://linkedin-data-api.p.rapidapi.com/search-jobs-v2",
            {
              params: {
                keywords: language, // Search for the language
                locationId: "102713980",
                datePosted: "pastWeek",
                jobType: jobType, // Pass the selected job type
                onsiteRemote: onsiteRemote, // Pass the selected onsiteRemote value
                sort: "mostRelevant",
              },
              headers: {
                "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
                "x-rapidapi-key":
                  "cb6eff14f1mshf2f6b4d6a3eb602p127547jsnd3ff44ebaba2",
              },
            }
          );

          allJobs = [...allJobs, ...response.data.data];
        }

        setJobs(allJobs);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [languages, jobType, onsiteRemote]); // Fetch jobs when `languages`, `jobType`, or `onsiteRemote` changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-lg font-semibold text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-red-500 text-lg font-semibold">
          Error loading jobs: {error.message}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="container mx-auto p-6 bg-black text-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-semibold text-center mb-6 text-gray-100 hover:text-white transition-colors duration-300">
        Recommended Jobs based on your skills
      </h1>

      <div className="mb-6">
        <label
          htmlFor="skills-input"
          className="block text-lg font-medium text-gray-300 mb-2"
        >
          Enter Skills or Languages (separate by commas)
        </label>
        <input
          type="text"
          id="skills-input"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="e.g., React, Python, Java"
        />
      </div>

      <div className="mb-6">
        {/* Job Type Select */}
        <label
          htmlFor="job-type"
          className="block text-lg font-medium text-gray-300 mb-2"
        >
          Select Job Type
        </label>
        <select
          id="job-type"
          value={jobType}
          onChange={handleJobTypeChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="fullTime">Full-time</option>
          <option value="partTime">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      <div className="mb-6">
        {/* Onsite/Remote Select */}
        <label
          htmlFor="onsite-remote"
          className="block text-lg font-medium text-gray-300 mb-2"
        >
          Select Onsite/Remote Type
        </label>
        <select
          id="onsite-remote"
          value={onsiteRemote}
          onChange={handleOnsiteRemoteChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="" hidden disabled>Select</option>
          <option value="onSite">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <button
          onClick={handleSearchClick}
          className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
        >
          Search
        </button>
      </div>

      <div className="space-y-6">
        {Array.isArray(currentJobs) && currentJobs.length > 0 ? (
          currentJobs.map((job, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex-shrink-0">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-200 hover:text-white transition-colors duration-300">
                  {job.title}
                </h3>
                <p className="text-gray-300">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-300">
                  <strong>Company:</strong> {job.company.name}
                </p>
                <p className="text-gray-300">
                  <strong>Posted:</strong> {formatDate(job.postAt)}
                </p>
              </div>
              <div className="flex justify-between mt-4 md:mt-0 space-x-4">
                <a
                  href={job.company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  View Company Profile
                </a>
                <div className="space-x-4">
                  <button
                    onClick={() => window.open(job.url, "_blank")}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-300">No jobs found</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        {currentPage > 1 && (
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => paginate(currentPage - 1)}
          >
            Prev
          </button>
        )}

        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
