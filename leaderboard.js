window.onload = function() {
    fetch('https://66f1060c41537919154f2fc1.mockapi.io/player')
    .then(response => response.json())
    .then(data => {
        const sortedPlayers = data.sort((a, b) => b.score - a.score);

        const leaderboardTable = document.getElementById('leaderboard');

        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1; 
            row.appendChild(rankCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            row.appendChild(nameCell);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.score;
            row.appendChild(scoreCell);

            leaderboardTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching leaderboard data:', error);
    });
};

const playerName = localStorage.getItem('playerName');
const playerScore = localStorage.getItem('playerScore');
if (!playerName) {
    window.location.href = 'index.html';
} else {
    document.getElementById('playerNameDisplay').textContent = `${playerName}`;
}
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('playerScore');
    localStorage.clear();

    window.location.href = 'index.html'; 
});