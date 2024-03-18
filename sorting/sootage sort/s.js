let animationSpeed = 0.5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = parseFloat(this.value);
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
    await sleep(1000 / animationSpeed); // Introduce a delay after each process for better visualization
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

async function stoogeSort(array, low, high) {
    if (low >= high) {
        return;
    }

    if (array[low] > array[high]) {
        visualizeArray(array, low, -1);
        visualizeArray(array, high, -1);
        visualizeProcessBlock(`Swapping ${array[low]} and ${array[high]}`, `Comparing ${array[low]} and ${array[high]}: ${array[low]} is greater.`);
        await sleep(800 / animationSpeed);

        const temp = array[low];
        array[low] = array[high];
        array[high] = temp;

        visualizeArray(array, low, -1);
        visualizeArray(array, high, -1);
    }

    if (high - low + 1 > 2) {
        const third = Math.floor((high - low + 1) / 3);
        await stoogeSort(array, low, high - third);
        await stoogeSort(array, low + third, high);
        await stoogeSort(array, low, high - third);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startStoogeSort() {
    const arraySize = 8; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    stoogeSort(array, 0, array.length - 1);
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
