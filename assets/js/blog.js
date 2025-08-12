// Blog-specific JavaScript functionality

class BlogManager {
    constructor() {
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.setupCategoryFiltering();
        this.setupSearchFunctionality();
        this.setupReadingProgress();
    }

    setupCategoryFiltering() {
        const categoryTabs = document.querySelectorAll('.category-tab');
        const blogPosts = document.querySelectorAll('.blog-card');

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                this.filterPosts(category);
                this.updateActiveTab(tab);
            });
        });
    }

    filterPosts(category) {
        const blogPosts = document.querySelectorAll('.blog-card');
        
        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            
            if (category === 'all' || postCategory === category) {
                post.style.display = 'block';
                post.classList.add('fade-in');
            } else {
                post.style.display = 'none';
                post.classList.remove('fade-in');
            }
        });

        this.currentCategory = category;
    }

    updateActiveTab(activeTab) {
        const categoryTabs = document.querySelectorAll('.category-tab');
        
        categoryTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        activeTab.classList.add('active');
    }

    setupSearchFunctionality() {
        // Add search functionality if search input exists
        const searchInput = document.getElementById('blog-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPosts(e.target.value);
            });
        }
    }

    searchPosts(searchTerm) {
        const blogPosts = document.querySelectorAll('.blog-card');
        const normalizedSearch = searchTerm.toLowerCase().trim();

        blogPosts.forEach(post => {
            const title = post.querySelector('.blog-title a').textContent.toLowerCase();
            const excerpt = post.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = post.querySelector('.blog-category').textContent.toLowerCase();
            
            const matches = title.includes(normalizedSearch) || 
                          excerpt.includes(normalizedSearch) || 
                          category.includes(normalizedSearch);

            if (matches || normalizedSearch === '') {
                post.style.display = 'block';
                post.classList.add('fade-in');
            } else {
                post.style.display = 'none';
                post.classList.remove('fade-in');
            }
        });
    }

    setupReadingProgress() {
        // Only setup reading progress on article pages
        if (document.querySelector('.article-content')) {
            this.createProgressBar();
            this.updateReadingProgress();
        }
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: #3b82f6;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }

    updateReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        const article = document.querySelector('.article-content');
        
        if (!progressBar || !article) return;

        window.addEventListener('scroll', () => {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const articleStart = articleTop - windowHeight / 2;
            const articleEnd = articleTop + articleHeight - windowHeight / 2;
            
            if (scrollTop < articleStart) {
                progressBar.style.width = '0%';
            } else if (scrollTop > articleEnd) {
                progressBar.style.width = '100%';
            } else {
                const progress = (scrollTop - articleStart) / (articleEnd - articleStart);
                progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
            }
        });
    }
}

// Initialize blog functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});