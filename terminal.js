// terminal.js

const terminal = document.getElementById("terminal");
let currentInput = "";
let promptLine = document.createElement("div");
let promptInitialized = false;
let commandHistory = [];
let historyIndex = -1;

function printLine(text = "", delay = 0) {
  setTimeout(() => {
    const line = document.createElement("div");
    line.textContent = "> " + text;
    if (promptInitialized && terminal.contains(promptLine)) {
      terminal.insertBefore(line, promptLine);
    } else {
      terminal.appendChild(line);
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, delay);
}

function updatePrompt() {
  promptLine.innerHTML = `&gt; ${currentInput}<span class="cursor">_</span>`;
  terminal.scrollTop = terminal.scrollHeight;
}

function bootTerminal() {
  printLine("john@johnmann.xyz:~$ ls");
  printLine("projects  media  about.txt  logbook.txt", 300);
  printLine("", 600);
  printLine("john@johnmann.xyz:~$ cat about.txt", 900);
  printLine("Hi, I’m John. Type help for more commands. ", 1200);
  printLine("", 1500);
  setTimeout(() => {
    terminal.appendChild(promptLine);
    promptInitialized = true;
    updatePrompt();
    initInput();
  }, 1800);
}

function startScanlines() {
  const style = document.createElement("style");
  style.textContent = `
    .terminal-container::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.02) 0,
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
    }
    .terminal-container {
      position: relative;
    }
    .cursor {
      display: inline-block;
      width: 1ch;
      animation: blink 1s steps(2, start) infinite;
    }
    @keyframes blink {
      to { visibility: hidden; }
    }
  `;
  document.head.appendChild(style);
}

function startFlicker() {
  setInterval(() => {
    terminal.style.opacity = Math.random() > 0.98 ? "0.9" : "1";
  }, 60);
}

function initInput() {
  currentInput = "";
  terminal.appendChild(promptLine);
  updatePrompt();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentInput = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        historyIndex--;
        currentInput = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        currentInput = "";
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      currentInput += e.key;
    } else if (e.key === "Backspace") {
      currentInput = currentInput.slice(0, -1);
    } else if (e.key === "Enter") {
      terminal.removeChild(promptLine);
      printLine(currentInput);
      handleCommand(currentInput.trim());
      commandHistory.unshift(currentInput);
      historyIndex = -1;
      currentInput = "";
      terminal.appendChild(promptLine);
    }
    updatePrompt();
  });
}

function handleCommand(input) {
  switch (input.toLowerCase()) {
    case "help":
      printLine("Available commands: help, about, clear, snake");
      break;
    case "about":
      printLine("Welcome to the site. There isn't much yet. I'll be putting my projects here.");
      break;
    case "clear":
      terminal.innerHTML = "";
      terminal.appendChild(promptLine);
      break;
	case "snake":
	  printLine("Launching SNAKE...");
	  window.open("/projects/snake/snake.html", "_blank");
	  break;
    default:
      printLine(`Command not found: ${input}`);
  }
}

// Boot
window.onload = () => {
  bootTerminal();
  startScanlines();
  startFlicker();
  applyCRTEffects();
};