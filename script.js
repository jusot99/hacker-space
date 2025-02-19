document.addEventListener("DOMContentLoaded", function () {
    const commandInput = document.getElementById("command-input");
    const output = document.getElementById("output");

    // Fetch user's location and country via Geolocation API
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Use reverse geocoding API to fetch country name
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
                    .then(response => response.json())
                    .then(data => {
                        printOutput(`Your location: ${data.city || "Unknown City"}, ${data.countryName}`);
                    })
                    .catch(error => {
                        printOutput(`<span class="red">Could not fetch location.</span>`);
                    });
            });
        } else {
            printOutput(`<span class="red">Geolocation is not supported by this browser.</span>`);
        }
    }

    getUserLocation();

    commandInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const command = commandInput.value.trim();
            executeCommand(command);
            commandInput.value = "";
        }
    });

    function executeCommand(command) {
        printOutput(`<span class="prompt">guest@cyber-linux:~$</span> ${command}`);

        if (command === "help") {
            printOutput(`
            Available commands:
            - github user <username> (Find GitHub user)
            - github repo <repo-name> (Find repositories)
            - github commit <keyword> (Search commits)
            - github issue <keyword> (Find issues/pull requests)
            - github code <keyword> (Search code)
            - github org <org-name> (Find organizations)
            - google dork <dork> (Google dorking search)
            - ls (List directories)
            - pwd (Show current path)
            - whoami (Show user)
            - clear (Clear terminal)
            - about (Go to GitHub portfolio)
            `);
        } else if (command.startsWith("github user ")) {
            fetchGitHubUser(command.split(" ")[2]);
        } else if (command.startsWith("github repo ")) {
            fetchGitHubRepo(command.split(" ")[2]);
        } else if (command.startsWith("google dork ")) {
            googleDork(command.substring(13));
        } else if (command === "about") {
            window.location.href = "https://github.com/jusot99";
        } else if (command === "clear") {
            output.innerHTML = "";
        } else if (command === "ls") {
            printOutput("Documents  Downloads  Pictures  Projects  CyberLinux");
        } else if (command === "pwd") {
            printOutput("/home/guest");
        } else if (command === "whoami") {
            printOutput("guest");
        } else {
            printOutput(`<span class="red">${command}: command not found.</span>`);
        }
    }

    function fetchGitHubUser(username) {
        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Not Found") {
                    printOutput(`<span class="red">User '${username}' not found.</span>`);
                    return;
                }
                printOutput(`
                    <div><img src="${data.avatar_url}" class="avatar" alt="Avatar">Username: ${data.login}</div>
                    <div>Name: ${data.name || "N/A"}</div>
                    <div>Bio: ${data.bio || "No bio available"}</div>
                    <div>Location: ${data.location || "N/A"}</div>
                    <div>Followers: ${data.followers}</div>
                    <div>Following: ${data.following}</div>
                    <div>Repositories: ${data.public_repos}</div>
                    <div>Profile: <a href="${data.html_url}" target="_blank">${data.html_url}</a></div>
                `);
            });
    }

    function fetchGitHubRepo(repo) {
        fetch(`https://api.github.com/search/repositories?q=${repo}`)
            .then(response => response.json())
            .then(data => {
                if (data.items.length === 0) {
                    printOutput(`<span class="red">No repositories found for '${repo}'.</span>`);
                    return;
                }
                printOutput(`
                    <div>Repositories found: ${data.items.length}</div>
                    <div>First Repo: <a href="${data.items[0].html_url}" target="_blank">${data.items[0].full_name}</a></div>
                `);
            });
    }

    function googleDork(query) {
        const googleSearch = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        printOutput(`Searching Google Dork: ${query}\n[Click here]( ${googleSearch} )`);
        window.open(googleSearch, "_blank");
    }

    function printOutput(text) {
        output.innerHTML += `<p>${text}</p>`;
        output.scrollTop = output.scrollHeight;
    }
});
