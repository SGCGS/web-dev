<template>
  <div id="color-container"></div>
</template>
<script>
export default {
  props: {
    background: {
      type: String,
      default: "linear-gradient(to right, #68dba4, #167dff)"
    },
  },
  mounted() {
    document.documentElement.style.background = this.background;
    this.generateColorBlocks();
    window.addEventListener("resize", this.generateColorBlocks);
  },
  methods: {
    generateRandomColor() {
      const colors = ["rgba(102, 204, 255, 0)", "rgba(255, 255, 255, 1)"];
      const shuffledColors = this.shuffleArray(colors);
      const randomColor = shuffledColors[0];
      return randomColor;
    },
    shuffleArray(array) {
      let currentIndex = array.length;
      let temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    generateColorBlocks() {
      const container = document.getElementById("color-container");
      container.innerHTML = "";
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const blockSize = 10;
      const width = Math.ceil(containerWidth / blockSize) + 1;
      const height = Math.ceil(containerHeight / blockSize) + 1;

      for (let i = 0; i < height; i++) {
        const row = document.createElement("div");
        row.classList.add("color-row");
        const denseBlocks = i % 2 === 0;
        const consecutiveColors = Math.floor(Math.random() * 10) + 5;
        let currentColor = this.generateRandomColor();

        if (!denseBlocks) {
          currentColor = "rgba(255, 255, 255, 1)";
        }

        const createColorBlock = (width, color) => {
          const colorBlock = document.createElement("div");
          colorBlock.classList.add("color-block");
          colorBlock.style.width = `${width}px`;
          colorBlock.style.height = `${blockSize}px`;
          colorBlock.style.margin = "0";
          colorBlock.style.backgroundColor = color;
          return colorBlock;
        };

        const colorRowBlocks = [];

        for (let j = 1; j < width; j++) {
          if (denseBlocks && j % consecutiveColors === 0) {
            currentColor = this.generateRandomColor();
          }

          const previousColorBlock = colorRowBlocks[colorRowBlocks.length - 1];
          if (previousColorBlock && previousColorBlock.color === currentColor) {
            previousColorBlock.width += blockSize;
          } else {
            colorRowBlocks.push({ color: currentColor, width: blockSize });
          }
        }

        colorRowBlocks.forEach((block) => {
          const colorBlock = createColorBlock(block.width, block.color);
          colorBlock.style.backgroundColor = block.color;
          row.appendChild(colorBlock);
        });

        container.appendChild(row);
      }
    },
  },
};
</script>
<style>
.color-block {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0;
}

.color-row {
  line-height: 0;
  font-size: 0;
  white-space: nowrap;
}

#color-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}
</style>