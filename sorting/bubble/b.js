let animationSpeed = 0.5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = this.value;
    document.getElementById("speedLabel").textContent = "Speed: " + animationSpeed;
});

async function visualizeArray(array, current, sorted) {
    const arrayContainer = d3.select("#array-container");

    arrayContainer.selectAll("*").remove();

    arrayContainer
        .selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .attr("class", (d, i) => `bar ${i === current ? 'current' : ''} ${i <= sorted ? 'sorted' : ''}`)
        .style("height", d => `${d * 3}px`)
        .text(d => d);
}

async function visualizeProcessBlock(process) {
    const processBlock = d3.select("#process-block");

    const lines = process.split("\n");
    await appendLines(processBlock, lines);

    processBlock.node().scrollTop = processBlock.node().scrollHeight; // Auto-scroll to bottom
}

async function appendLines(container, lines) {
    if (lines.length === 0) return;

    const line = lines.shift();
    container.append("p")
        .attr("class", "generative-effect process-text")
        .text(line);

    await sleep(1000 / animationSpeed); // Introduce a delay between lines for better visualization
    await appendLines(container, lines);
}

async function bubbleSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await compareAndSwap(array, j, j + 1);
        }
    }
}

async function compareAndSwap(array, i, j) {
    visualizeArray(array, i, -1);
    visualizeArray(array, j, -1);

    const reason = array[i] > array[j] ? 'Elements are in incorrect order, swapping.' : 'Elements are in correct order, no need to swap.';
    await visualizeProcessBlock(`Comparing elements ${array[i]} and ${array[j]}. ${reason}`);

    if (array[i] > array[j]) {
        visualizeArray(array, i, -1);
        visualizeArray(array, j, -1);
        await visualizeProcessBlock(`Swapping ${array[i]} and ${array[j]}.`);
        await sleep(800 / animationSpeed);

        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startBubbleSort() {
    const arraySize = 8; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    bubbleSort(array);
}

function resetArray() {
    const arraySize = 8;
    const array = generateRandomArray(arraySize);
    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process
}

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return array;
}
