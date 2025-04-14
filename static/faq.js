
const items = document.querySelectorAll('.faq-item');

items.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close all other items
        items.forEach(i => {
            if (i !== item) {
                i.classList.remove('active');
            }
        });

        // Toggle the clicked one
        item.classList.toggle('active');
    });
});