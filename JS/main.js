const leaderboardBody = document.getElementById('leaderboard-body');
const regionButtons = document.querySelectorAll('.region-btn');
const showBlankBadgesCheckbox = document.getElementById('showBlankBadges');
const apiUrl = 'https://starblast.io/rankings.json';
let currentRegion;
let previousDataString = '';

async function fetchLeaderboardData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const players = data.ratings[currentRegion];
        const newData = formatPlayerData(players);

        const newDataString = JSON.stringify(newData);
        if (newDataString !== previousDataString) {
            updateLeaderboard(newData);
            previousDataString = newDataString;
        }
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

function formatPlayerData(players) {
    return players
        .filter(player => player.name && player.name.trim() !== '')
        .sort((a, b) => b.live_rating - a.live_rating)
        .slice(0, 100)
        .map(player => ({
            id: player.id,
            name: player.name,
            live_rating: Math.round(player.live_rating),
            ecp: player.custom,
        }));
}

function updateLeaderboard(newData) {
    leaderboardBody.innerHTML = '';

    newData.forEach((player, index) => {
        const rank = index + 1;
        const leaderboardItem = createLeaderboardItem(player, rank);
        leaderboardBody.appendChild(leaderboardItem);
    });

    setTimeout(createParticles, 2000);
    updateIcons(newData);
}

function createLeaderboardItem(player, rank) {
    const leaderboardItem = document.createElement('div');
    leaderboardItem.classList.add('leaderboard-item');
    leaderboardItem.id = player.id;

    leaderboardItem.addEventListener('click', () => {
        buildplayerinfo(player);
    });

    const color = getColorBasedOnECP(player.ecp.finish);

    const originalfinishes = ['x27', 'alloy', 'fullcolor', 'titanium', 'gold', 'carbon', 'zinc'];
    const originalbadges = [
        'star',
        'reddit',
        'blank',
        'pirate',
        'csf',
        'pmf',
        'nwac',
        'unge',
        'halo',
        'youtube',
        'twitch',
        'invader',
        'empire',
        'alliance',
        'sdf',
        'paw',
        'gamepedia',
        'discord',
        'medic',
        'seasonal',
        'http://starblast.io/ecp/dev.png',
        'http://starblast.io/ecp/translator.png',
        'http://starblast.io/ecp/shipdesigner.jpg',
        'http://starblast.io/ecp/srcchamp.png',
        'http://starblast.io/ecp/sdcchamp.png',
        'http://starblast.io/ecp/x27.png',
        'http://starblast.io/ecp/loveship.png',
        'http://starblast.io/ecp/paralx.jpg',
        'http://starblast.io/ecp/iridium_ore.jpg',
        'http://starblast.io/ecp/carme.jpg',
        'http://starblast.io/ecp/pudding.jpg',
        'http://starblast.io/ecp/acarii.jpg',
        'http://starblast.io/ecp/scarn.jpg',
        'http://starblast.io/ecp/tournebulle.png',
        'http://starblast.io/ecp/blackstar.jpg',
        'http://starblast.io/ecp/oh.jpg',
        'http://starblast.io/ecp/ancientsky.jpg',
        'http://starblast.io/ecp/kleinem.jpg',
        'http://starblast.io/ecp/2k.jpg',
        'http://starblast.io/ecp/xcommander.jpg',
        'http://starblast.io/ecp/fady.jpg',
        'http://starblast.io/ecp/andromeda.jpg',
        'http://starblast.io/ecp/mortyrules.jpg',
        'http://starblast.io/ecp/pell.jpg',
        'http://starblast.io/ecp/dimed.jpg',
        'http://starblast.io/ecp/finalizer.jpg',
        'http://starblast.io/ecp/mikr.jpg',
        'http://starblast.io/ecp/goldman.jpg',
        'http://starblast.io/ecp/uranus.jpg',
        'http://starblast.io/ecp/nova.jpg',
        'http://starblast.io/ecp/45rfew.jpg',
        'http://starblast.io/ecp/bhpsngum.png',
        'http://starblast.io/ecp/valiant.jpg',
        'http://starblast.io/ecp/notus.png',
        'http://starblast.io/ecp/destroy.png',
        'http://starblast.io/ecp/schickenman.png',
    ];

    const isFinishInvalid = !originalfinishes.includes(player.ecp.finish);
    const isBadgeInvalid = !originalbadges.includes(player.ecp.badge);

    const badgeClass = rank <= 3 ? 'badge-shadow' : '';
    const textClass = rank === 1 ? 'textParticle' : '';
    const subspaceClass = player.id === '5a03846a0a6d212bf327f57b' ? 'subspace' : '';
    const dropShadowColor = isFinishInvalid || isBadgeInvalid ? 'red' : 'black';

    leaderboardItem.innerHTML = `
        <div class="playerName">
            <img style="opacity: 0; ${rank <= 3 ? `color: ${color};` : `filter: drop-shadow(2px 4px 6px ${dropShadowColor});`}" class="ecpIcon no-select ${badgeClass}" src="" data-id="${player.id}">
            <span class="${textClass} ${subspaceClass}" style="${isFinishInvalid || isBadgeInvalid ? 'color: red;text-shadow: 0 0 10px red;' : ''}">${player.name}</span>
        </div>
        <div class="status">
            <div class="${rank <= 3 ? `rank trophy no-select text-glow ${getRankClass(rank)}` : 'rank'}">
                <span>${rank}</span>
            </div>
            <div class="live-score">${player.live_rating}</div>
        </div>
    `;
    return leaderboardItem;
}

