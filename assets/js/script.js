// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the website
    initializeWebsite();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize website with lab data
function initializeWebsite() {
    // Update header with lab info
    updateHeader();
    
    // Update hero section with lab info
    updateHeroSection();


    // Add this line inside the initializeWebsite() function
    updateContactSection();


    // Add this line inside the initializeWebsite() function
    updateFooterSection();


}

// Update header with lab information
function updateHeader() {
    const labNameElement = document.getElementById('lab-name');
    if (labNameElement) {
        labNameElement.textContent = LAB_INFO.name;
    }
}

// Update hero section with lab information
function updateHeroSection() {
    // Update hero title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.textContent = LAB_INFO.name;
    }
    
    // Update hero tagline
    const heroTagline = document.getElementById('hero-tagline');
    if (heroTagline) {
        heroTagline.textContent = LAB_INFO.tagline;
    }
    
    // Update hero description
    const heroDescription = document.getElementById('hero-description');
    if (heroDescription) {
        heroDescription.textContent = LAB_INFO.description;
    }
}

// Set up event listeners for buttons
function setupEventListeners() {
    // Main header book button
    const mainBookBtn = document.getElementById('main-book-btn');
    if (mainBookBtn) {
        mainBookBtn.addEventListener('click', showBookingOptions);
    }
    
    // Hero book button
    const heroBookBtn = document.getElementById('hero-book-btn');
    if (heroBookBtn) {
        heroBookBtn.addEventListener('click', showBookingOptions);
    }
    
    // Hero learn more button
    const learnMoreBtn = document.getElementById('hero-learn-more');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', scrollToServices);
    }
}

// Show booking options (WhatsApp or Call)
// function showBookingOptions() {
//     const options = confirm(
//         "Choose your booking method:\n\n" +
//         "OK = WhatsApp Booking\n" +
//         "Cancel = Phone Call"
//     );
    
//     if (options) {
//         // WhatsApp booking
//         const whatsappUrl = `https://wa.me/${LAB_INFO.whatsapp}?text=Hello! I am Balaji I would like to book an appointment at ${LAB_INFO.name}.`;
//         window.open(whatsappUrl, '_blank');
//     } else {
//         // Phone call
//         window.location.href = `tel:${LAB_INFO.phone}`;
//     }
// }

// Scroll to services section
function scrollToServices() {
    const servicesSection = document.getElementById('doctors');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}






// Additional code for Doctors section functionality

// DOM elements
const categoryButtonsContainer = document.getElementById('category-buttons');
const doctorsGrid = document.getElementById('doctors-grid');
const doctorSearchInput = document.getElementById('doctor-search');
const noResultsDiv = document.getElementById('no-results');

document.addEventListener('DOMContentLoaded', function () {
  // Populate category buttons dynamically (except All, which is already present)
  populateCategoryButtons();

  // Render all doctors initially
  renderDoctors(DOCTORS);

  // Add event listeners
  setupDoctorsEventListeners();
});

// Populate category buttons
function populateCategoryButtons() {
  CATEGORIES.forEach(category => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.dataset.category = category.id;
    btn.textContent = `${category.icon} ${category.name}`;
    categoryButtonsContainer.appendChild(btn);
  });
}

let isShowingAll = false;  // Track if full list is shown
let currentDoctorsList = [];  // Cached doctors for current filter/search

// Updated renderDoctors function with limit + view all logic
function renderDoctors(doctors) {
  currentDoctorsList = doctors;

  let doctorsToShow = doctors;
  if (!isShowingAll && doctors.length > 4) {
    doctorsToShow = doctors.slice(0, 4);
  }

  doctorsGrid.innerHTML = ''; // Clear existing

  if (doctorsToShow.length === 0) {
    noResultsDiv.style.display = 'block';
  } else {
    noResultsDiv.style.display = 'none';
    doctorsToShow.forEach(doctor => renderSingleDoctor(doctor));
  }
  
  renderViewAllButton(doctors.length);
}

// Render a single doctor card (extracted from old renderDoctors loop)
function renderSingleDoctor(doctor) {
  const card = document.createElement('div');
  card.className = 'doctor-card';

  card.innerHTML = `
    <img src="${doctor.photo}" alt="Photo of ${doctor.name}" class="doctor-photo">
    <h3 class="doctor-name">${doctor.name}</h3>
    <p class="doctor-specialty">${doctor.specialty}</p>
    <button class="show-more-btn">View More ▼</button>
    <div class="doctor-details">
      <p><strong>Experience:</strong> ${doctor.experience}</p>
      <p><strong>Qualifications:</strong> ${doctor.qualifications}</p>
      <p>${doctor.details}</p>
      <button class="book-now-btn action-btn">📞 Book Appointment</button>
    </div>
  `;

  doctorsGrid.appendChild(card);

  // Setup expandable details toggle
  const toggleBtn = card.querySelector('.show-more-btn');
  const detailsDiv = card.querySelector('.doctor-details');

  toggleBtn.addEventListener('click', () => {
    const isVisible = detailsDiv.style.display === 'block';
    if (isVisible) {
      detailsDiv.style.display = 'none';
      toggleBtn.textContent = 'View More ▼';
    } else {
      // Hide other open details
      document.querySelectorAll('.doctor-details').forEach(d => d.style.display = 'none');
      document.querySelectorAll('.show-more-btn').forEach(btn => btn.textContent = 'View More ▼');

      detailsDiv.style.display = 'block';
      toggleBtn.textContent = 'View Less ▲';
    }
  });

  // Setup book now button inside details
  const bookNowBtn = card.querySelector('.book-now-btn');
  bookNowBtn.addEventListener('click', () => showBookingOptions(doctor.name));
}

