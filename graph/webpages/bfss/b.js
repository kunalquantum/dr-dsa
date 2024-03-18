const mazeDiv = document.getElementById('maze');
const runBFSButton = document.getElementById('runBFS');

const rows = 12;
const cols = 10;

// Define the maze and agent positions
const mazeData = [
    [true, true, true, true, true, true, true, true, true, true],
    [true, false, false, true, true, true, false, false, false, true],
    [true, false, true, false, false, false, false, true, true, true],
    [true, true, true, true, true, true, true, true, false, true],
    [true, false, false, false, true, false, false, false, false, true],
    [true, false, true, false, true, true, true, true, false, true],
    [true, false, true, false, false, false, false, true, false, true],
    [true, false, true, true, true, true, false, true, false, true],
    [true, false, false, false, false, false, false, true, false, true],
    [true, true, true, true, true, true, true, true, true, true],
    [true, false, false, false, false, false, false, false, false, true],
    [true, true, true, true, true, true, true, true, true, true]
];

// Render the maze
mazeData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.style.top = (rowIndex * 40) + 'px';
        cellDiv.style.left = (colIndex * 40) + 'px';
        if (!cell) {
            cellDiv.style.backgroundColor = 'white';
        } else {
            cellDiv.style.backgroundColor = 'black';
        }
        mazeDiv.appendChild(cellDiv);
    });
});

// Define BFS function
function BFS(mazeData, start) {
    const frontier = [];
    const explored = new Set();
    const bfsPath = {};
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    frontier.push(start);
    explored.add(start);

    while (frontier.length > 0) {
        const currentCell = frontier.shift();
        const [row, col] = currentCell;

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            const newCell = [newRow, newCol];

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                mazeData[newRow][newCol] &&
                !explored.has(newCell)
            ) {
                frontier.push(newCell);
                explored.add(newCell);
                bfsPath[newCell] = currentCell;
            }
        }
    }

    return bfsPath;
}

// Run BFS when the button is clicked
runBFSButton.addEventListener('click', () => {
    const start = [1, 1];
    const bfsPath = BFS(mazeData, start);
    const agentsDiv = document.createElement('div');

    for (const cell in bfsPath) {
        const [row, col] = bfsPath[cell];
        const agentDiv = document.createElement('div');
        agentDiv.className = 'agent agent-yellow';
        agentDiv.style.top = (row * 40 + 5) + 'px';
        agentDiv.style.left = (col * 40 + 5) + 'px';
        agentsDiv.appendChild(agentDiv);
    }

    mazeDiv.appendChild(agentsDiv);
});
