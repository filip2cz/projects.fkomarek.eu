// Funkce pro načtení dat z URL pomocí Fetch API
async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

// Funkce pro získání informací o posledním commitu z GitHub API pro daný repozitář
async function getLatestCommit(repoOwner, repoName) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
    try {
        const commits = await fetchData(url);
        if (commits.length > 0) {
            const latestCommit = commits[0];
            return {
                sha: latestCommit.sha,
                message: latestCommit.commit.message,
                date: latestCommit.commit.author.date
            };
        } else {
            throw new Error('Nebyly nalezeny žádné commity v repozitáři.');
        }
    } catch (error) {
        console.error('Chyba při získávání dat z GitHub API:', error);
        return null;
    }
}

// Funkce pro zobrazení seznamu projektů na stránce
async function displayProjects() {
    const projectsList = document.getElementById('projects-list');

    // Pole projektů, kde každý projekt má název a URL k repozitáři na GitHubu
    const projects = [
        { name: 'scoop-retro', owner: 'filip2cz', repo: 'scoop-retro' },
        { name: 'Twitch slovník', owner: 'filip2cz', repo: 'twitch-slovnik.fkomarek.eu' },
        { name: 'Better Microsoft Container', owner: 'filip2cz', repo: 'better-contain-microsoft' },
        { name: 'SSHButtons', owner: 'filip2cz', repo: 'ssh-buttons' },
        { name: 'status-client-c', owner: 'filip2cz', repo: 'status-client-c' },
        { name: 'ed-balls-cheat', owner: 'filip2cz', repo: 'ed-balls-cheat' },
        { name: 'status-client-csharp', owner: 'filip2cz', repo: 'status-client-csharp' },
        { name: 'Bludiste', owner: 'filip2cz', repo: 'bludiste' },
        { name: 'zpevnik.fkomarek.eu', owner: 'filip2cz', repo: 'zpevnik.fkomarek.eu' },
        { name: 'network-info', owner: 'filip2cz', repo: 'network-info' },
        { name: 'space-image', owner: 'filip2cz', repo: 'space-image' },
        { name: 'prague.fkomarek.eu', owner: 'filip2cz', repo: 'prague.fkomarek.eu' },
        { name: 'windows-3.1-simulator', owner: 'filip2cz', repo: 'windows-3.1-simulator' },
        { name: 'esxi-passwordreset', owner: 'filip2cz', repo: 'esxi-passwordreset' },
        { name: 'dns-minimal', owner: 'filip2cz', repo: 'dns-minimal' },
        { name: 'vmware-powercli-running-vms-table', owner: 'filip2cz', repo: 'vmware-powercli-running-vms-table' },
        { name: 'wifi-checker', owner: 'filip2cz', repo: 'wifi-checker' },
        { name: 'python-spammer', owner: 'filip2cz', repo: 'python-spammer' },
        // Další projekty...
    ];

    // Pole pro ukládání dat o projektech
    const projectsData = [];

    // Pro každý projekt načteme informace o posledním commitu
    for (const project of projects) {
        const latestCommit = await getLatestCommit(project.owner, project.repo);
        if (latestCommit) {
            projectsData.push({
                name: `<a href="https://github.com/${project.owner}/${project.repo}" target="_blank">${project.name}</a>`,
                commitDate: new Date(latestCommit.date),
                sha: latestCommit.sha,
                message: latestCommit.message,
                repoOwner: project.owner,
                repoName: project.repo
            });
        }
    }

    // Seřadíme pole projectsData podle data posledního commitu
    projectsData.sort((a, b) => b.commitDate - a.commitDate);

    // Zobrazíme seznam projektů na stránce
    projectsData.forEach(project => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${project.name}:</strong> Last update: ${project.commitDate}`;
        projectsList.appendChild(listItem);
        // Vyberte element s třídou "loading"
        const loadingElement = document.querySelector('.loading');

        // Pokud byl element nalezen, skryjte ho
        if (loadingElement) {
            loadingElement.style.display = 'none';
        } else {
            console.error('Element s třídou "loading" nebyl nalezen.');
        }
    });
}

// Zavoláme funkci pro zobrazení seznamu projektů po načtení stránky
window.onload = displayProjects;
