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

async function bitonicSort(array) {
    const n = array.length;
    await bitonicSortRecursive(array, 0, n, true);
}

async function bitonicSortRecursive(array, low, count, direction) {
    if (count > 1) {
        const k = count / 2;
        await visualizeProcessBlock(`Dividing the sequence into two halves with ${k} elements each.`);
        await bitonicSortRecursive(array, low, k, !direction);
        await visualizeProcessBlock(`Recursively sorting the first half in ${!direction ? 'ascending' : 'descending'} order.`);
        await bitonicSortRecursive(array, low + k, k, direction);
        await visualizeProcessBlock(`Recursively sorting the second half in ${direction ? 'ascending' : 'descending'} order.`);
        await bitonicMerge(array, low, count, direction);
        await visualizeProcessBlock(`Merging two sorted ${direction ? 'ascending' : 'descending'} halves.`);
    }
}

async function bitonicMerge(array, low, count, direction) {
    if (count > 1) {
        const k = greatestPowerOfTwoLessThan(count);
        await visualizeProcessBlock(`Finding the greatest power of two less than ${count}: ${k}`);
        for (let i = low; i < low + count - k; i++) {
            await visualizeProcessBlock(`Comparing elements ${array[i]} and ${array[i + k]}.`);
            await compareAndSwap(array, i, i + k, direction);
        }
        await visualizeProcessBlock(`Recursively merging the first half with ${k} elements.`);
        await bitonicMerge(array, low, k, direction);
        await visualizeProcessBlock(`Recursively merging the second half with ${count - k} elements.`);
        await bitonicMerge(array, low + k, count - k, direction);
    }
}

async function compareAndSwap(array, i, j, direction) {
    visualizeArray(array, i, -1);
    visualizeArray(array, j, -1);
    const reason = (array[i] > array[j] && direction) || (array[i] < array[j] && !direction) ? 'Incorrect order, swapping.' : 'Correct order, no need to swap.';
    await visualizeProcessBlock(`Comparing elements ${array[i]} and ${array[j]}. ${reason}`);

    if ((array[i] > array[j] && direction) || (array[i] < array[j] && !direction)) {
        visualizeArray(array, i, -1);
        visualizeArray(array, j, -1);
        await visualizeProcessBlock(`Swapping ${array[i]} and ${array[j]}.`);
        await sleep(800 / animationSpeed);

        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function greatestPowerOfTwoLessThan(n) {
    let k = 1;
    while (k > 0 && k < n) {
        k = k * 2;
    }
    return k / 2;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startBitonicSort() {
    const arraySize = 8; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    bitonicSort(array);
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
