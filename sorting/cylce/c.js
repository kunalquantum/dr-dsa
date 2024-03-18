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

async function cycleSort(array) {
    const n = array.length;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = array[cycleStart];
        let pos = cycleStart;

        for (let i = cycleStart + 1; i < n; i++) {
            visualizeArray(array, i, cycleStart);
            visualizeProcessBlock(`Checking ${item} with ${array[i]}`);
            await sleep(800 / animationSpeed);

            if (array[i] < item) {
                pos++;
            }
        }

        if (pos === cycleStart) {
            continue; // Skip cycles with no rotations
        }

        while (item === array[pos]) {
            pos++;
        }

        const temp = array[pos];
        array[pos] = item;
        item = temp;

        visualizeArray(array, pos, cycleStart);
        visualizeProcessBlock(`Swapping ${item} and ${array[pos]}`, `Swapped because ${item} is smaller than ${array[pos]}`);
        await sleep(800 / animationSpeed);

        while (pos !== cycleStart) {
            pos = cycleStart;

            for (let i = cycleStart + 1; i < n; i++) {
                visualizeArray(array, i, cycleStart);
                visualizeProcessBlock(`Checking ${item} with ${array[i]}`);
                await sleep(800 / animationSpeed);

                if (array[i] < item) {
                    pos++;
                }
            }

            while (item === array[pos]) {
                pos++;
            }

            const temp = array[pos];
            array[pos] = item;
            item = temp;

            visualizeArray(array, pos, cycleStart);
            visualizeProcessBlock(`Swapping ${item} and ${array[pos]}`, `Swapped because ${item} is smaller than ${array[pos]}`);
            await sleep(800 / animationSpeed);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startCycleSort() {
    const arraySize = 10; // You can adjust the size of the array
    const array = generateRandomArray(arraySize);

    visualizeArray(array, -1, -1);
    document.getElementById("process-block").innerHTML = ""; // Clear previous process

    cycleSort(array);
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