function getColorBasedOnECP(finish) {
    switch (finish) {
        case 'gold':
            return '#9b4a1b';
        case 'titanium':
            return '#999999';
        case 'alloy':
            return '#e4e5e5';
        case 'carbon':
            return '#464646';
        case 'zinc':
            return '#ffffff';
        default:
            return '#ff0000';
    }
}

function getRankClass(rank) {
    switch (rank) {
        case 1:
            return 'first';
        case 2:
            return 'second';
        case 3:
            return 'third';
        default:
            return '';
    }
}

async function updateIcons(players) {
    if (players && Array.isArray(players)) {
        for (const player of players) {
            const imgElement = document.querySelector(`.ecpIcon[data-id="${player.id}"]`);
            if (imgElement) {
                imgElement.src = await getECPIcon(player.ecp);
                imgElement.style.opacity = '1';
            }
        }
    }
}

function createParticles() {
    const textParticle = document.querySelector('.textParticle');
    if (textParticle) {
        const particleCount = Math.floor((textParticle.offsetWidth / 50) * 12);
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.className = 'particle';
            const size = `${random(4, 8)}px`;
            particle.style.cssText = `
                        top: ${random(20, 80)}%;
                        left: ${random(0, 95)}%;
                        width: 1px;
                        height: ${size};
                        animation-delay: ${random(0, 3)}s;
                    `;
            textParticle.appendChild(particle);
        }
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function setupRegionButtons() {
    const storedRegion = localStorage.getItem('region');

    currentRegion = storedRegion || 'Asia';

    regionButtons.forEach(button => {
        const region = button.getAttribute('data-region');

        if (region === currentRegion) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }

        button.addEventListener('click', function () {
            if (button.getAttribute('data-region') !== currentRegion) {
                regionButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentRegion = this.getAttribute('data-region');
                fetchLeaderboardData();

                localStorage.setItem('region', currentRegion);
            }
        });
    });
}

function handleBlankBadgesSetting() {
    const blanksSetting = localStorage.getItem('blank');
    showBlankBadgesCheckbox.checked = blanksSetting === 'yes';

    showBlankBadgesCheckbox.addEventListener('change', () => {
        localStorage.setItem('blank', showBlankBadgesCheckbox.checked ? 'yes' : 'no');
        window.location.reload();
    });
}

function initialize() {
    setupRegionButtons();

    fetchLeaderboardData();
    setInterval(fetchLeaderboardData, 1000);
}

initialize();

function closeplayerinfo() {
    const modal = document.getElementById('playerinfull');
    if (modal) {
        let opacity = 1;
        const fadeOutInterval = setInterval(function () {
            opacity -= 0.1;
            modal.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeOutInterval);
                modal.remove();
            }
        }, 30);
    }
}

async function buildplayerinfo(player) {
    let existsfr = document.getElementById('playerinfull');

    // Create modal element
    let element = document.createElement('div');
    element.classList.add('playerfull');
    element.id = 'playerinfull';
    element.style.opacity = '0';

    // Create content with proper HTML structure
    element.innerHTML = `
        <img src="${await getECPIcon(player.ecp)}" alt="Player badge">
        <button id="close-btn" onclick="closeplayerinfo()">X</button>
        <span id="playername">Name: ${player.name}</span>
        <div id="playerecp">
            <span class="ecp-title">ECP:</span>
            <ul>
                <li>Badge: ${player.ecp.badge}</li>
                <li>Finish: ${player.ecp.finish}</li>
                <li>Laser: ${player.ecp.laser}</li>
            </ul>
        </div>
    `;

    document.getElementsByTagName('main')[0].appendChild(element);

    // Handle fade out of existing modal
    if (existsfr) {
        var opacity1 = 1;
        var fadeOutInterval = setInterval(function () {
            opacity1 -= 0.1;
            existsfr.style.opacity = opacity1;
            if (opacity1 <= 0) {
                clearInterval(fadeOutInterval);
                existsfr.remove();
            }
        }, 30);
    }

    // Handle fade in of new modal
    var opacity2 = 0;
    var fadeInInterval = setInterval(function () {
        opacity2 += 0.1;
        element.style.opacity = opacity2;
        if (opacity2 >= 1) {
            clearInterval(fadeInInterval);
        }
    }, 30);
}
