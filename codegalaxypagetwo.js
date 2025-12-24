// --- Optimization utilities ---
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

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Управление окном входа (Sign In)
    const signinBtn = document.querySelector('#sign-in');
    const signinBox = document.querySelector('#signin-box');

    if (signinBtn && signinBox) {
        signinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Исправлено: используем вычисляемый стиль, так как в CSS может быть display: none
            const currentDisplay = window.getComputedStyle(signinBox).display;
            signinBox.style.display = (currentDisplay === 'none') ? 'flex' : 'none';
        });
    }

    // 2. Сохранение данных формы
    const formBtn = document.querySelector('#but-inpform');
    const nameInp = document.querySelector('#name-inp');
    const surnameInp = document.querySelector('#surname-inp'); 
    const nicknameInp = document.querySelector('#nickname-inp');
    const emailInp = document.querySelector('#email-inp');
    const passwordInp = document.querySelector('#password-inp');

    if (formBtn) {
        formBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Останавливаем перезагрузку страницы

            // Проверка на заполненность (базовая)
            if(!nameInp.value || !emailInp.value) {
                alert('Please fill in the main fields');
                return;
            }

            let user = {
                name: nameInp.value,      // Исправлено: .value вместо .vale
                surname: surnameInp.value,
                nickname: nicknameInp.value, // Исправлено: nicknameInp вместо nickname
                email: emailInp.value,
                password: passwordInp.value
            };

            // Используем временную метку для уникального ID, чтобы не сбрасывалось при перезагрузке
            const uniqueId = Date.now();
            localStorage.setItem(`user_${uniqueId}`, JSON.stringify(user)); // Исправлено: обратные кавычки
            
            alert('Successfully signed in!');
            signinBox.style.display = 'none'; // Закрываем окно после успеха
        });
    }

    // 3. Копирование кода
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

    // 4. 3D Эффект для карточек (Throttle для производительности)
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

    // 5. Intersection Observer для анимаций появления
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .fram').forEach(el => observer.observe(el));
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

    // КЛЮЧ: Используем тот, что вы дали первым (он самый полный)
    const API_KEY = "";
    
    // ИСПРАВЛЕННЫЙ URL (v1beta + правильный путь)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    if (aiBtn) {
        aiBtn.onclick = () => {
            aiBox.style.display = (aiBox.style.display === 'none' || aiBox.style.display === '') ? 'flex' : 'none';
        };
    }

    async function sendToAI() {
        const text = aiInput.value.trim();
        if (!text) return;

        // Добавляем сообщение пользователя
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
                // Если снова 404, выведем подробности
                addMsg("API Error: " + data.error.message, 'ai-msg');
                console.error("Full Error:", data.error);
            } else if (data.candidates) {
                let botResponse = data.candidates[0].content.parts[0].text;
                // Превращаем **текст** в жирный
                botResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                addMsg(botResponse, 'ai-msg');
            }
        } catch (err) {
            document.getElementById(loaderId)?.remove();
            addMsg("Connection error! Run via Live Server.", 'ai-msg');
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