// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});






const auctionEndDate = [
    new Date("2025-11-29T02:34:00").getTime(),
    new Date("2025-12-01T02:34:00").getTime(),
    new Date("2025-12-02T02:34:00").getTime(),
    new Date("2025-12-03T02:34:00").getTime(),
    new Date("2025-12-04T02:34:00").getTime(),
    new Date("2025-12-05T02:34:00").getTime(),
    new Date("2025-12-06T02:34:00").getTime(),
    new Date("2025-12-07T02:34:00").getTime(),
    new Date("2025-12-08T02:34:00").getTime(),
];







function updateCountdown(index) {
    const now = new Date().getTime();
    const distance = auctionEndDate[index] - now;

    if (distance < 0) {
        document.getElementById(`countdown${index + 1}`).innerHTML = "Auction Ended";
        document.getElementById(`countdown${index + 1}`).style.color = "#ff0000";
        return;
    }




    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById(`days${index + 1}`).innerHTML = days;
    document.getElementById(`hours${index + 1}`).innerHTML = hours;
    document.getElementById(`minutes${index + 1}`).innerHTML = minutes;
    document.getElementById(`seconds${index + 1}`).innerHTML = seconds;
}

// Main countdown in hero section
function updateHeroCountdown() {
    const now = new Date().getTime();
    const endDate = new Date("2025-04-31T23:59:59").getTime();
    const distance = endDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = "Auction Season Ended";
        return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML =
        `Time left: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

setInterval(() => {
    for (let i = 0; i < auctionEndDate.length; i++) {
        updateCountdown(i);
    }
    updateHeroCountdown();
}, 1000);

// Initialize immediately
for (let i = 0; i < auctionEndDate.length; i++) {
    updateCountdown(i);
}
updateHeroCountdown();

// Create floating particles
function createParticles() {
    const colors = ['rgba(255,122,0,0.3)', 'rgba(30,46,44,0.2)', 'rgba(255,255,255,0.2)'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height =` ${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left =` ${posX}px`;
        particle.style.top =` ${posY}px`;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

        document.body.appendChild(particle);
    }
}

// Call the function when the page loads
window.addEventListener('load', createParticles);
