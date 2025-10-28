document.addEventListener('DOMContentLoaded', function() {
    const cutoffScores = {
        "AMC 10A": 94.5,
        "AMC 10B": 105,
        "AMC 12A": 76.5,
        "AMC 12B": 88.5
    };
    const loadingOverlay2 = document.getElementById('loadingOverlay2');

    const viewResult = document.getElementById('button1'); // View Result
    const downloadCert = document.getElementById('button2'); // download cert.

    /*get result modal box elements*/
    const emailBox = document.getElementById('emailBox');
    const closeBox = document.getElementById('closeBox');
    const submitEmail = document.getElementById('submitEmail');
    const emailInput = document.getElementById('emailInput');

    /*get downloadCert modal box*/
    const certBox = document.getElementById('certBox');
    const closeBox2 = document.getElementById('closeCert');
    const submitEmail2 = document.getElementById('submitCertEmail');
    const emailInput2 = document.getElementById('certEmailInput');
    const completeModal = document.getElementById('completeModal');

    /*error box*/
    const errorBox = document.getElementById('errorModal');
    const closeErrorBox = document.getElementById('closeError');
    const errorText = document.getElementById('errorText');

    categorySelect.addEventListener('change', function() {
    if (this.value) {
        this.style.color = '#000';
    } else {
        this.style.color = '#888';
    }
    });
    let usersData = []; 
    async function loadUsers() {
        try {
            const response = await fetch("data.json");
            usersData = await response.json(); 
            console.log(usersData); 
        } catch (error) {
            console.error("Error fetching JSON:", error);
        }
    }
    window.onload = loadUsers;
    function getDirectDriveLink(shareLink) {
        const match = shareLink.match(/\/d\/(.*?)\//);
        return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : shareLink;
    }



    viewResult.addEventListener('click', function() {
        emailBox.style.display = 'flex';
        emailInput.value = ''; // Clear previous input
    });
    closeBox.addEventListener('click', function() {
        emailBox.style.display = 'none';
    });

    downloadCert.addEventListener('click', function() {
        certBox.style.display = 'flex';
        emailInput2.value = ''; // Clear previous input
    });
    closeBox2.addEventListener('click', function() {
        certBox.style.display = 'none';
    });


    submitEmail.addEventListener('click', function() {
        const email = emailInput.value.trim().toLowerCase();
        const categorySelect = document.getElementById('categorySelect');
        const selectedCategory = categorySelect.value;
        if (!email) {
            loadingOverlay2.classList.add('active');
            setTimeout(() => {
                errorBox.style.display = 'flex';
                errorText.textContent = "Please enter an email.";
                loadingOverlay2.classList.remove('active');
            }, 700);
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
            return;
        }
        if(!selectedCategory) {
            loadingOverlay2.classList.add('active');
            setTimeout(() => {
                errorBox.style.display = 'flex';
                errorText.textContent = "Please select a category.";
                loadingOverlay2.classList.remove('active');
            }, 700);
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
            return;
        }

        const user = usersData.find(u => u.email.toLowerCase() === email && u.category === selectedCategory);
        if (user) {
            loadingOverlay2.classList.add('active');
            setTimeout(() => {
                showResultModal(user, selectedCategory, cutoffScores);
                loadingOverlay2.classList.remove('active');
            }, 2000);
            document.querySelector('.close-result').addEventListener('click', () => {
                document.getElementById('resultBox').style.display = 'none';
                emailBox.style.display = 'none';
            });
        } else {
            loadingOverlay2.classList.add('active');
            setTimeout(() => {
                errorBox.style.display = 'flex';
                errorText.textContent = "Unable to find contestant.";
                loadingOverlay2.classList.remove('active');
            }, 700);
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
        }
        
    });

    submitEmail2.addEventListener('click', function() {
        const email = emailInput2.value.trim().toLowerCase();
        if (!email) {
            errorBox.style.display = 'flex';
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
            return;
        }
        const user = usersData.find(u => u.email.toLowerCase() === email);
        const overlayText = document.getElementById('overlayText');
        const loadingOverlay = document.getElementById('loadingOverlay');

        if (user && user.certificate) {
            overlayText.textContent = "Preparing your download...";
            loadingOverlay.classList.add('active');

            setTimeout(() => {
                const directLink = getDirectDriveLink(user.certificate);
                const link = document.createElement('a');
                link.href = directLink;
                link.download = `Certificate.pdf`;
                link.click();

                overlayText.textContent = "Download Completed!";
                document.querySelector('.spinner').style.display = 'none';

                setTimeout(() => {
                    loadingOverlay.classList.remove('active');
                    document.querySelector('.spinner').style.display = 'block'; // reset spinner
                    certBox.style.display = 'none';
                }, 1500);

            }, 3000);
        } else {
            errorBox.style.display = 'flex';
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
        }
    });
    document.getElementById('closeError').addEventListener('click', function() {
        document.getElementById('errorModal').style.display = 'none';

    });

    

    
    function showResultModal(user, selectedCategories, cutoffScores) {
        const modal = document.getElementById('resultBox');
        const name = document.getElementById('resultName');
        const messageText = document.getElementById('resultMessage');
        const scoreText = document.getElementById('resultText');
        const categoryText = document.getElementById('resultCategory');

        categoryText.textContent = 'Category: ' + selectedCategories;
        scoreText.textContent = `${user.result} / 150`;

        const passed = user.result >= cutoffScores[selectedCategories];
        name.textContent = capitalize(user.firstName) + " " + capitalize(user.lastName);

        if (passed) {
            messageText.textContent = 'Congratulations for qualifying AIME!';
            setTimeout(() => {
                confetti({
                    particleCount: 300,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 350
                });
            }, 100);
            
        } else {
            messageText.textContent = "Thank you for participating in AMC 2025!";
            setTimeout(() => {
                confetti({
                    particleCount: 250,
                    spread: 300,
                    origin: { y: 0.55 },
                    ticks: 250
                });
            }, 100);
        }   
        modal.style.display = 'flex';
    };

    function capitalize(name) {
        if (!name) return '';
        return name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    function resetCategorySelect() {
        categorySelect.value = "";         // reset to placeholder
        categorySelect.style.color = "#888"; // placeholder gray
    }

    
});