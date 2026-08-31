/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */
const SUPABASE_URL = 'https://hgbmebmjrajbwhqjaeeu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYm1lYm1qcmFqYndocWphZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNTY2NTMsImV4cCI6MjEwMzczMjY1M30.fPZ_sJEeACTkj64sapeszIywAc9At1Ytb1krdEubtLE';

let supabaseClient = null;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* =========================================================
   2. CUSTOM TOAST NOTIFICATION (NO CHROME ALERTS)
========================================================= */
window.showToast = function(msg, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'error' ? 'rgba(239, 68, 68, 0.92)' : 'rgba(16, 185, 129, 0.92)'};
    color: #ffffff;
    padding: 12px 22px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
  `;
  toast.innerText = msg;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

/* =========================================================
   3. VISITOR TRACKING SYSTEM
========================================================= */
function getVisitorId() {
  let vid = localStorage.getItem('visitor_id');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('visitor_id', vid);
  }
  return vid;
}

async function trackTabView(tabName) {
  if (!supabaseClient) return;

  let ipData = JSON.parse(sessionStorage.getItem('user_ip_data'));
  if (!ipData) {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      ipData = { ip: data.ip || 'Unknown', location: `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}` };
      sessionStorage.setItem('user_ip_data', JSON.stringify(ipData));
    } catch (e) {
      ipData = { ip: 'Unknown', location: 'Unknown' };
    }
  }

  const visitorId = getVisitorId();
  const today = new Date().toISOString().split('T')[0];

  // 1. Log tab view (Deletes after 7 days via database trigger)
  await supabaseClient.from('visitor_logs').insert([
    { visitor_id: visitorId, tab_name: tabName, user_ip: ipData.ip, location: ipData.location }
  ]);

  // 2. Increment Daily Summary Count (Permanent)
  const { data } = await supabaseClient
    .from('daily_visitors')
    .select('total_views')
    .eq('visit_date', today)
    .single();

  if (data) {
    await supabaseClient
      .from('daily_visitors')
      .update({ total_views: data.total_views + 1 })
      .eq('visit_date', today);
  } else {
    await supabaseClient
      .from('daily_visitors')
      .insert([{ visit_date: today, total_views: 1 }]);
  }
}

/* =========================================================
   4. TYPED EFFECT INITIALIZATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('typed')) {
    new Typed('#typed', {
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
  }
});

/* =========================================================
   5. PROJECTS DATA DIRECTORY (STATIC)
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

window.addEventListener('load', () => {
  const projCount = document.getElementById("proj-count");
  if (projCount) projCount.innerText = projects.length;
});

/* =========================================================
   6. NAVIGATION & VIEW ROUTING
========================================================= */
window.showLanding = function(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "landing" }, "", window.location.pathname);
  }
  document.getElementById('landing-page').style.display = 'flex';
  document.getElementById('electricity').style.display = 'block';
  document.getElementById('top-nav').style.display = 'none';
  document.getElementById('site-contents').style.display = 'none';
  trackTabView('landing');
};

window.prepareMainSite = function() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('electricity').style.display = 'none';
  document.getElementById('top-nav').style.display = 'flex';
  document.getElementById('site-contents').style.display = 'block';
};

window.showAbout = function(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "about" }, "", window.location.pathname + "#about");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';
  trackTabView('about');

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
            <a href="javascript:void(0)" onclick="showMessage()">Message</a>
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

  const photoListURL = 'https://raw.githubusercontent.com/imabhivaibhav/imabhivaibhav.github.io/main/photo.txt?t=' + Date.now();
  const photoBaseURL = 'https://raw.githubusercontent.com/imabhivaibhav/imabhivaibhav.github.io/main/';

  fetch(photoListURL)
    .then(response => response.text())
    .then(text => {
      const photoFiles = text.split(/\r?\n/).map(file => file.trim()).filter(file => file.length > 0);
      const slideshow = document.getElementById('about-slideshow');
      const dots = document.getElementById('slide-dots');

      if (!slideshow || !dots) return;

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
      if (grid) {
        photoFiles.forEach((file, index) => {
          const img = document.createElement('img');
          img.src = photoBaseURL + file;
          img.alt = 'Photo ' + (index + 1);
          if (index >= 3) img.classList.add('hidden-photo');
          grid.appendChild(img);
        });
      }

      const viewMore = document.querySelector('.view-more-btn');
      if (photoFiles.length <= 3 && viewMore) {
        viewMore.style.display = 'none';
      }
    })
    .catch(error => console.error('Could not load photos:', error));
};

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
   7. MESSAGE SECTION & SUBMISSION WITH TOAST & REDIRECT
========================================================= */
window.showMessage = function(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "message" }, "", window.location.pathname + "#message");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';
  trackTabView('message');

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
};

window.handleFormSubmit = async function(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Sending...';
  submitBtn.disabled = true;

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-msg').value;

  if (!supabaseClient) {
    showToast("Supabase client is not loaded.", "error");
    submitBtn.innerText = 'Send';
    submitBtn.disabled = false;
    return;
  }

  const { data, error } = await supabaseClient
    .from('personal_messages')
    .insert([{ name, email, message }]);

  if (error) {
    showToast("Error: " + error.message, "error");
    submitBtn.innerText = 'Send';
    submitBtn.disabled = false;
  } else {
    showToast("Message sent successfully!", "success");
    document.getElementById('contact-form').reset();
    showAbout(); // Dynamic redirect to About section
  }
};

/* =========================================================
   8. RESUME & DYNAMIC PROJECTS SECTION
========================================================= */
window.showResume = function() {
  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';
  trackTabView('resume');

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
};

window.showProjects = async function(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "projects" }, "", window.location.pathname + "#projects");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('projects-section').style.display = 'block';
  trackTabView('projects');

  let allProjects = [...projects];

  if (supabaseClient) {
    try {
      const { data: dbProjects } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbProjects && dbProjects.length > 0) {
        const formatted = dbProjects.map(p => ({
          name: p.name,
          repo: p.repo,
          readme: p.readme,
          img: p.img,
          desc: p.desc_text
        }));
        allProjects = [...allProjects, ...formatted];
      }
    } catch (err) {
      console.error("Error fetching dynamic projects:", err);
    }
  }

  const projCount = document.getElementById("proj-count");
  if (projCount) projCount.innerText = allProjects.length;

  let html = '';
  allProjects.forEach((proj) => {
    html += `
      <div class="card-container" onclick="loadDynamicProjectContent('${proj.repo}')">
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
};

