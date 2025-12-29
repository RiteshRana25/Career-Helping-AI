"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");

  const handleInputChange = (e) => setSearchQuery(e.target.value);
  const handleJobTypeChange = (e) => setJobType(e.target.value);

  const handleSearchClick = () => {
    fetchJobs();
  };

  const fetchJobs = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h",
        {
          params: {
            limit: 20,
            offset: 0,
            title_filter: searchQuery,
            location_filter: "india",
            type_filter: jobType,
            description_type: "text",
          },
          headers: {
            "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          },
        }
      );

      console.log("API Response:", response.data);

      // Make sure `data` exists
      if (response.data && Array.isArray(response.data.data)) {
        setJobs(response.data.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl mb-4">Job Search</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter job title"
          value={searchQuery}
          onChange={handleInputChange}
          className="p-2 rounded bg-gray-700 text-white w-full mb-2"
        />
        <select
          value={jobType}
          onChange={handleJobTypeChange}
          className="p-2 rounded bg-gray-700 text-white w-full mb-2"
        >
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <button
          onClick={handleSearchClick}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          Search
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-800 p-4 rounded mb-4 flex flex-col md:flex-row gap-4"
          >
            {job.organization_logo && (
              <img
                src={job.organization_logo}
                alt={job.organization || "Company Logo"}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.organization || "Company N/A"}</p>
              <p>{job.locations_derived?.[0] || "Location N/A"}</p>
              <p>
                Posted:{" "}
                {job.date_posted
                  ? new Date(job.date_posted).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <a
                href={job.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                Apply
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobSearch;
