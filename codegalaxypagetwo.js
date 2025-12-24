// =========================================
// EMAILJS CONFIGURATION
// =========================================
const EMAILJS_CONFIG = {
    publicKey: 'NpessLefRCM9SFBBM',        // Your Public Key from EmailJS
    serviceID: 'service_rm0m2od',        // Your Email Service ID
    templateID: 'template_gvlx7lg'       // Your Email Template ID
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// =========================================
// OPTIMIZATION UTILITIES
// =========================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =========================================
// MAIN APPLICATION LOGIC
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Sign In Window Management
    const close = document.querySelector('#close')
    const signinBtn = document.querySelector('#sign-in');
    const signinBox = document.querySelector('#signin-box');

    if (signinBtn && signinBox && close) {
        signinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDisplay = window.getComputedStyle(signinBox).display;
            signinBox.style.display = (currentDisplay === 'none') ? 'flex' : 'none';
        });

        close.addEventListener('click', ()=>{

            signinBox.style.display = 'none';
        })
    }



    // 2. Form Data Submission with EmailJS Integration
    const formBtn = document.querySelector('#but-inpform');
    const inputForm = document.querySelector('#input-form');
    const nameInp = document.querySelector('#name-inp');
    const surnameInp = document.querySelector('#surname-inp'); 
    const nicknameInp = document.querySelector('#nickname-inp');
    const emailInp = document.querySelector('#email-inp');
    const passwordInp = document.querySelector('#password-inp');

    // Create status message element
    let statusMessage = document.querySelector('#status-message');
    if (!statusMessage && signinBox) {
        statusMessage = document.createElement('div');
        statusMessage.id = 'status-message';
        statusMessage.className = 'status-message';
        signinBox.appendChild(statusMessage);
    }

    // Function to show status messages
    function showStatusMessage(text, type) {
        if (statusMessage) {
            statusMessage.textContent = text;
            statusMessage.className = `status-message ${type} show`;
            
            setTimeout(() => {
                statusMessage.classList.remove('show');
            }, 5000);
        }
    }

    // Function to set button loading state
    function setButtonLoading(isLoading) {
        if (formBtn) {
            if (isLoading) {
                formBtn.disabled = true;
                formBtn.textContent = 'Sending...';
            } else {
                formBtn.disabled = false;
                formBtn.textContent = 'Submit';
            }
        }
    }

    if (formBtn && inputForm) {
        // Prevent default form submission
        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        formBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Basic validation
            if (!nameInp.value || !emailInp.value) {
                alert('Please fill in the required fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInp.value)) {
                alert('Please enter a valid email address');
                return;
            }

            // Password validation (minimum 6 characters)
            if (passwordInp.value.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            // Check EmailJS configuration
            if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
                showStatusMessage('⚠️ EmailJS is not configured! Please set up your keys.', 'error');
                return;
            }

            // Create user object
            let user = {
                name: nameInp.value,
                surname: surnameInp.value,
                nickname: nicknameInp.value,
                email: emailInp.value,
                password: passwordInp.value
            };

            // Prepare data for EmailJS (hide password in email)
            const emailData = {
                user_name: user.name,
                user_surname: user.surname,
                user_nickname: user.nickname,
                user_email: user.email,
                user_password: '***HIDDEN***', // Don't send password in plain text
                registration_date: new Date().toLocaleString('en-US')
            };

            // Show loading state
            setButtonLoading(true);

            try {
                // Send email via EmailJS
                const response = await emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.templateID,
                    emailData
                );

                console.log('✅ Email sent successfully!', response.status, response.text);

                // Save to localStorage with unique ID
                const uniqueId = Date.now();
                localStorage.setItem(`user_${uniqueId}`, JSON.stringify(user));
                
                showStatusMessage('✅ Registration successful! Email sent.', 'success');
                
                // Clear form
                inputForm.reset();
                
                // Close sign-in box after 2 seconds
                setTimeout(() => {
                    if (signinBox) signinBox.style.display = 'none';
                }, 2000);

            } catch (error) {
                console.error('❌ Email sending error:', error);
                showStatusMessage('❌ Error sending email. Please try again.', 'error');
            } finally {
                setButtonLoading(false);
            }
        });
    }

    // 3. Code Copy Functionality
    const codeAreas = document.querySelectorAll('textarea.code-area');
    codeAreas.forEach(area => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy Code';
        copyBtn.className = 'copy-code-btn';
        
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(area.value);
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy Code', 2000);
            } catch (err) {
                area.select();
                document.execCommand('copy');
            }
        });
        area.parentNode.insertBefore(copyBtn, area.nextSibling);
    });

    // 4. 3D Card Effect (Throttled for Performance)
    const cards = document.querySelectorAll('.fram');
    cards.forEach(card => {
        const handleMouseMove = throttle((e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * -10;
            
            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            });
        }, 16);

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 5. Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .fram').forEach(el => observer.observe(el));

    // 6. Input Validation (Real-time)
    
    // Username validation (only letters, numbers, and underscore)
    if (nicknameInp) {
        nicknameInp.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9_]/g, '');
        });
    }

    // Password strength indicator
    if (passwordInp) {
        passwordInp.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.style.borderColor = '#dc3545';
            } else if (this.value.length >= 6) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }

    // Email validation indicator
    if (emailInp) {
        emailInp.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            }
        });
    }
});

// =========================================
// AI CHAT GALAXY ASSISTANT
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    const aiBtn = document.getElementById('ai-toggle-btn');
    const aiBox = document.getElementById('ai-chat-box');
    const aiSend = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');

    // API KEY: Replace with your Gemini API key
    const API_KEY = "";
    
    // Corrected API URL
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    if (aiBtn) {
        aiBtn.onclick = () => {
            aiBox.style.display = (aiBox.style.display === 'none' || aiBox.style.display === '') ? 'flex' : 'none';
        };
    }

    async function sendToAI() {
        const text = aiInput.value.trim();
        if (!text) return;

        // Add user message
        addMsg(text, 'user-msg');
        aiInput.value = '';

        const loaderId = "loader-" + Date.now();
        addMsg("Thinking...", 'ai-msg', loaderId);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            document.getElementById(loaderId)?.remove();

            if (data.error) {
                addMsg("API Error: " + data.error.message, 'ai-msg');
                console.error("Full Error:", data.error);
            } else if (data.candidates) {
                let botResponse = data.candidates[0].content.parts[0].text;
                // Convert **text** to bold
                botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                addMsg(botResponse, 'ai-msg');
            }
        } catch (err) {
            document.getElementById(loaderId)?.remove();
            addMsg("Connection error! Please check your API key and internet connection.", 'ai-msg');
            console.error("Connection Error:", err);
        }
    }

    if (aiSend) aiSend.onclick = sendToAI;
    if (aiInput) aiInput.onkeypress = (e) => { if(e.key === 'Enter') sendToAI(); };

    function addMsg(text, type, id = null) {
        const d = document.createElement('div');
        d.className = "message " + type;
        if(id) d.id = id;
        d.innerHTML = text;
        aiMessages.appendChild(d);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
});

