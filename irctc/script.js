// ================= IRCTC BOOKING WINDOW CHECKER ================= 
const IRCTC_CONFIG = {
    ADVANCE_DAYS: 60, // Change to 120 anytime
    TIMEZONE: "Asia/Kolkata",
    BOOKING_HOUR: 8, // Booking opens at 8 AM IST
    BOOKING_MINUTE: 0
};

let irctcCountdownInterval;

// Time Utilities
function getISTDateTime() {
    const now = new Date();
    return new Date(
        now.toLocaleString("en-US", { timeZone: IRCTC_CONFIG.TIMEZONE })
    );
}

function getTodayIST() {
    const ist = getISTDateTime();
    return new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
}

function getLastBookingDate() {
    const today = getTodayIST();
    const now = getISTDateTime();
    const last = new Date(today);
    last.setDate(today.getDate() + IRCTC_CONFIG.ADVANCE_DAYS);
    
    // Set to 8 AM IST
    last.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    // If current time is before 8 AM today, the last booking date is actually yesterday + 60 days
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    if (now < todayAt8AM) {
        last.setDate(last.getDate() - 1);
    }
    
    return last;
}

function getNextBookingOpenTime() {
    const now = getISTDateTime();
    const today = getTodayIST();
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    if (now >= todayAt8AM) {
        // Next opening is tomorrow at 8 AM
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
        return tomorrow;
    } else {
        // Next opening is today at 8 AM
        return todayAt8AM;
    }
}

function formatDateIRCTC(date) {
    return date.toISOString().split("T")[0];
}

function diffInDays(date1, date2) {
    const diff = date1 - date2;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Initialize IRCTC Tool
function initIRCTCTool() {
    const checkBtn = document.getElementById('checkBookingBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', handleIRCTCButtonClick);
    }
    
    const resetBtn = document.getElementById('resetIRCTCBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetIRCTCFields);
    }
    
    // Display advance days
    const advanceDaysEl = document.getElementById('advanceDaysDisplay');
    if (advanceDaysEl) {
        advanceDaysEl.textContent = IRCTC_CONFIG.ADVANCE_DAYS;
    }
    
    const advanceDaysEl2 = document.getElementById('advanceDaysDisplay2');
    if (advanceDaysEl2) {
        advanceDaysEl2.textContent = IRCTC_CONFIG.ADVANCE_DAYS;
    }
    
    applyIRCTCDateLimit();
    scheduleIRCTCMidnightRefresh();
}

// Reset IRCTC fields
function resetIRCTCFields() {
    const journeyInput = document.getElementById('journeyDate');
    const resultDiv = document.getElementById('irctcResult');
    const countdownDiv = document.getElementById('irctcCountdown');
    const checkBtn = document.getElementById('checkBookingBtn');
    
    if (journeyInput) journeyInput.value = '';
    if (resultDiv) resultDiv.innerHTML = '';
    if (countdownDiv) countdownDiv.innerHTML = '';
    
    // Reset button to default state
    if (checkBtn) {
        checkBtn.textContent = 'Check Booking Status';
        checkBtn.className = 'irctc-check-btn';
        checkBtn.dataset.bookingOpen = 'false';
    }
    
    clearInterval(irctcCountdownInterval);
}

// Handle button click - either check status or book ticket
function handleIRCTCButtonClick() {
    const checkBtn = document.getElementById('checkBookingBtn');
    const isBookingOpen = checkBtn.dataset.bookingOpen === 'true';
    
    if (isBookingOpen) {
        // Open IRCTC booking page
        window.open('https://www.irctc.co.in/nget/train-search', '_blank');
    } else {
        // Check booking status
        checkIRCTCBooking();
    }
}

// Disable future dates beyond booking window
function applyIRCTCDateLimit() {
    const input = document.getElementById("journeyDate");
    if (!input) return;
    
    // Remove all restrictions - allow any date selection
    // Users can select any date and the system will tell them the booking status
    input.removeAttribute('min');
    input.removeAttribute('max');
}

