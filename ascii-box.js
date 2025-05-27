const contentLines = [
	"Welcome to my site.",
	"((_)|||||||D~~~",
	"<3"
];

const boxWidth = 80;
const boxHeight = 50;
const horizontalBorder = '+' + '-'.repeat(boxWidth - 2) + '+';

function padLine(line = '') {
  const padTotal = boxWidth - 2;
  const padded = line.padStart((line.length + padTotal) / 2).padEnd(padTotal);
  return `|${padded}|`;
}

const output = [horizontalBorder];

const paddingTop = Math.floor((boxHeight - 2 - contentLines.length) / 2);
const paddingBottom = boxHeight - 2 - contentLines.length - paddingTop;

for (let i = 0; i < paddingTop; i++) output.push(padLine());
contentLines.forEach(line => output.push(padLine(line)));
for (let i = 0; i < paddingBottom; i++) output.push(padLine());

output.push(horizontalBorder);

document.getElementById('ascii-box').textContent = output.join('\n');
