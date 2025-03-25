"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(20); // Number of jobs per page

  // Define the array of languages you want to search for
  const languages = ["react", "python", "javascript", "java"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Initialize an empty array to store all the job results
        let allJobs = [];

        // Loop through each language and make an API request
        for (let language of languages) {
          const response = await axios.get(
            "https://linkedin-data-api.p.rapidapi.com/search-jobs-v2",
            {
              params: {
                keywords: language, // Search for a specific language
                locationId: "102713980",
                datePosted: "pastWeek",
                jobType: "fullTime",
                sort: "mostRelevant",
              },
              headers: {
                "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
                "x-rapidapi-key":
                  "1840eb60a0msh2f5e9e1ea264745p133df8jsn55c8ca388784",
              },
            }
          );

          // Merge the fetched jobs with the previously collected jobs
          allJobs = [...allJobs, ...response.data.data];
        }

        // Update state with all the fetched jobs
        setJobs(allJobs);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array to run once when the component mounts

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current jobs based on the page number
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
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

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="container mx-auto p-6 bg-black text-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-semibold text-center mb-6 text-gray-100 hover:text-white transition-colors duration-300">
      Recommended Jobs based on your skills
      </h1>
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
        {/* Hide Prev button if on first page */}
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

        {/* Hide Next button if on the last page */}
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