// Main check function
function checkIRCTCBooking() {
    const inputVal = document.getElementById("journeyDate").value;
    const resultDiv = document.getElementById("irctcResult");
    
    if (!inputVal) {
        alert("Please select a journey date");
        return;
    }
    
    const journeyDate = new Date(inputVal + 'T00:00:00');
    const today = getTodayIST();
    const now = getISTDateTime();
    
    // Step 2: Calculate last booking date = today + 60 days at 8 AM
    const lastBookingDate = new Date(today);
    lastBookingDate.setDate(today.getDate() + IRCTC_CONFIG.ADVANCE_DAYS);
    lastBookingDate.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    
    // Adjust if current time is before 8 AM
    const todayAt8AM = new Date(today);
    todayAt8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
    if (now < todayAt8AM) {
        lastBookingDate.setDate(lastBookingDate.getDate() - 1);
    }
    
    // Step 3: Compare journey date with last booking date
    const isOpen = journeyDate <= lastBookingDate;
    const daysFromToday = diffInDays(journeyDate, today);
    
    let statusHTML = '';
    let statusClass = '';
    let message = '';
    let bookingOpenDate = null;
    let showBookButton = false;
    const checkBtn = document.getElementById('checkBookingBtn');
    
    if (journeyDate < today) {
        // Past date
        statusClass = 'status-past';
        message = '⚠️ This date has already passed';
        // Reset button to default
        if (checkBtn) {
            checkBtn.textContent = 'Check Booking Status';
            checkBtn.className = 'irctc-check-btn';
            checkBtn.dataset.bookingOpen = 'false';
        }
    } else if (isOpen) {
        // Step 4: TRUE - Booking is OPEN
        statusClass = 'status-open';
        message = `✅ OPEN FOR BOOKING<br><small>Journey is ${daysFromToday} days from today</small>`;
        showBookButton = true;
        // Change button to Book Tickets
        if (checkBtn) {
            checkBtn.textContent = '🎫 Book Tickets Now';
            checkBtn.className = 'irctc-check-btn book-mode';
            checkBtn.dataset.bookingOpen = 'true';
        }
    } else {
        // Step 4: FALSE - Booking NOT OPEN
        // Calculate exact opening date: journeyDate - 60 days at 8 AM
        bookingOpenDate = new Date(journeyDate);
        bookingOpenDate.setDate(journeyDate.getDate() - IRCTC_CONFIG.ADVANCE_DAYS);
        bookingOpenDate.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 0, 0);
        
        const daysUntilOpen = Math.ceil((bookingOpenDate - now) / (1000 * 60 * 60 * 24));
        const hoursUntilOpen = Math.ceil((bookingOpenDate - now) / (1000 * 60 * 60));
        
        statusClass = 'status-closed';
        message = `🔴 NOT OPEN<br>
            <div class="booking-opens-info">
                📅 Booking will open on:<br>
                <strong>${bookingOpenDate.toDateString()}</strong> at <strong>${IRCTC_CONFIG.BOOKING_HOUR}:00 AM IST</strong><br>
                <small>(${daysUntilOpen} days / ${hoursUntilOpen} hours from now)</small>
            </div>`;
        // Reset button to default
        if (checkBtn) {
            checkBtn.textContent = 'Check Booking Status';
            checkBtn.className = 'irctc-check-btn';
            checkBtn.dataset.bookingOpen = 'false';
        }
    }
    
    statusHTML = `
        <div class="result-card ${statusClass}">
            <div class="result-row">
                <span class="result-label">Current Time (IST):</span>
                <span class="result-value">${now.toLocaleString('en-IN', { 
                    timeZone: IRCTC_CONFIG.TIMEZONE,
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Journey Date:</span>
                <span class="result-value">${journeyDate.toDateString()}</span>
            </div>
            <div class="result-row">
                <span class="result-label">Last Bookable Date:</span>
                <span class="result-value">${lastBookingDate.toDateString()} at ${IRCTC_CONFIG.BOOKING_HOUR}:00 AM</span>
            </div>
            <div class="result-status">
                ${message}
            </div>
            ${showBookButton ? `
                <div class="book-ticket-section">
                    <p class="book-note">✨ Click the "Book Tickets Now" button above to proceed to IRCTC website</p>
                </div>
            ` : ''}
        </div>
    `;
    
    resultDiv.innerHTML = statusHTML;
    
    // Show countdown for when booking will open (if not yet open)
    if (!isOpen && journeyDate >= today && bookingOpenDate) {
        startIRCTCCountdown(bookingOpenDate);
    } else if (isOpen && journeyDate >= today) {
        // Show countdown to next window shift
        startIRCTCCountdown(getNextBookingOpenTime());
    } else {
        clearInterval(irctcCountdownInterval);
        document.getElementById("irctcCountdown").innerHTML = '';
    }
}

// Countdown timer
function startIRCTCCountdown(targetDate) {
    clearInterval(irctcCountdownInterval);
    
    const countdownDiv = document.getElementById("irctcCountdown");
    
    irctcCountdownInterval = setInterval(() => {
        const now = getISTDateTime();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownDiv.innerHTML = '<div class="countdown-complete">🎉 Booking window is now open! Click "Check Booking Status" to refresh.</div>';
            clearInterval(irctcCountdownInterval);
            // Auto refresh the check after 2 seconds
            setTimeout(() => {
                const journeyInput = document.getElementById("journeyDate");
                if (journeyInput && journeyInput.value) {
                    checkIRCTCBooking();
                }
            }, 2000);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        countdownDiv.innerHTML = `
            <div class="countdown-timer">
                ⏰ Time until booking opens: 
                <span class="countdown-value">${days}d ${hours}h ${minutes}m ${seconds}s</span>
            </div>
        `;
    }, 1000);
}

// Auto refresh at 8 AM IST
function scheduleIRCTCMidnightRefresh() {
    const now = getISTDateTime();
    const today = getTodayIST();
    
    // Next 8 AM
    let next8AM = new Date(today);
    next8AM.setHours(IRCTC_CONFIG.BOOKING_HOUR, IRCTC_CONFIG.BOOKING_MINUTE, 5, 0); // 5 seconds after 8 AM
    
    // If current time is past 8 AM today, schedule for tomorrow 8 AM
    if (now >= next8AM) {
        next8AM.setDate(next8AM.getDate() + 1);
    }
    
    const msUntil8AM = next8AM - now;
    
    setTimeout(() => {
        applyIRCTCDateLimit();
        scheduleIRCTCMidnightRefresh();
        
        // Refresh if result is showing
        const resultDiv = document.getElementById("irctcResult");
        if (resultDiv && resultDiv.innerHTML) {
            checkIRCTCBooking();
        }
    }, msUntil8AM);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initIRCTCTool();
});
