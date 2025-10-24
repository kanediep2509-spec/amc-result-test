document.addEventListener('DOMContentLoaded', function() {
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
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        const user = usersData.find(u => u.email.toLowerCase() === email);
        const loadingOverlay2 = document.getElementById('loadingOverlay2');

        if (user) {
            loadingOverlay2.classList.add('active');
            // Set the text inside the result box
            setTimeout(() => {
                document.getElementById("resultText").textContent = user.result + " / 150";
                // Show the result modal
                document.getElementById("resultBox").style.display = "flex";
                loadingOverlay2.classList.remove('active');
            }, 1500);
            document.getElementById("closeResult").addEventListener('click', function() {
                document.getElementById("resultBox").style.display = "none";
                emailBox.style.display = 'none';
            });
        } else {
            errorBox.style.display = 'flex';
            closeErrorBox.addEventListener('click', function() {
                errorBox.style.display = 'none';
            });
        }
        
    });

    submitEmail2.addEventListener('click', function() {
        const email = emailInput2.value.trim().toLowerCase();
        if (!email) {
            alert('Please enter your email.');
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

    





    

    
});