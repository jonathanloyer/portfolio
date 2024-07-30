// scripts.js

// Toggle mobile menu
document.querySelector('.burger-menu').addEventListener('click', function() {
    document.querySelector('.mobile-menu').classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu ul li a').forEach(function(link) {
    link.addEventListener('click', function() {
        document.querySelector('.mobile-menu').classList.add('hidden');
    });
});

// Show Accueil link when at the bottom of the page
window.addEventListener('scroll', function() {
    let accueilLink = document.querySelector('nav ul.desktop-menu li a[href="#acceuil"]');
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        accueilLink.style.display = 'block';
    } else {
        accueilLink.style.display = 'none';
    }
});
