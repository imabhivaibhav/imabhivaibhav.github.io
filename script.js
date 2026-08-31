/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */
// Apne Supabase Dashboard se URL aur Anon Key yahan replace karein
const SUPABASE_URL = 'https://hgbmebmjrajbwhqjaeeu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYm1lYm1qcmFqYndocWphZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNTY2NTMsImV4cCI6MjEwMzczMjY1M30.fPZ_sJEeACTkj64sapeszIywAc9At1Ytb1krdEubtLE';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


/* =========================================================
   2. TYPED EFFECT INITIALIZATION
========================================================= */
const typed = new Typed('#typed', {
  strings: [
    'Passionate about AI',
    'Machine Learning Enthusiast',
    'Software Developer',
    'Open Source Contributor'
  ],
  typeSpeed: 50,
  backSpeed: 40,
  backDelay: 1800,
  loop: true,
  showCursor: false
});


/* =========================================================
   3. PROJECTS DATA DIRECTORY
========================================================= */
const projects = [
  {
    name: "WAL.AI",
    repo: "imabhivaibhav/BNS.AI",
    readme: true,
    img: "https://cdn.jsdelivr.net/gh/imabhivaibhav/default@main/project-icon.png",
    desc: "AI model to get BNS section (BNS) by case details"
  },
  {
    name: "ATM Predictive Maintenance",
    repo: "imabhivaibhav/atm_predictive_maintenance",
    readme: true,
    img: "https://cdn.jsdelivr.net/gh/imabhivaibhav/default@main/project-icon.png",
    desc: "Model to predict ATM Failure to reduce maintenance time"
  },
  {
    name: "Named Entity Recognition (NER)",
    repo: "imabhivaibhav/NER",
    readme: true,
    img: "https://cdn.jsdelivr.net/gh/imabhivaibhav/edl.iitb@main/project-icon.png",
    desc: "Named Entity Recognition (NER) with Bi-LSTM & Character CNN"
  },
  {
    name: "Spectrometry",
    repo: "imabhivaibhav/edl.iitb",
    readme: true,
    img: "https://cdn.jsdelivr.net/gh/imabhivaibhav/edl.iitb@main/project-icon.png",
    desc: "Spectrometry toolkit and analysis."
  },
  {
    name: "Heart Failure Detector",
    repo: "imabhivaibhav/heart_failure",
    readme: true,
    img: "https://cdn.jsdelivr.net/gh/imabhivaibhav/heart_failure@main/project-icon.png",
    desc: "A tool for early detection of heart failure using ML."
  }
];

// Set project count badge dynamically
if (document.getElementById("proj-count")) {
  document.getElementById("proj-count").innerText = projects.length;
}


/* =========================================================
   4. NAVIGATION & VIEW ROUTING
========================================================= */
function showLanding(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "landing" }, "", window.location.pathname);
  }
  document.getElementById('landing-page').style.display = 'flex';
  document.getElementById('electricity').style.display = 'block';
  document.getElementById('top-nav').style.display = 'none';
  document.getElementById('site-contents').style.display = 'none';
}

function prepareMainSite() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('electricity').style.display = 'none';
  document.getElementById('top-nav').style.display = 'flex';
  document.getElementById('site-contents').style.display = 'block';
}

