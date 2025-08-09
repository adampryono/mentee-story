// Dark Mode Toggle
const darkModeSwitch = document.getElementById('darkModeSwitch');
const htmlElement = document.documentElement;

// Check for saved dark mode preference
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') {
    darkModeSwitch.checked = true;
}

// Toggle dark mode
darkModeSwitch.addEventListener('change', function() {
    if (this.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
});

// Progress Bar on Scroll
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
});

// Number Counter Animation
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const startCounting = (counter) => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const inc = target / speed;
    
    if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(() => startCounting(counter), 1);
    } else {
        counter.innerText = target;
    }
};

// Intersection Observer for counters
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounting(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

counters.forEach(counter => {
    observer.observe(counter);
});

// Multi-Step Form
let currentStep = 1;
const totalSteps = 3;

const updateFormProgress = () => {
    // Update progress steps
    document.querySelectorAll('.step').forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        if (stepNumber <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide form steps
    document.querySelectorAll('.form-step').forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
    
    // Update review data
    if (currentStep === 3) {
        updateReview();
    }
};

const updateReview = () => {
    document.getElementById('reviewName').textContent = document.getElementById('name').value || '-';
    document.getElementById('reviewEmail').textContent = document.getElementById('email').value || '-';
    document.getElementById('reviewCourse').textContent = document.getElementById('course').options[document.getElementById('course').selectedIndex].text || '-';
    
    const rating = document.querySelectorAll('.star-rating .fas').length;
    document.getElementById('reviewRating').innerHTML = '⭐'.repeat(rating) || '-';
};

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updateFormProgress();
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateFormProgress();
    }
});

// Star Rating
const stars = document.querySelectorAll('.star-rating i');
let selectedRating = 0;

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars();
    });
    
    star.addEventListener('mouseenter', () => {
        highlightStars(index + 1);
    });
});

document.querySelector('.star-rating').addEventListener('mouseleave', () => {
    updateStars();
});

const updateStars = () => {
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
};

const highlightStars = (rating) => {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
};

// Tag Input
const tagInput = document.querySelector('.tag-input input');
const tagsContainer = document.querySelector('.tags-container');
const tags = [];

if (tagInput) {
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInput.value.trim();
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                addTag(tag);
                tagInput.value = '';
            }
        }
    });
}

const addTag = (tag) => {
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.innerHTML = `
        ${tag}
        <i class="fas fa-times" onclick="removeTag('${tag}')"></i>
    `;
    tagsContainer.appendChild(tagElement);
};

window.removeTag = (tag) => {
    const index = tags.indexOf(tag);
    if (index > -1) {
        tags.splice(index, 1);
        renderTags();
    }
};

const renderTags = () => {
    tagsContainer.innerHTML = '';
    tags.forEach(tag => addTag(tag));
};

// Filter Chips
const filterChips = document.querySelectorAll('.chip');
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // Filter stories logic here
    });
});

// FAB Toggle
const fabMain = document.querySelector('.fab-main');
const fabMenu = document.querySelector('.fab-menu');
let fabOpen = false;

fabMain.addEventListener('click', () => {
    fabOpen = !fabOpen;
    if (fabOpen) {
        fabMain.style.transform = 'rotate(45deg)';
        fabMenu.style.opacity = '1';
        fabMenu.style.pointerEvents = 'auto';
    } else {
        fabMain.style.transform = 'rotate(0deg)';
        fabMenu.style.opacity = '0';
        fabMenu.style.pointerEvents = 'none';
    }
});

// Scroll to top
document.querySelector('.fab-item[data-tooltip="Top"]').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Character Counter
const storyTextarea = document.getElementById('story');
const charCount = document.getElementById('charCount');

if (storyTextarea) {
    storyTextarea.addEventListener('input', () => {
        const count = storyTextarea.value.length;
        charCount.textContent = count;
        if (count > 500) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic here
    });
}