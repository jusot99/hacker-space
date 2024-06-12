document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            executeCommand(command);
            terminalInput.value = '';
        }
    });

    function executeCommand(command) {
        if (command) {
            const commandElement = document.createElement('div');
            commandElement.textContent = `> ${command}`;
            terminalContent.appendChild(commandElement);

            // Simulate response
            const responseElement = document.createElement('div');
            responseElement.textContent = getResponseForCommand(command);
            terminalContent.appendChild(responseElement);

            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }

    function getResponseForCommand(command) {
        switch (command.toLowerCase()) {
            case 'help':
                return 'Available commands: help, about, clear';
            case 'about':
                return 'Hacker Portal - The Ultimate Hacker Experience';
            case 'clear':
                terminalContent.innerHTML = '';
                return '';
            default:
                return `Command not found: ${command}`;
        }
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchGitHub(query);
        }
    });

    function searchGitHub(query) {
        fetch(`https://api.github.com/search/users?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data.items);
            })
            .catch(error => {
                console.error('Error fetching GitHub users:', error);
                searchResults.innerHTML = '<p>Error fetching GitHub users.</p>';
            });
    }

    function displaySearchResults(users) {
        searchResults.innerHTML = '';
        if (users.length === 0) {
            searchResults.innerHTML = '<p>No users found.</p>';
        } else {
            users.forEach(user => {
                fetch(user.url)
                    .then(response => response.json())
                    .then(userData => {
                        const userName = userData.name ? userData.name : 'N/A';
                        const userBio = userData.bio ? `<p>${userData.bio}</p>` : '';
                        const userCard = `
                            <div class="card">
                                <div>
                                    <a href="${userData.html_url}" target="_blank">
                                        <img src="${userData.avatar_url}" alt="${userData.name}" class="avatar">
                                    </a>
                                </div>
                                <div class="user-info">
                                    <h2>${userData.login}</h2>
                                    <h3>${userName}</h3>
                                    ${userBio}
                                    <ul>
                                        <li>${userData.followers} <strong>Followers</strong></li>
                                        <li>${userData.following} <strong>Following</strong></li>
                                        <li>${userData.public_repos} <strong>Repos</strong></li>
                                    </ul>
                                </div>
                            </div>
                        `;
                        searchResults.innerHTML += userCard;
                    });
            });
        }
    }
});
