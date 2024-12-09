"use strict";

// ------------------------------------------------------------------------- lt/dk mode

document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.querySelector("#toggle-theme");
    toggle.addEventListener("click", modeSwitch);

    let isDark = true;

    function modeSwitch() {
        isDark = !isDark;
        let root = document.body;

        isDark ? toggle.innerText = "🌚" : toggle.innerText = "🌞";

        root.classList.toggle("dark-mode");
    }
});

// ------------------------------------------------------------------------- scroll header

let header = document.getElementById('header-bar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ------------------------------------------------------------------------- menu selector grid
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = [
        {
            name: 'Vegetable Pizza',
            image: 'images/vegetable.png',
            description: 'Mushrooms, Peppers, Onions, and Tomatoes served with Caesar Salad',
            price: '$12.29'
        },
        {
            name: 'Pepperoni Pizza',
            image: 'images/pepperoni.png',
            description: 'Served with Caesar Salad',
            price: '$12.29'
        },
        {
            name: 'Cheese Pizza',
            image: 'images/cheese.png',
            description: 'Served with Caesar Salad',
            price: '$11.79'
        },
        {
            name: 'Meat Lovers Pizza',
            image: 'images/meat-lovers.png',
            description: 'Topped with Sausage and Pepperoni served with Caesar Salad',
            price: '$12.79'
        },
        {
            name: 'Meatball Sub',
            image: 'images/meatball-sub.png',
            description: 'Hoagie Roll stuffed with Seasoned Meatballs and smothered in Marinara Sauce and Provolone served with Caesar Salad',
            price: '$13.19'
        },
        {
            name: 'Antipasto Salad',
            image: 'images/antipasto.png',
            description: 'Ham, Salami, Pepperoni, Kalamata Olives, Mozzarella, Tomatoes, Pepperoncini Peppers and Red Onion all Tossed-to-order with Chopped Romaine and House Vinaigrette',
            price: '$11.69'
        }
    ];

    const menuContainer = document.getElementById('menu-container');

    menuItems.forEach((item, index) => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.dataset.index = index;
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-image">
            <h3 class="menu-name">${item.name}</h3>
            <div class="menu-details hidden">
                <p>${item.description}</p>
                <p class="menu-price-detail">${item.price}</p>
            </div>
        `;
        menuCard.addEventListener('click', () => toggleDetails(menuCard));
        menuContainer.appendChild(menuCard);
    });

    function toggleDetails(selectedCard) {
        const expandedCard = document.querySelector('.menu-card.expanded');
        if (expandedCard && expandedCard !== selectedCard) {
            expandedCard.classList.remove('expanded');
            expandedCard.style.zIndex = '';
        }
        if (selectedCard.classList.contains('expanded')) {
            selectedCard.classList.remove('expanded');
            selectedCard.style.zIndex = '';
        } else {
            selectedCard.classList.add('expanded');
            selectedCard.style.zIndex = '10';
        }
    }
});

// ------------------------------------------------------------------------- contact form

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name');
        const contactMethod = document.querySelector('input[name="contact-method"]:checked');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const comments = document.getElementById('comments');

        let valid = true;

        document.querySelectorAll('.error-message').forEach((error) => (error.textContent = ''));

        const showError = (id, message) => {
            valid = false;
            document.getElementById(id).textContent = message;
        };

        const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
        if (!name.value.trim() || !nameRegex.test(name.value)) {
            showError('name-error', 'Unless your name is Cher or Beyonce, there should at least be two names here.');
        }

        if (!contactMethod) {
            showError('contact-method-error', "Don't you want to know when your table is ready? Well how ELSE do you want us to tell you, carrier pigeon??");
        }

        if (contactMethod?.value === 'email') {
            if (!email.value.trim()) {
                showError('email-error', "We can't email you if you don't give us an email address!");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError('email-error', "Are you sure that's a real email?");
            }
        }

        if (contactMethod?.value === 'phone') {
            if (!phone.value.trim()) {
                showError('phone-error', "We can't call you if you don't give us a phone number!");
            } else if (!/^\d{10}$/.test(phone.value)) {
                showError('phone-error', "Are you sure that's a real phone number?");
            }
        }

        if (!comments.value.trim()) showError('comments-error', 'Hey wait a second! We have to know at least WHEN you want to eat! Please give us some details about you and your party.');

        if (valid) {
            const formData = {
                name: name.value.trim(),
                contactMethod: contactMethod.value,
                email: email.value.trim() || 'N/A',
                phone: phone.value.trim() || 'N/A',
                comments: comments.value.trim(),
            };

            formMessage.innerHTML = `
                <p><strong>Thank you for submitting for a reservation, ${formData.name}! We'll get back to you as soon as possible with available times for you to dine with us.</strong></p>
                <p>Preferred Contact Method: ${formData.contactMethod}</p>
                <p>Email: ${formData.email}</p>
                <p>Phone: ${formData.phone}</p>
                <p>Comments: ${formData.comments}</p>
            `;

            contactForm.reset();
        }
    });
});



// ------------------------------------------------------------------------- game
const wheelContainer = document.getElementById("wheel-container");
const guessForm = document.getElementById("guess-form");
const userGuessInput = document.getElementById("user-guess");
const guessResult = document.getElementById("guess-result");

// order of slices starting from the center top
const slices = 6;
const sliceOrder = [2, 1, 6, 5, 4, 3];

let currentRotation = 0;

guessForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const userGuess = parseInt(userGuessInput.value);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > slices) {
        guessResult.textContent = "Please enter a valid number between 1 and 6.";
        return;
    }
    const degreesPerSlice = 360 / slices;
    const randomExtraDegrees = Math.floor(Math.random() * 360);
    const fullSpins = 5 * 360; // Ensure full 5 spins every time
    const spinDegrees = fullSpins + randomExtraDegrees; // Full spins + random final rotation

    currentRotation += spinDegrees; // Accumulate rotation

    const pizzaWheel = wheelContainer.querySelector("img");
    pizzaWheel.style.transition = "transform 3s ease-out";
    pizzaWheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const finalRotation = currentRotation % 360;
        const rawSliceIndex = Math.floor((360 - finalRotation + degreesPerSlice / 2) / degreesPerSlice) % slices;
        const winningSlice = sliceOrder[rawSliceIndex];

        if (userGuess === winningSlice) {
            guessResult.textContent = `Congratulations! The wheel landed on slice ${winningSlice}. Enjoy your pizza!`;
        } else {
            guessResult.textContent = `Sorry, the wheel landed on slice ${winningSlice}. Better luck next time!`;
        }
    }, 3000);
});
