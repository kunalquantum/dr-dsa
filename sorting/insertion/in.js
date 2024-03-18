let animationSpeed = 0.5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = parseFloat(this.value);
    document.getElementById("speedLabel").textContent = "Speed: " + animationSpeed;
});

async function visualizeArray(array, comparisons, current) {
    const arrayContainer = d3.select("#array-container");

    arrayContainer.selectAll("*").remove();

    arrayContainer
        .selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .attr("class", (d, i) => `bar ${i === comparisons[0] || i === comparisons[1] ? 'active' : ''} ${i === current ? 'current' : ''}`)
        .style("height", d => `${d * 3}px`)
        .text(d => d);
}

async function visualizeProcessBlock(process, reasoning) {
    const processBlock = d3.select("#process-block");

    const lines = process.split("\n");
    await appendLines(processBlock, lines);

    if (reasoning) {
        processBlock.append("p")
            .attr("class", "generative-effect process-reasoning")
            .text(reasoning);
    }

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

async function insertionSort(array) {
    const n = array.length;

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        visualizeArray(array, [i, j], -1);
        visualizeProcessBlock(`The current key is ${key}`);
        await sleep(800 / animationSpeed);

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];

            visualizeArray(array, [i, j], j + 1);
            visualizeProcessBlock(`Shifting ${array[j]} to the next position`, `Comparing ${array[j]} with ${key} and moving ${array[j]} to the right.`);
            await sleep(800 / animationSpeed);

            j--;
        }

        array[j + 1] = key;

        visualizeArray(array, [], -1);
        visualizeProcessBlock(`Placed ${key} in the correct position`, `Inserting ${key} into the sorted sequence.`);
        await sleep(800 / animationSpeed);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startInsertionSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, [], -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    insertionSort(array);
}

function resetArray() {
    const arraySize = 10;
    const array = generateRandomArray(arraySize);
    visualizeArray(array, [], -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process
}

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return array;
}
