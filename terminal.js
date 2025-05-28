const terminal = document.getElementById("terminal");

function printLine(text = "", delay = 0) {
  setTimeout(() => {
    terminal.textContent += text + "\n";
    terminal.scrollTop = terminal.scrollHeight;
  }, delay);
}

function bootTerminal() {
  printLine("john@johnmann.xyz:~$ ls");
  printLine("projects  media  about.txt  logbook.txt", 300);
  printLine("", 600);
  printLine("john@johnmann.xyz:~$ cat about.txt", 900);
  printLine("Hi, I’m John. I break things, fix data, and sometimes build weird stuff.", 1200);
  printLine("", 1500);
  printLine("john@johnmann.xyz:~$", 1800);
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
  `;
  document.head.appendChild(style);
}

function startFlicker() {
  setInterval(() => {
    terminal.style.opacity = Math.random() > 0.98 ? "0.9" : "1";
  }, 60);
}

function initInput() {
  let currentInput = "";
  printLine("john@johnmann.xyz:~$ ", 2100);

  document.addEventListener("keydown", (e) => {
    if (e.key.length === 1 && !e.ctrlKey) {
      currentInput += e.key;
      terminal.textContent += e.key;
    } else if (e.key === "Backspace") {
      currentInput = currentInput.slice(0, -1);
      terminal.textContent = terminal.textContent.slice(0, -1);
    } else if (e.key === "Enter") {
      terminal.textContent += "\n";
      handleCommand(currentInput.trim());
      currentInput = "";
    }
    terminal.scrollTop = terminal.scrollHeight;
  });
}

function handleCommand(input) {
  switch (input.toLowerCase()) {
    case "help":
      printLine("Available commands: help, about, clear");
      break;
    case "about":
      printLine("I'm John. I write SQL, fix weird data, and build retro junk.");
      break;
    case "clear":
      terminal.textContent = "";
      break;
    default:
      printLine(`Command not found: ${input}`);
  }
  printLine("john@johnmann.xyz:~$ ");
}

// Boot
window.onload = () => {
  bootTerminal();
  startScanlines();
  startFlicker();
  initInput();
};