// Render the View All / Show Less button
function renderViewAllButton(totalCount) {
  const container = document.getElementById('view-all-container');

  if (totalCount > 4) {
    container.innerHTML = `<button id="viewAllBtn">${isShowingAll ? 'Show Less' : 'View All'}</button>`;
    document.getElementById('viewAllBtn').addEventListener('click', () => {
      isShowingAll = !isShowingAll;
      renderDoctors(currentDoctorsList);
    });
  } else {
    container.innerHTML = '';
  }
}


// Setup event listeners for filtering and search
function setupDoctorsEventListeners() {
  categoryButtonsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      // Remove active class from all buttons
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      // Add active to clicked
      e.target.classList.add('active');

      const category = e.target.dataset.category;
      filterDoctorsByCategory(category);
    }
  });

  doctorSearchInput.addEventListener('input', () => {
    filterDoctorsBySearch(doctorSearchInput.value.trim().toLowerCase());
  });
}

// Filter doctors by category
function filterDoctorsByCategory(category) {
  if (category === 'all') {
    renderDoctors(DOCTORS);
  } else {
    const filtered = DOCTORS.filter(doc => doc.category === category);
    renderDoctors(filtered);
  }
  doctorSearchInput.value = ''; // Clear search input on category change
}

// Filter doctors by search term (name or specialty)
function filterDoctorsBySearch(searchTerm) {
  if (!searchTerm) {
    // If empty search, show all or selected category
    const activeCategoryBtn = document.querySelector('.category-btn.active');
    if (activeCategoryBtn && activeCategoryBtn.dataset.category !== 'all') {
      filterDoctorsByCategory(activeCategoryBtn.dataset.category);
    } else {
      renderDoctors(DOCTORS);
    }
    noResultsDiv.style.display = 'none';
    return;
  }

  const filtered = DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm) ||
    doc.specialty.toLowerCase().includes(searchTerm)
  );

  renderDoctors(filtered);
}

// Clear search input and show all doctors
function clearSearch() {
  doctorSearchInput.value = '';
  const allBtn = document.querySelector('.category-btn[data-category="all"]');
  if (allBtn) {
    allBtn.click();
  }
}




// Update contact section with lab information
function updateContactSection() {
    // Update address
    const labAddress = document.getElementById('lab-address');
    if (labAddress) {
        labAddress.textContent = LAB_INFO.address;
    }
    
    // Update phone
    const labPhone = document.getElementById('lab-phone');
    if (labPhone) {
        labPhone.textContent = LAB_INFO.phone;
        labPhone.href = `tel:${LAB_INFO.phone}`;
    }
    
    // Update WhatsApp
    const labWhatsapp = document.getElementById('lab-whatsapp');
    if (labWhatsapp) {
        const whatsappUrl = `https://wa.me/${LAB_INFO.whatsapp}?text=Hello! I would like to get more information about ${LAB_INFO.name}.`;
        labWhatsapp.href = whatsappUrl;
    }
    
    // Update business hours
    const labHours = document.getElementById('lab-hours');
    if (labHours) {
        labHours.textContent = LAB_INFO.hours;
    }
}






// Update footer section with lab information
function updateFooterSection() {
    // Update footer lab name
    const footerLabName = document.getElementById('footer-lab-name');
    if (footerLabName) {
        footerLabName.textContent = LAB_INFO.name;
    }
    
    // Update footer description
    const footerDescription = document.getElementById('footer-description');
    if (footerDescription) {
        footerDescription.textContent = LAB_INFO.description;
    }
    
    // Update footer address
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) {
        footerAddress.textContent = LAB_INFO.address;
    }
    
    // Update footer phone
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
        footerPhone.textContent = LAB_INFO.phone;
    }
    
    // Update footer WhatsApp
    const footerWhatsapp = document.getElementById('footer-whatsapp');
    if (footerWhatsapp) {
        const whatsappUrl = `https://wa.me/${LAB_INFO.whatsapp}?text=Hello! I would like to get more information about ${LAB_INFO.name}.`;
        footerWhatsapp.href = whatsappUrl;
    }
    
    // Update footer hours
    const footerHours = document.getElementById('footer-hours');
    if (footerHours) {
        footerHours.innerHTML = LAB_INFO.hours.replace(', ', '<br>');
    }
    
    // Update footer copyright
    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright) {
        footerCopyright.textContent = LAB_INFO.name;
    }
}







// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll-to-top functionality
function addScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.id = 'scrollTopBtn';
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('booking-modal');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const callBtn = document.getElementById('modal-call-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    whatsappBtn.addEventListener('click', () => {
        const message = encodeURIComponent(`Hello! I would like to book an appointment at ${LAB_INFO.name}.`);
        window.open(`https://wa.me/${LAB_INFO.whatsapp}?text=${message}`, '_blank');
        modal.style.display = 'none';
    });

    callBtn.addEventListener('click', () => {
        window.location.href = `tel:${LAB_INFO.phone}`;
        modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

function showBookingOptions() {
    document.getElementById('booking-modal').style.display = 'flex';
}


// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    
    // Additional functionality
    setupSmoothScrolling();
    addScrollToTop();
    
    // Initialize doctors section if elements exist
    if (document.getElementById('category-buttons')) {
        populateCategoryButtons();
        renderDoctors(DOCTORS);
        setupDoctorsEventListeners();
    }
});



// Page Loading Animation
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('load', function() {
    setTimeout(() => {
      const pageLoader = document.getElementById('page-loader');
      if (pageLoader) {
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
          pageLoader.remove();
        }, 500);
      }
    }, 800);
  });

  // Add fade-in to sections
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
});
