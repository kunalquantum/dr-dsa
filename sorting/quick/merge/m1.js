// merge-sort.js

let animationSpeed = 5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = this.value;
    document.getElementById("speedLabel").textContent = "Speed: " + animationSpeed;
});

async function visualizeArray(array, start, end, merged) {
    const arrayContainer = d3.select("#array-container");

    arrayContainer.selectAll("*").remove();

    arrayContainer
        .selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .attr("class", (d, i) => `bar ${i >= start && i <= end ? 'active' : ''} ${merged.includes(i) ? 'merged' : ''}`)
        .style("height", d => `${d * 3}px`)
        .text(d => d);
}

async function visualizeProcessBlock(process) {
    const processBlock = d3.select("#process-block");

    processBlock.append("p")
        .attr("class", "generative-effect")
        .text(process);

    processBlock.node().scrollTop = processBlock.node().scrollHeight; // Auto-scroll to bottom
    await sleep(1000 / animationSpeed); // Introduce a delay after each process for better visualization
}

async function mergeSort(array, start, end) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);

        await mergeSort(array, start, mid);
        await mergeSort(array, mid + 1, end);

        await merge(array, start, mid, end);
    }
}

async function merge(array, start, mid, end) {
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        k++;

        visualizeArray(array, start, end, [k - 1]);
        visualizeProcessBlock(`Merging: ${leftArray[i - 1]} and ${rightArray[j - 1]}`);
        await sleep(800 / animationSpeed);
    }

    while (i < leftArray.length) {
        array[k] = leftArray[i];
        i++;
        k++;

        visualizeArray(array, start, end, [k - 1]);
        visualizeProcessBlock(`Merging: ${leftArray[i - 1]}`);
        await sleep(800 / animationSpeed);
    }

    while (j < rightArray.length) {
        array[k] = rightArray[j];
        j++;
        k++;

        visualizeArray(array, start, end, [k - 1]);
        visualizeProcessBlock(`Merging: ${rightArray[j - 1]}`);
        await sleep(800 / animationSpeed);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startMergeSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, 0, array.length - 1, []);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    mergeSort(array, 0, array.length - 1);
}

function resetArray() {
    const arraySize = 10;
    const array = generateRandomArray(arraySize);
    visualizeArray(array, 0, array.length - 1, []);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process
}

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return array;
}