function showAbout(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "about" }, "", window.location.pathname + "#about");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';

  document.getElementById('main-content').innerHTML = `
    <div class="about-page">
      <div class="about-top">
        <div class="about-info">
          <h1>About Me</h1>
          <p><strong>Name:</strong> Abhijeet Vaibhav</p>
          <p><strong>College:</strong> IIT Bombay</p>
          <p><strong>Education:</strong> B.Tech + M.Tech (Dual Degree), Electrical Engineering</p>
          <p>Passionate about technology, AI, Machine Learning, and software development.</p>
          <p>I enjoy building practical projects and exploring new technologies.</p>
          <div class="about-links">
            <a href="https://github.com/Imabhivaibhav" target="_blank">GitHub</a>
            <a href="https://linkedin.com/in/theabhijeetvaibhav" target="_blank">LinkedIn</a>
          </div>
        </div>

        <div class="about-slideshow" id="about-slideshow">
          <button class="slide-btn slide-prev" onclick="changeSlide(-1)">❮</button>
          <button class="slide-btn slide-next" onclick="changeSlide(1)">❯</button>
          <div class="slide-dots" id="slide-dots"></div>
        </div>
      </div>

      <div class="about-gallery">
        <h2 class="about-gallery-title">My Photos</h2>
        <div class="photo-grid" id="photo-grid"></div>
        <button class="view-more-btn" onclick="showMorePhotos()">View More</button>
      </div>
    </div>
  `;

  // Fetch Slideshow and Gallery Photos dynamically
  const photoListURL = 'https://raw.githubusercontent.com/imabhivaibhav/imabhivaibhav.github.io/main/photo.txt?t=' + Date.now();
  const photoBaseURL = 'https://raw.githubusercontent.com/imabhivaibhav/imabhivaibhav.github.io/main/';

  fetch(photoListURL)
    .then(response => response.text())
    .then(text => {
      const photoFiles = text.split(/\r?\n/).map(file => file.trim()).filter(file => file.length > 0);
      const slideshow = document.getElementById('about-slideshow');
      const dots = document.getElementById('slide-dots');

      photoFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.src = photoBaseURL + file;
        img.className = 'about-slide';
        if (index === 0) img.classList.add('active');
        img.alt = 'Photo ' + (index + 1);
        slideshow.prepend(img);

        const dot = document.createElement('span');
        dot.className = 'slide-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => showSlide(index);
        dots.appendChild(dot);
      });

      const grid = document.getElementById('photo-grid');
      photoFiles.forEach((file, index) => {
        const img = document.createElement('img');
        img.src = photoBaseURL + file;
        img.alt = 'Photo ' + (index + 1);
        if (index >= 3) img.classList.add('hidden-photo');
        grid.appendChild(img);
      });

      const viewMore = document.querySelector('.view-more-btn');
      if (photoFiles.length <= 3 && viewMore) {
        viewMore.style.display = 'none';
      }
    })
    .catch(error => console.error('Could not load photos:', error));
}

let currentSlide = 0;
window.showSlide = function(index) {
  const slides = document.querySelectorAll('.about-slide');
  const dots = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;

  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
};

window.changeSlide = function(direction) {
  showSlide(currentSlide + direction);
};

window.showMorePhotos = function() {
  document.querySelectorAll('.hidden-photo').forEach(photo => photo.classList.remove('hidden-photo'));
  const button = document.querySelector('.view-more-btn');
  if (button) button.style.display = 'none';
};

/* =========================================================
   5. MESSAGE SECTION & SUPABASE SUBMISSION
========================================================= */
function showMessage(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "message" }, "", window.location.pathname + "#message");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';

  document.getElementById('main-content').innerHTML = `
    <div class="contact-container">
      <h2 class="contact-title">Send a Message</h2>
      <form class="contact-form" id="contact-form" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label for="contact-name">Name</label>
          <input type="text" id="contact-name" class="form-control" placeholder="Your Name" required />
        </div>
        
        <div class="form-group">
          <label for="contact-email">Email</label>
          <input type="email" id="contact-email" class="form-control" placeholder="your.email@example.com" required />
        </div>

        <div class="form-group">
          <label for="contact-msg">Message</label>
          <textarea id="contact-msg" class="form-control" placeholder="Type your message here..." required></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="showLanding()">Cancel</button>
          <button type="submit" id="submit-btn" class="btn">Send</button>
        </div>
      </form>
    </div>
  `;
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Sending...';
  submitBtn.disabled = true;

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-msg').value;

  // Save message directly to Supabase Table
  const { data, error } = await supabase
    .from('personal_messages')
    .insert([{ name, email, message }]);

  if (error) {
    alert("Error sending message: " + error.message);
  } else {
    alert("Thank you! Your message has been sent successfully.");
    document.getElementById('contact-form').reset();
    showLanding();
  }

  submitBtn.innerText = 'Send';
  submitBtn.disabled = false;
}

