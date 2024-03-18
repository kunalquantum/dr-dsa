class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
    }

    isEmpty() {
        return this.front === null;
    }

    isFull() {
        // You can modify this condition based on your capacity requirements
        return false;
    }

    enqueue(data) {
        if (this.isFull()) {
            throw new Error("Queue is full. Cannot enqueue.");
        }

        const newNode = new Node(data);
        if (this.isEmpty()) {
            this.front = this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }

        this.visualize("Enqueued: " + data, false, false, true);
        this.visualize("Updated rear pointer.", false, false);
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty. Cannot dequeue.");
        }

        const dequeuedData = this.front.data;
        this.front = this.front.next;

        if (this.front === null) {
            this.rear = null;
        }

        this.visualize("Dequeued: " + dequeuedData, false, true, false);
        this.visualize("Updated front pointer.", false, false);
        return dequeuedData;
    }

    visualize(message, isError = false, isDequeue = false, isEnqueue = false) {
        const queueContainer = d3.select("#queue-container");
        const infoBox = d3.select("#info-box");
        const pointers = d3.select("#pointers");

        queueContainer.selectAll("*").remove();
        let current = this.front;

        while (current) {
            // Add generative effect class to the text only
            const elementContainer = queueContainer
                .append("div")
                .attr("class", "element");

            if (isDequeue && current === this.front) {
                elementContainer.style("transform", "translateX(-100%)");
            }

            const textContainer = elementContainer.append("span");

            // Apply generative effect to each character in the text
            const characters = current.data.split("");
            characters.forEach((char, index) => {
                const charSpan = textContainer
                    .append("span")
                    .attr("class", "generative-effect")
                    .text(char);
                
                // Add delay to create a character-by-character effect
                charSpan.style("animation-delay", index * 0.1 + "s");
            });

            current = current.next;
        }

        if (isEnqueue) {
            pointers.select(".rear-pointer").style("background-color", "red");
            setTimeout(() => {
                pointers.select(".rear-pointer").style("background-color", "#000");
            }, 500);
        } else if (isDequeue) {
            pointers.select(".front-pointer").style("background-color", "red");
            setTimeout(() => {
                pointers.select(".front-pointer").style("background-color", "#000");
            }, 500);
        }

        const sizeInfo = "Size: " + this.size();
        const pointersInfo = "Front Pointer: " + (this.front ? this.front.data : "null") +
            ", Rear Pointer: " + (this.rear ? this.rear.data : "null");

        // Add generative effect class to info box text
        infoBox.attr("class", "generative-effect").html(message + "<br>" + sizeInfo + "<br>" + pointersInfo);

        if (isError) {
            infoBox.style("color", "red");
        } else {
            infoBox.style("color", "black");
        }

        // Adjust the animation speed based on the speed range input
        const speed = document.getElementById("speedRange").value;
        setTimeout(() => {
            // Continue with the animation logic here
            // ...
        }, speed * 100); // Adjust the multiplier for a suitable animation speed
    }

    size() {
        let count = 0;
        let current = this.front;
        while (current) {
            count++;
            current = current.next;
        }
        return count;
    }
}

const queue = new Queue();

function enqueue() {
    const elementInput = document.getElementById("elementInput").value;
    try {
        if (elementInput.trim() !== "") {
            queue.enqueue(elementInput);
        }
    } catch (error) {
        console.error(error.message);
    }
}

function dequeue() {
    try {
        queue.dequeue();
    } catch (error) {
        console.error(error.message);
    }
}

document.getElementById("speedRange").addEventListener("input", function () {
    const speed = this.value;
    // Use the speed value to control the animation speed in the visualization logic.
});
