const jobsContainer = document.getElementById('jobs');
const searchInput = document.getElementById('search');
const countrySelect = document.getElementById('country');
let debounceTimeout;

function truncateText(text, maxLength = 150) {
  if (!text) return "No description available.";
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)) + "...";
}

async function fetchJobs(query = "developer jobs", country = "us") {
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=${country}&date_posted=all`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': '5c5f1600aamshd2dd6f706cf3227p103dcfjsn2467f2297958'
    }
  };

  jobsContainer.innerHTML = "<p>Loading jobs...</p>";

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    renderJobs(data.data || []);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    jobsContainer.innerHTML = '<p>Failed to load jobs. Please try again later.</p>';
  }
}

function renderJobs(jobs) {
  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobsContainer.innerHTML = "<p>No jobs found. Try another keyword.</p>";
    return;
  }

  jobs.forEach(job => {
    const jobEl = document.createElement('div');
    jobEl.className = 'job-card';
    jobEl.innerHTML = `
      <h3>${job.job_title || "Untitled Position"}</h3>
      <p><strong>Company:</strong> ${job.employer_name || "Unknown"}</p>
      <p>${truncateText(job.job_description)}</p>
      <a class="apply-btn" href="${job.job_apply_link}" target="_blank" rel="noopener noreferrer">Apply</a>
    `;
    jobsContainer.appendChild(jobEl);
  });
}

function performSearch() {
  const query = searchInput.value.trim() || "developer jobs";
  const country = countrySelect.value;
  fetchJobs(query, country);
}

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (e.target.value.trim().length > 2) {
      performSearch();
    }
  }, 500);
});

countrySelect.addEventListener('change', () => {
  performSearch();
});

// Initial load
performSearch();
