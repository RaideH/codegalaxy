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