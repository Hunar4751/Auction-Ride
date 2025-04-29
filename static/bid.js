let currentBid = 3610.00;
const bidDisplay = document.getElementById('latestBid');
const errorMessage = document.getElementById('errorMessage');
const winnerMessage = document.getElementById('winnerMessage');
const bidInput = document.getElementById('bidAmount');
const placeBidBtn = document.getElementById('placeBidBtn');
const countdownElement = document.getElementById('countdown');

function placeBid() {
    const bidValue = parseFloat(bidInput.value);
    if (isNaN(bidValue) || bidValue <= 0) {
        errorMessage.textContent = "Please enter a valid positive bid.";
        return;
    }

    if (bidValue > currentBid) {
        currentBid = bidValue;
        bidDisplay.textContent = ` Current Bid: £${currentBid.toFixed(2)}`;
        errorMessage.textContent = "";
        bidInput.value = "";
    } else {
        errorMessage.textContent = `Bid must be greater than the current bid (£${currentBid.toFixed(2)})`;
    }
}

const auctionEndTime = new Date("2025-04-30T11:01:30Z").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = auctionEndTime - now;

    if (distance <= 0) {
        countdownElement.textContent = "Auction has ended.";
        placeBidBtn.classList.add("disabled");
        placeBidBtn.style.opacity = "0.5";
        placeBidBtn.style.pointerEvents = "none";
        bidDisplay.textContent = `Winning Bid: £${currentBid.toFixed(2)}`;
        winnerMessage.textContent = "";
        clearInterval(timerInterval);
        return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownElement.textContent =
        `Auction ends in: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();