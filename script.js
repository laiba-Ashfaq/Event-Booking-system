document.addEventListener('DOMContentLoaded', function() {
    // Load and display events
    loadEvents();

    function loadEvents() {
        fetch('events.json')
            .then(response => response.json())
            .then(data => {
                displayEvents(data);
                addSearchFunctionality(data);
            })
            .catch(error => console.error('Error loading events:', error));
    }

    function displayEvents(events) {
        const eventList = document.getElementById('event-list');
        if (!eventList) return;

        eventList.innerHTML = '';

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.title}" style="width:140px; height:200px">
                <div>
                    <h2>${event.title}</h2>
                    <p>${event.date}</p>
                    <p>${event.description}</p>
                    <a href="event-details.html?id=${event.id}" style="text-decoration:none">View Details</a>
                </div>
            `;
            eventList.appendChild(eventCard);
        });
    }

    function addSearchFunctionality(events) {
        const searchForm = document.getElementById('search-form');
        if (!searchForm) return;

        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const keyword = document.getElementById('keyword').value.toLowerCase();
            const date = document.getElementById('date').value;
            const category = document.getElementById('category').value.toLowerCase();

            const filteredEvents = events.filter(event => {
                const matchesKeyword = event.title.toLowerCase().includes(keyword);
                const matchesDate = date ? event.date === date : true;
                const matchesCategory = category ? event.category.toLowerCase() === category : true;

                return matchesKeyword && matchesDate && matchesCategory;
            });

            displayEvents(filteredEvents);
        });
    }

    function handleBooking(event) {
        event.preventDefault();

        const booking = {
            ticketType: document.getElementById('ticket-type').value,
            quantity: document.getElementById('quantity').value,
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            phone: document.getElementById('phno').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };

        // Store the booking details in sessionStorage
        sessionStorage.setItem('booking', JSON.stringify(booking));

        // Display alert for confirmation and redirect after alert is closed
        window.alert(`Thank you, ${booking.name}! Your booking has been confirmed for ${booking.quantity} ticket(s) to the event on ${booking.date} at ${booking.time}.`);
        
        setTimeout(() => {
            window.location.href = 'booking-confirmation.html';
        }, 100); // Small delay to allow alert to show properly
    }

    // Handle event details page
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    if (eventId) {
        loadEventDetails(eventId);
    }

    function loadEventDetails(id) {
        fetch('events.json')
            .then(response => response.json())
            .then(data => {
                const event = data.find(event => event.id == id);
                if (event) {
                    displayEventDetails(event);
                } else {
                    console.error('Event not found');
                }
            })
            .catch(error => console.error('Error loading event details:', error));
    }

    function displayEventDetails(event) {
        const eventTitle = document.getElementById('event-title');
        if (eventTitle) eventTitle.textContent = event.title;

        const eventDetails = document.getElementById('event-details');
        if (eventDetails) {
            eventDetails.innerHTML = `
                <img src="${event.image}" alt="${event.title}" style="width:140px; height:200px">
                <p>${event.date}</p>
                <p>${event.fulldescription}</p>
            `;
        }

        const bookingFormSection = document.getElementById('booking-form-section');
        if (bookingFormSection) {
            bookingFormSection.innerHTML = `
                <h2>Book Your Tickets</h2>
                <form id="booking-form">
                    <div class="form-group">
                        <label for="ticket-type">Ticket Type:</label>
                        <select id="ticket-type" name="ticketType" required>
                            ${event.ticketOptions.map(option => `<option value="${option.type}">${option.type} - $${option.price}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="age">Age:</label>
                        <input type="number" id="age" name="age" min="1" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="phno">Phone Number:</label>
                        <input type="tel" id="phno" name="phno" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="date">Event Date:</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="time">Event Time:</label>
                        <input type="time" id="time" name="time" required>
                    </div>
                    <div class="form-group">
                        <button type="submit">Confirm Booking</button>
                    </div>
                </form>
            `;
            document.getElementById('booking-form').addEventListener('submit', handleBooking);
        }
    }

    // Handle book now button toggle
    const bookNowButton = document.querySelector('.book-now');
    if (bookNowButton) {
        bookNowButton.addEventListener('click', function() {
            const bookingFormSection = document.getElementById('booking-form-section');
            if (bookingFormSection) {
                bookingFormSection.classList.toggle('hidden');
            }
        });
    }
});
