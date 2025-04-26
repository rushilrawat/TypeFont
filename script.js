// script.js
const fontSelect = document.getElementById("fontSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const textFormatSelect = document.getElementById("textFormatSelect");
const highlightColorInput = document.getElementById("highlightColorSelect");
const textInput = document.getElementById("textInput");
const displayText = document.getElementById("displayText");
const copyButton = document.getElementById("copyButton");
const resetButton = document.getElementById("resetButton");
const zalgoComplexitySlider = document.getElementById("zalgoComplexity");
const zalgoComplexityContainer = document.getElementById("zalgoComplexityContainer");
const textCounter = document.getElementById("textCounter");
const darkModeSwitch = document.getElementById("darkModeSwitch");
const copyPopup = document.getElementById("copyPopup");

// Initialize dark mode from localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeSwitch.checked = true;
}

// Toggle dark mode
function toggleDarkMode() {
  if (darkModeSwitch.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
}

darkModeSwitch.addEventListener("change", toggleDarkMode);

// Fetch Google Fonts API
const apiKey = "AIzaSyATqPXjZzhE80CT4nl_aITBvJpJIV-OeDk";
const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`;

async function loadFonts() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const fonts = [
      "Arial", "Georgia", "Courier New", "Comic Sans MS", "Impact",
      ...data.items.map(font => font.family)
    ];
    fonts.forEach(font => {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      fontSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching fonts:", error);
  }
}

loadFonts();

// Font Size options
[8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96].forEach(size => {
  const option = document.createElement("option");
  option.value = `${size}px`;
  option.textContent = `${size}px`;
  fontSizeSelect.appendChild(option);
});

// Update live text
function updateDisplay() {
  const inputText = textInput.value;
  if (textFormatSelect.value === "zalgo") {
    displayText.innerHTML = generateZalgo(inputText, zalgoComplexitySlider.value);
  } else {
    displayText.textContent = inputText;
  }
}

// Copy text function
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(displayText.textContent).then(() => {
    copyPopup.style.display = "block";
    setTimeout(() => copyPopup.style.display = "none", 1500);
  });
});

// Reset function
resetButton.addEventListener("click", () => {
  textInput.value = "";
  displayText.textContent = "Your typed text will appear here.";
  textFormatSelect.value = "normal";
  highlightColorInput.value = "#ffffff";
  displayText.style.backgroundColor = "transparent";
  updateCounter();
});

// Update counter
function updateCounter() {
  const words = textInput.value.trim().split(/\s+/).filter(Boolean).length;
  const chars = textInput.value.length;
  textCounter.textContent = `Words: ${words} | Characters: ${chars}`;
}

textInput.addEventListener("input", () => {
  updateDisplay();
  updateCounter();
});

fontSelect.addEventListener("change", () => {
  const selectedFont = fontSelect.value;
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, "+")}&display=swap`;
  link.rel = "stylesheet";
  document.head.appendChild(link);
  displayText.style.fontFamily = `'${selectedFont}', sans-serif`;
});

fontSizeSelect.addEventListener("change", () => {
  displayText.style.fontSize = fontSizeSelect.value;
});

highlightColorInput.addEventListener("change", () => {
  displayText.style.backgroundColor = highlightColorInput.value;
});

textFormatSelect.addEventListener("change", () => {
  const format = textFormatSelect.value;
  displayText.style.fontStyle = (format.includes("italic")) ? "italic" : "normal";
  displayText.style.fontWeight = (format.includes("bold")) ? "bold" : "normal";
  displayText.style.textDecoration =
    format === "underline" ? "underline" :
    format === "strikethrough" ? "line-through" : "none";

  zalgoComplexityContainer.style.display = (format === "zalgo") ? "block" : "none";
  updateDisplay();
});

zalgoComplexitySlider.addEventListener("input", updateDisplay);

// Generate Zalgo text
function generateZalgo(text, complexity) {
  const zalgoChars = ["̖","̗","̘","̙","̜","̝","̞","̟","̠","̤","̥","̦","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̹","̺","̻","̼","ͅ","͇","͈","͉","͍","͎","͓","͔","͕","͖","͙","͚","̣","̈","̩","̤","̥","̨","̧","̢","̡","̟","̜","̚"];
  return text.split("").map(char => {
    let zalgoChar = char;
    for (let i = 0; i < complexity; i++) {
      zalgoChar += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    }
    return zalgoChar;
  }).join("");
}
