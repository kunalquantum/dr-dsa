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

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        visualizeArray(array, i, n - 1);
        visualizeArray(array, largest, n - 1);
        visualizeProcessBlock(`Swapping ${array[i]} and ${array[largest]}`, `Comparing ${array[i]} with ${array[largest]} and found ${array[largest]} to be larger.`);
        swap(array, i, largest);
        await sleep(800 / animationSpeed);

        await heapify(array, n, largest);
    } else {
        visualizeArray(array, i, n - 1);
        visualizeProcessBlock(`${array[i]} is at correct position in the heap.`);
    }
}

async function heapSort(array) {
    const n = array.length;

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        visualizeArray(array, i, n - i);
        visualizeProcessBlock(`Swapping ${array[0]} and ${array[i]}`, `Removing ${array[0]} from the heap.`);
        swap(array, 0, i);
        await sleep(800 / animationSpeed);

        await heapify(array, i, 0);
    }

    // Highlight the last element as sorted
    visualizeArray(array, 0, n - 1);
}

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startHeapSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    heapSort(array);
}

function resetArray() {
    const arraySize = 10;
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
