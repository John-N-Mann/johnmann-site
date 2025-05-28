// crt.js

function applyCRTEffects() {
  const style = document.createElement("style");
  style.textContent = `
    .terminal-container {
      border-radius: 1.5em;
      overflow: hidden;
      position: relative;
      transform: perspective(800px) rotateX(2.5deg) rotateY(0deg) scale(1.015);
      transform-origin: center;
      background-color: #000;
      
      
    }

    
      10% { opacity: 1; filter: brightness(1.5); }
      20% { opacity: 0.6; filter: brightness(0.3); }
      35% { opacity: 1; filter: brightness(1.2); }
      50% { opacity: 0.8; filter: brightness(0.8); }
      70% { opacity: 1; filter: brightness(1.1); }
      100% { opacity: 1; filter: brightness(1); }
    }

    .terminal-container::after {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: 
        repeating-linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.015) 0px,
          rgba(255, 255, 255, 0.015) 1px,
          transparent 1px,
          transparent 2px
        ),
        radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%);
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 2;
    }

    .terminal-container::before {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      background-repeat: repeat;
      pointer-events: none;
      z-index: 1;
    }

    .terminal-container div {
      text-shadow: 0 0 1px #d7d77d, 0 0 2px #d7d77d;
      position: relative;
      z-index: 3;
    }
  `;
  document.head.appendChild(style);
}