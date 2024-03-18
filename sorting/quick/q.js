let animationSpeed = 0.5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = parseFloat(this.value);
    document.getElementById("speedLabel").textContent = "Speed: " + animationSpeed;
});

async function visualizeArray(array, pivotIndex, comparisons, current) {
    const arrayContainer = d3.select("#array-container");

    arrayContainer.selectAll("*").remove();

    arrayContainer
        .selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .attr("class", (d, i) => `bar ${i === pivotIndex ? 'pivot' : ''} ${i === comparisons[0] || i === comparisons[1] ? 'active' : ''} ${i === current ? 'current' : ''}`)
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

async function quickSort(array, low, high) {
    if (low < high) {
        const pivotIndex = await partition(array, low, high);
        await quickSort(array, low, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, high);
    }
}

async function partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] <= pivot) {
            i++;
            swap(array, i, j);
            visualizeArray(array, i, [i, j], -1);
            visualizeProcessBlock(`Swapped ${array[i]} and ${array[j]}`, `Comparing ${array[j]} with pivot (${pivot}) and moving ${array[j]} to the left.`);
            await sleep(800 / animationSpeed);
        }
    }

    swap(array, i + 1, high);
    visualizeArray(array, i + 1, [i + 1, high], -1);
    visualizeProcessBlock(`Swapped ${array[i + 1]} and ${array[high]} (Pivot)`, `Placing pivot (${pivot}) in its correct position.`);
    await sleep(800 / animationSpeed);

    return i + 1;
}

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startQuickSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, [], -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    quickSort(array, 0, array.length - 1);
}

function resetArray() {
    const arraySize = 10;
    const array = generateRandomArray(arraySize);
    visualizeArray(array, -1, [], -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process
}

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return array;
}
