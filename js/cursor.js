(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const style = document.createElement('style');
        style.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(style);

        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor', 'default');
        document.body.appendChild(cursor);

        const lastX = sessionStorage.getItem('cursorX');
        const lastY = sessionStorage.getItem('cursorY');
        
        let mouseX = lastX ? parseFloat(lastX) : window.innerWidth / 2;
        let mouseY = lastY ? parseFloat(lastY) : window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let isInitialized = false;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        const interactiveElements = 'a, button, input[type="submit"], input[type="button"], input[type="reset"], select, .product, .categoria-btn, .hamburguer, .quantity-controls button, [role="button"], .clickable, .product-image, .cart-icon, .search-icon, .profile-icon, .menu-icon, label[for], img, .logo, .header-logo, nav a, header a, footer a, .link, .btn, [onclick], [id*="lottie"], [class*="lottie"], svg, .header-icon, .opcao-btn, .icon-container';

        const textInputs = 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="number"], textarea';

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            sessionStorage.setItem('cursorX', mouseX);
            sessionStorage.setItem('cursorY', mouseY);
            
            if (!isInitialized) {
                cursorX = mouseX;
                cursorY = mouseY;
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
                isInitialized = true;
            }
        });

        function animateCursor() {
            const speed = 0.5;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.left = Math.round(cursorX) + 'px';
            cursor.style.top = Math.round(cursorY) + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const setCursorState = (state) => {
            cursor.className = `custom-cursor ${state}`;
        };

        function addCursorListeners() {
            document.querySelectorAll(interactiveElements).forEach(el => {
                el.addEventListener('mouseenter', () => setCursorState('hover'));
                el.addEventListener('mouseleave', () => setCursorState('default'));
                el.addEventListener('mousedown', () => setCursorState('click'));
                el.addEventListener('mouseup', () => setCursorState('hover'));
            });
        }

        setTimeout(addCursorListeners, 100);

        new MutationObserver(addCursorListeners).observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
        document.addEventListener('dblclick', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.target.tagName === 'IMG' && e.preventDefault());
        document.addEventListener('selectstart', (e) => !e.target.matches(textInputs) && e.preventDefault());

        document.addEventListener('mousedown', () => {
            if (!cursor.classList.contains('click')) setCursorState('click');
        });

        document.addEventListener('mouseup', () => {
            if (cursor.classList.contains('click')) {
                const el = document.elementFromPoint(mouseX, mouseY);
                setCursorState(el?.matches(interactiveElements) ? 'hover' : 'default');
            }
        });

        ['cursor-hover-enter', 'cursor-click'].forEach(event => {
            document.addEventListener(event, () => setCursorState(event.includes('hover') ? 'hover' : 'click'));
        });

        ['cursor-hover-leave', 'cursor-release'].forEach(event => {
            document.addEventListener(event, () => setCursorState(event.includes('leave') ? 'default' : 'hover'));
        });
    }
})();
