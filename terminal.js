// terminal.js

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

// Run on load
window.onload = bootTerminal;