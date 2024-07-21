const BASE_URL = 'https://api.github.com';
const USER_SEARCH_ENDPOINT = '/search/users';
const USER_REPOS_ENDPOINT = '/users';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const toggleSearchBtn = document.getElementById('toggleSearch');
const resultsContainer = document.getElementById('results');

let searchType = 'users'; // Default search type

// Event listener for form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;

    if (searchType === 'users') {
        searchUsers(searchTerm);
    } else if (searchType === 'repos') {
        searchRepos(searchTerm);
    }
});

// Event listener for toggle search type button
toggleSearchBtn.addEventListener('click', () => {
    searchType = searchType === 'users' ? 'repos' : 'users';
    if (searchType === 'users') {
        toggleSearchBtn.textContent = 'Search Repos';
        searchInput.placeholder = 'Enter GitHub username';
    } else {
        toggleSearchBtn.textContent = 'Search Users';
        searchInput.placeholder = 'Enter repository name';
    }
});

// Function to search GitHub users
async function searchUsers(username) {
    try {
        const response = await fetch(`${BASE_URL}${USER_SEARCH_ENDPOINT}?q=${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayUsers(data.items);
    } catch (error) {
        console.error('Error searching users:', error);
    }
}

// Function to search GitHub repositories
async function searchRepos(repoName) {
    try {
        const response = await fetch(`${BASE_URL}/search/repositories?q=${repoName}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayRepos(data.items);
    } catch (error) {
        console.error('Error searching repositories:', error);
    }
}

// Function to display user search results
function displayUsers(users) {
    resultsContainer.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.innerHTML = `
            <img src="${user.avatar_url}" alt="Avatar" style="width: 50px; height: 50px;">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userElement.addEventListener('click', () => {
            getRepos(user.login);
        });
        resultsContainer.appendChild(userElement);
    });
}

// Function to display repositories
async function displayRepos(repos) {
    resultsContainer.innerHTML = '';
    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repo');
        repoElement.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.full_name}</a></h3>
            <p>${repo.description}</p>
            <p>Language: ${repo.language}</p>
        `;
        resultsContainer.appendChild(repoElement);
    });
}

// Function to get repositories for a specific user
async function getRepos(username) {
    try {
        const response = await fetch(`${BASE_URL}${USER_REPOS_ENDPOINT}/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const repos = await response.json();
        displayRepos(repos);
    } catch (error) {
        console.error('Error fetching repositories:', error);
    }
}
