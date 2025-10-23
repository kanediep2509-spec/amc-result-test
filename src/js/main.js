document.addEventListener('DOMContentLoaded', function() {
    const button1 = document.getElementById('button1'); // View Result
    const button2 = document.getElementById('button2'); // download cert.

    const resultBox = document.getElementById('resultBox');
    const closeBox = document.getElementById('closeBox');

    button1.addEventListener('click', function() {
        resultBox.style.display = 'flex';
    });

    // Close modal
    closeBox.addEventListener('click', function() {
        resultBox.style.display = 'none';
    });


    button2.addEventListener('click', function() {
        alert('Button 2 clicked!');
    });
});