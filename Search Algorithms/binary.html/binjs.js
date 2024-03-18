class AnimatedBinarySearchVisualizer {
    constructor(array, target) {
        this.array = array.sort((a, b) => a - b); // Sorted array for binary search
        this.target = target; // Element to be searched
        this.leftPointer = 0;
        this.rightPointer = this.array.length - 1;
        this.midPointer = null;
        this.foundIndex = null;
        this.animationSpeed = 1000; // Animation speed in milliseconds

        this.canvas = document.getElementById("binarySearchCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.updateProcessBox("Starting binary search...", "black");

        this.animateBinarySearch();
    }

    async animateBinarySearch() {
        while (this.leftPointer <= this.rightPointer) {
            this.midPointer = Math.floor((this.leftPointer + this.rightPointer) / 2);
            this.drawArray();
            await this.sleep(this.animationSpeed);

            if (this.array[this.midPointer] === this.target) {
                this.foundIndex = this.midPointer;
                this.drawArray();
                this.updateProcessBox(`Element ${this.target} found at index ${this.foundIndex}`, "green");
                break;
            } else if (this.array[this.midPointer] < this.target) {
                this.leftPointer = this.midPointer + 1;
            } else {
                this.rightPointer = this.midPointer - 1;
            }

            this.drawArray();
            this.updateProcessBox(`Adjusting pointers to ${this.array.slice(this.leftPointer, this.rightPointer + 1)}`, "red");

            await this.sleep(this.animationSpeed);
        }

        if (this.foundIndex === null) {
            this.updateProcessBox(`Element ${this.target} not found`, "red");
            console.log("Element not found");
        }
    }

    drawArray() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const arrayHeight = 80;
        const arraySpacing = 20;
        const textOffset = 60;

        for (let i = 0; i < this.array.length; i++) {
            const x1 = i * (arrayHeight + arraySpacing);
            const y1 = 50;
            const x2 = x1 + arrayHeight;
            const y2 = y1 + arrayHeight;

            const color = this.foundIndex !== null && i === this.foundIndex ? "green" :
                          this.midPointer !== null && i === this.midPointer ? "blue" : "black";

            this.drawRectangle(x1, y1, x2, y2, color);
            this.ctx.fillStyle = "red";
            this.ctx.fillText(this.array[i], x1 + arrayHeight / 2, y1 - textOffset);

            if (i === this.leftPointer || i === this.rightPointer) {
                this.ctx.fillStyle = "red";
                this.ctx.fillText(i === this.leftPointer ? "Left" : "Right", x1 + arrayHeight / 2, 40);
            }
        }
    }

    drawRectangle(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.stroke();
    }

    updateProcessBox(text, color) {
        const processBox = document.getElementById("process-box");
        const processText = document.createElement("div");
        processText.style.color = color;
        processText.textContent = text;
        processBox.appendChild(processText);
        processBox.scrollTop = processBox.scrollHeight; // Auto-scroll to the bottom
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function searchOperation() {
    const arrayValues = document.getElementById("entryArray").value.split(" ").map(Number);
    const targetValue = parseInt(document.getElementById("entryTarget").value);
    const visualizer = new AnimatedBinarySearchVisualizer(arrayValues, targetValue);
}
