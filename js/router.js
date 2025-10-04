class Router {
    constructor() {
        this.routes = {
            '/': '/index.html',
            '/home': '/index.html',
            '/cadastro': '/pages/cadastro.html',
            '/login': '/pages/login.html',
            '/perfil': '/pages/perfil.html',
            '/checkout': '/pages/checkout.html',
            '/listas': '/pages/listas.html',
            '/ofertas': '/pages/ofertas.html',
            '/ajustes': '/pages/ajustes.html',
            '/sobre': '/pages/sobre.html',
            '/duvidas': '/pages/duvidas.html',
            '/mapa': '/pages/mapa.html'
        };
        
        this.init();
    }

    init() {
        window.addEventListener('popstate', (e) => {
            this.handleRoute(e.state?.path || window.location.pathname);
        });

        this.handleRoute(window.location.pathname);

        this.interceptLinks();
    }

    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            
            if (href && href.startsWith('/') && !href.startsWith('//') && !href.includes('.')) {
                e.preventDefault();
                this.navigate(href);
            }
        });
    }

    navigate(path) {
        window.history.pushState({ path }, '', path);
        this.handleRoute(path);
    }

    handleRoute(path) {
        const targetFile = this.routes[path];
        
        if (targetFile) {
            this.loadPage(targetFile);
        } else {
            console.warn(`Route not found: ${path}`);
            this.navigate('/');
        }
    }

    async loadPage(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const newTitle = doc.querySelector('title');
            if (newTitle) {
                document.title = newTitle.textContent;
            }

            const newBody = doc.querySelector('body');
            if (newBody) {
                document.body.innerHTML = newBody.innerHTML;
            }

            this.reinitializePage();
            
        } catch (error) {
            console.error('Error loading page:', error);
            window.location.href = filePath;
        }
    }

    reinitializePage() {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        const headerComponent = document.querySelector('header-component');
        if (headerComponent) {
            headerComponent.connectedCallback();
        }

        const footerComponent = document.querySelector('footer-component');
        if (footerComponent) {
            footerComponent.connectedCallback();
        }

        if (typeof initializeCursor === 'function') {
            initializeCursor();
        }

        this.initializePageSpecificFeatures();
    }

    initializePageSpecificFeatures() {
        const currentPath = window.location.pathname;
        
        switch (currentPath) {
            case '/':
            case '/home':
                if (typeof initializeApp === 'function') {
                    initializeApp();
                }
                break;
            case '/cadastro':
                if (typeof initializeCadastro === 'function') {
                    initializeCadastro();
                }
                break;
            case '/login':
                if (typeof initializeLogin === 'function') {
                    initializeLogin();
                }
                break;
            case '/perfil':
                if (typeof initializePerfil === 'function') {
                    initializePerfil();
                }
                break;
            case '/checkout':
                if (typeof initializeCheckout === 'function') {
                    initializeCheckout();
                }
                break;
        }
    }

    goTo(path) {
        this.navigate(path);
    }

    getCurrentRoute() {
        return window.location.pathname;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
