// ==========================
// DYNAMIC CIRCLE ART
// ==========================

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const trailSlider = document.getElementById("trail");
const margin = 20;

// Sliders and controls
const countSlider = document.getElementById("count");
const sizeSlider = document.getElementById("size");
const opacitySlider = document.getElementById("opacity");
const speedSlider = document.getElementById("speed");
const paletteSelect = document.getElementById("paletteSelect");
const refreshButton = document.getElementById("refresh");

// Speed factor
let speedFactor = parseFloat(speedSlider.value);

// Color palettes
const palettes = {
    pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
    cyberpunk: ["#FF00FF", "#00FFFF", "#FF4500", "#00FF00", "#8A2BE2"],
    noirblanc: ["#000000", "#333333", "#666666", "#999999", "#FFFFFF"]
};
let currentPalette = "cyberpunk";

// Circles array
let circles = [];

// ==========================
// HELPER FUNCTIONS
// ==========================

// Generate random float between min and max
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// Pick a random color from current palette
function randomColor() {
    const colors = palettes[currentPalette];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create a single circle with position, velocity, color, radius, opacity
function createCircle() {
    const base = rand(2, 20); // fixed base radius
    const scale = sizeSlider.value / 20; // scale according to slider
    return {
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        baseR: base,
        r: base * scale,  // apply slider immediately
        vx: rand(-0.2, 0.2),
        vy: rand(-0.2, 0.2),
        color: randomColor(),
        opacity: opacitySlider.value
    };
}


// Keep circles within canvas boundaries
function clampCircles() {
    for (let c of circles) {
        if (c.x < c.r) c.x = c.r;
        if (c.x > canvas.width - c.r) c.x = canvas.width - c.r;
        if (c.y < c.r) c.y = c.r;
        if (c.y > canvas.height - c.r) c.y = canvas.height - c.r;
    }
}

// Resize canvas to window and maintain margin
function resizeCanvas() {
    canvas.width = window.innerWidth - margin * 20;
    canvas.height = window.innerHeight - margin * 2;

    // Keep circles inside new boundaries
    clampCircles();
}

// ==========================
// GENERATE / REFRESH ART
// ==========================
function generateArt() {
    circles = [];
    const count = parseInt(countSlider.value);

    for (let i = 0; i < count; i++) {
        circles.push(createCircle());
    }
}

// ==========================
// DRAW LOOP / ANIMATION
// ==========================
function draw() {
    ctx.fillStyle = `rgba(0,0,0,${0.5-trailSlider.value})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each circle
    for (let c of circles) {
        // Move circle
        c.x += c.vx * speedFactor;
        c.y += c.vy * speedFactor;

        // Bounce off edges
        if (c.x < c.r || c.x > canvas.width - c.r) c.vx *= -1;
        if (c.y < c.r || c.y > canvas.height - c.r) c.vy *= -1;

        // Draw circle with individual opacity
        ctx.globalAlpha = c.opacity;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1; // reset alpha
    requestAnimationFrame(draw);
}

// ==========================
// EVENT LISTENERS
// ==========================

// Refresh / Generate new art
refreshButton.addEventListener("click", generateArt);

// Update circle count
countSlider.addEventListener("input", () => {
    const target = parseInt(countSlider.value);
    if (circles.length < target) {
        const toAdd = target - circles.length;
        for (let i = 0; i < toAdd; i++) circles.push(createCircle());
    } else if (circles.length > target) {
        circles.length = target;
    }
});

// Update circle size smoothly
sizeSlider.addEventListener("input", () => {
    const scale = sizeSlider.value / 20; // 20 = max base radius
    for (let c of circles) {
        c.r = c.baseR * scale; // smooth scaling based on fixed base
    }
});

// Update circle opacity
opacitySlider.addEventListener("input", () => {
    for (let c of circles) c.opacity = opacitySlider.value;
});

// Update speed
speedSlider.addEventListener("input", () => {
    speedFactor = parseFloat(speedSlider.value);
});

// Update color palette
paletteSelect.addEventListener("change", (e) => {
    currentPalette = e.target.value;
    for (let c of circles) c.color = randomColor();
});

trailSlider.addEventListener("input", () => {
    // la valeur est lue automatiquement à chaque frame dans draw()
});

// Responsive canvas
window.addEventListener("resize", resizeCanvas);

// ==========================
// INITIALIZATION
// ==========================
resizeCanvas();
generateArt();
draw();
