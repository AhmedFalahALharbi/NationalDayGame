document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const playerName = document.getElementById('name').value;
    const playerScore = 0;


    fetch('https://66f1060c41537919154f2fc1.mockapi.io/player', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName , score:playerScore}),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('playerScore', playerScore);
        localStorage.setItem('playerID', data.id);
        window.location.href = 'game.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});