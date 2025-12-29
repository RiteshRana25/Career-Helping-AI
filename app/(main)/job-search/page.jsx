"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search filters
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("India");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [seniority, setSeniority] = useState("Entry level");

  const fetchJobs = async () => {
    if (!title) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h",
        {
          params: {
            limit: 20,
            offset: 0,
            title_filter: title,
            location_filter: location,
            type_filter: jobType,
            remote: remoteOnly,
            seniority_filter: seniority,
            description_type: "text",
          },
          headers: {
            "x-rapidapi-host":
              "linkedin-job-search-api.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          },
        }
      );

      console.log("API RESPONSE:", response.data);
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("API ERROR:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Search Jobs</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <select
          value={seniority}
          onChange={(e) => setSeniority(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="Entry level">Entry level</option>
          <option value="Associate">Associate</option>
          <option value="Mid-Senior level">Mid-Senior level</option>
          <option value="Director">Director</option>
          <option value="Executive">Executive</option>
          <option value="Not Applicable">Not Applicable</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
          />
          Remote Only
        </label>

        <Button onClick={fetchJobs}>Search</Button>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Jobs List */}
      <div className="space-y-6">
        {jobs.length === 0 && !loading ? (
          <p className="text-gray-400">No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row gap-4"
            >
              {job.organization_logo && (
                <img
                  src={job.organization_logo}
                  alt={job.organization}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>{job.organization || "Company N/A"}</p>
                <p>{job.locations_derived?.[0] || "Location N/A"}</p>
                <p>Posted: {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "N/A"}</p>
                {job.remote_derived && (
                  <span className="inline-block mt-2 text-sm bg-green-700 px-3 py-1 rounded">
                    Remote
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {job.organization_url && (
                  <a
                    href={job.organization_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Company
                  </a>
                )}
                <button
                  onClick={() => window.open(job.url, "_blank")}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobSearch;
