// selection-sort.js

let animationSpeed = 5; // Default speed

document.getElementById("speedRange").addEventListener("input", function () {
    animationSpeed = this.value;
    document.getElementById("speedLabel").textContent = "Speed: " + animationSpeed;
});

async function visualizeArray(array, selected, minIndex, sorted) {
    const arrayContainer = d3.select("#array-container");

    arrayContainer.selectAll("*").remove();

    arrayContainer
        .selectAll("div")
        .data(array)
        .enter()
        .append("div")
        .attr("class", (d, i) => `bar ${i === selected ? 'selected' : ''} ${i === minIndex ? 'min-index' : ''} ${i <= sorted ? 'sorted' : ''}`)
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

async function selectionSort(array) {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            visualizeArray(array, j, minIndex, i);
            visualizeProcessBlock(`Checking if ${array[j]} < ${array[minIndex]}`);
            await sleep(800 / animationSpeed);

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        visualizeArray(array, i, minIndex, i);
        visualizeProcessBlock(`Swapping ${array[i]} and ${array[minIndex]}`);
        await sleep(800 / animationSpeed);

        swap(array, i, minIndex);
    }
}

function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSelectionSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    selectionSort(array);
}

function resetArray() {
    const arraySize = 10;
    const array = generateRandomArray(arraySize);
    visualizeArray(array, -1, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process
}

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return array;
}