window.loadDynamicProjectContent = function(repoPath, addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "project", repo: repoPath }, "", window.location.pathname + "#project");
  }

  const mainContent = document.getElementById('main-content');
  document.getElementById('projects-section').style.display = 'none';
  mainContent.style.display = 'block';
  trackTabView('project_detail');

  const url = `https://raw.githubusercontent.com/${repoPath}/main/README.md`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("README not found");
      return res.text();
    })
    .then(md => {
      mainContent.innerHTML = marked.parse(md);
    })
    .catch(() => {
      mainContent.innerHTML = '<p style="text-align:center; padding: 2rem;">Could not load README from GitHub repository.</p>';
    });
};

/* =========================================================
   9. ADMIN PORTAL SECTION
========================================================= */
window.showAdminPortal = async function(addHistory = true) {
  if (addHistory) {
    history.pushState({ page: "admin" }, "", window.location.pathname + "#admin");
  }

  prepareMainSite();
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('projects-section').style.display = 'none';
  trackTabView('admin_portal');

  // Trigger 7-day old logs cleanup automatically
  if (supabaseClient) {
    try {
      await supabaseClient.rpc('clean_old_visitor_logs');
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }

  document.getElementById('main-content').innerHTML = `
    <div style="padding: 30px; color: #fff; max-width: 900px; margin: 0 auto;">
      <h2 style="color: #7c5cff; margin-bottom: 20px;">🛡️ Admin Dashboard</h2>
      
      <div style="display: flex; gap: 15px; margin-bottom: 25px;">
        <button onclick="loadAdminTab('stats')" class="btn" style="background: #7c5cff;">Visitor Analytics</button>
        <button onclick="loadAdminTab('messages')" class="btn" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1);">Messages</button>
      </div>

      <div id="admin-tab-content">Loading...</div>
    </div>
  `;

  loadAdminTab('stats');
};

window.loadAdminTab = async function(tab) {
  const container = document.getElementById('admin-tab-content');
  if (!container || !supabaseClient) return;

  if (tab === 'stats') {
    container.innerHTML = "<p>Fetching analytics...</p>";
    
    const { data: daily } = await supabaseClient.from('daily_visitors').select('*').order('visit_date', { ascending: false });
    const { data: logs } = await supabaseClient.from('visitor_logs').select('*').order('created_at', { ascending: false }).limit(50);

    let dailyHtml = `<h3 style="margin-bottom:12px;">📅 Daily Total Views (Permanent)</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px; background: rgba(255,255,255,0.03);">
        <tr><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Date</th><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Views</th></tr>`;
    if (daily && daily.length > 0) {
      daily.forEach(d => { 
        dailyHtml += `<tr><td style="padding:8px; border:1px solid rgba(255,255,255,0.1); text-align:center;">${d.visit_date}</td><td style="padding:8px; border:1px solid rgba(255,255,255,0.1); text-align:center; color:#5ce1e6; font-weight:bold;">${d.total_views}</td></tr>`; 
      });
    } else {
      dailyHtml += `<tr><td colspan="2" style="padding:10px; text-align:center;">No analytics yet.</td></tr>`;
    }
    dailyHtml += `</table>`;

    let logsHtml = `<h3 style="margin-bottom:12px;">🕒 Recent Activity (Last 7 Days Auto-Clearing)</h3>
      <table style="width:100%; border-collapse:collapse; background: rgba(255,255,255,0.03);">
        <tr><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Visitor ID</th><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Location / IP</th><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Tab</th><th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Time</th></tr>`;
    if (logs && logs.length > 0) {
      logs.forEach(l => { 
        logsHtml += `<tr>
          <td style="padding:8px; border:1px solid rgba(255,255,255,0.1); font-size:0.85rem;">${l.visitor_id}</td>
          <td style="padding:8px; border:1px solid rgba(255,255,255,0.1); font-size:0.85rem;">${l.location || 'Unknown'} (${l.user_ip || 'N/A'})</td>
          <td style="padding:8px; border:1px solid rgba(255,255,255,0.1); color:#7c5cff; font-weight:bold; text-align:center;">${l.tab_name}</td>
          <td style="padding:8px; border:1px solid rgba(255,255,255,0.1); font-size:0.8rem; text-align:center;">${new Date(l.created_at).toLocaleString()}</td>
        </tr>`; 
      });
    } else {
      logsHtml += `<tr><td colspan="4" style="padding:10px; text-align:center;">No recent logs.</td></tr>`;
    }
    logsHtml += `</table>`;

    container.innerHTML = dailyHtml + logsHtml;

  } else if (tab === 'messages') {
    container.innerHTML = "<p>Fetching messages...</p>";
    const { data: msgs } = await supabaseClient.from('personal_messages').select('*').order('created_at', { ascending: false });

    let msgHtml = `<h3 style="margin-bottom:12px;">📩 Received Messages</h3><div style="display:flex; flex-direction:column; gap:15px;">`;
    if (msgs && msgs.length > 0) {
      msgs.forEach(m => {
        msgHtml += `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
          <p><strong>Name:</strong> ${m.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${m.email}" style="color:#5ce1e6;">${m.email}</a></p>
          <p><strong>Message:</strong> ${m.message}</p>
          <p style="font-size:0.75rem; color:#94a3b8; margin-top:5px;">Received: ${new Date(m.created_at).toLocaleString()}</p>
        </div>`;
      });
    } else {
      msgHtml += `<p>No messages received yet.</p>`;
    }
    msgHtml += `</div>`;
    container.innerHTML = msgHtml;
  }
};

/* =========================================================
   10. BROWSER HISTORY & BACKGROUND ANIMATIONS
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
    loadDynamicProjectContent(state.repo, false);
  } else if (state.page === "admin") {
    showAdminPortal(false);
  }
});

history.replaceState({ page: "landing" }, "", window.location.pathname);

document.addEventListener('DOMContentLoaded', () => {

  // FIX FOR MAILTO LINKS: Stop navigation interruption for direct email clicks
  document.addEventListener('click', (e) => {
    const mailLink = e.target.closest('a[href^="mailto:"]');
    if (mailLink) {
      e.stopPropagation();
    }
  }, true);

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

  const electricity = document.getElementById('electricity');
  if (electricity) {
    for (let i = 0; i < 60; i++) {
      const bolt = document.createElement('div');
      bolt.classList.add('bolt');
      bolt.style.left = Math.random() * 100 + '%';
      bolt.style.height = (Math.random() * 160 + 60) + 'px';
      bolt.style.animationDuration = (Math.random() * 10 + 1.2) + 's';
      bolt.style.animationDelay = Math.random() * -5 + 's';
      electricity.appendChild(bolt);
    }
  }

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

  showLanding();
});