/* =========================================================
   6. RESUME & PROJECTS SECTION
========================================================= */
function showResume() {
  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';

  document.getElementById('main-content').innerHTML = `
    <div class="resume-container">
      <iframe
        src="https://mozilla.github.io/pdf.js/web/viewer.html?file=https%3A%2F%2Fraw.githubusercontent.com%2Fimabhivaibhav%2Fimabhivaibhav.github.io%2Fmain%2FResume.pdf"
        class="resume-pdf"
        title="Abhijeet Vaibhav Resume">
      </iframe>
      <a
        href="https://raw.githubusercontent.com/imabhivaibhav/imabhivaibhav.github.io/main/Resume.pdf"
        download="Abhijeet_Vaibhav_Resume.pdf"
        class="resume-download">
        <i class="fa-solid fa-download"></i> Download Resume
      </a>
    </div>
  `;
}

function showProjects(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "projects" }, "", window.location.pathname + "#projects");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('projects-section').style.display = 'block';

  let html = '';
  projects.forEach((proj, idx) => {
    html += `
      <div class="card-container" onclick="loadProjectContent(${idx})">
        <div class="card-inner">
          <div class="card-front">
            <img src="${proj.img}" class="card-img">
            <div class="card-title">${proj.name}</div>
            <div>${proj.desc}</div>
          </div>
          <div class="card-back">Click to view project details</div>
        </div>
      </div>
    `;
  });

  document.getElementById('projects-grid').innerHTML = html;

  document.querySelectorAll('.card-container').forEach(container => {
    container.addEventListener('mouseenter', () => container.classList.add('flipped'));
    container.addEventListener('mouseleave', () => container.classList.remove('flipped'));
  });
}

function loadProjectContent(idx, addHistory = true) {
  const proj = projects[idx];

  if (addHistory) {
    history.pushState({ page: "project", projectIndex: idx }, "", window.location.pathname + "#project-" + idx);
  }

  const mainContent = document.getElementById('main-content');
  document.getElementById('projects-section').style.display = 'none';
  mainContent.style.display = 'block';

  const url = `https://raw.githubusercontent.com/${proj.repo}/main/README.md`;

  fetch(url)
    .then(res => res.text())
    .then(md => {
      mainContent.innerHTML = marked.parse(md);
    })
    .catch(() => {
      mainContent.innerHTML = '<p>Could not load README.</p>';
    });
}

/* =========================================================
   7. BROWSER HISTORY CONTROL & CANVAS ANIMATIONS
========================================================= */
window.addEventListener('popstate', function(event) {
  const state = event.state;
  if (!state || state.page === "landing") {
    showLanding(false);
  } else if (state.page === "about") {
    showAbout(false);
  } else if (state.page === "message") {
    showMessage(false);
  } else if (state.page === "projects") {
    showProjects(false);
  } else if (state.page === "project") {
    loadProjectContent(state.projectIndex, false);
  }
});

history.replaceState({ page: "landing" }, "", window.location.pathname);

// Stars animation builder
const starsContainer = document.getElementById('stars');
if (starsContainer) {
  for (let i = 0; i < 260; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    if (Math.random() > 0.82) star.classList.add('big');
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDuration = (Math.random() * 10 + 8) + 's';
    star.style.animationDelay = Math.random() * -20 + 's';
    starsContainer.appendChild(star);
  }
}

// Electricity animation builder
const electricity = document.getElementById('electricity');
if (electricity) {
  for (let i = 0; i < 60; i++) {
    const bolt = document.createElement('div');
    bolt.classList.add('bolt');
    bolt.style.left = Math.random() * 100 + '%';
    bolt.style.height = (Math.random() * 160 + 60) + 'px';
    bolt.style.animationDuration = (Math.random() * 2 + 1.2) + 's';
    bolt.style.animationDelay = Math.random() * -5 + 's';
    electricity.appendChild(bolt);
  }
}

// Avatar Interactive Movement
const avatar = document.getElementById('landing-avatar');
if (avatar) {
  avatar.addEventListener('mouseenter', () => {
    const randomX = (Math.random() - 0.5) * 520;
    const randomY = (Math.random() - 0.5) * 320;
    avatar.style.transform = `translate(${randomX}px,${randomY}px) rotate(${Math.random() * 30 - 15}deg) scale(1.08)`;
  });

  avatar.addEventListener('mouseleave', () => {
    setTimeout(() => {
      avatar.style.transform = 'translate(0px,0px) rotate(0deg) scale(1)';
    }, 350);
  });
}

// Initial render
showLanding();
