/* ════════════════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '0,201,177' : (Math.random() > 0.5 ? '79,184,255' : '232,201,106');
  }

  function init(){
    resize();
    particles = [];
    const count = Math.min(Math.floor(W * H / 12000), 120);
    for(let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
      if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    // draw connections
    for(let i = 0; i < particles.length; i++){
      for(let j = i+1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 100){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,201,177,${0.06 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ════════════════════════════════════════════════════════
   ADMIN AUTH
════════════════════════════════════════════════════════ */
const ADMIN_USER = 'memoona';
const ADMIN_PASS = 'finance2025';
let isAdmin = false;

function attemptLogin(){
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if(u === ADMIN_USER && p === ADMIN_PASS){
    isAdmin = true;
    document.body.classList.add('admin-mode');
    document.getElementById('adminBadge').classList.remove('hidden');
    closeModal('loginModal');
    toast('✓ Admin mode activated — you can now edit the portfolio');
  } else {
    document.getElementById('loginError').classList.add('show');
    document.getElementById('loginPass').value = '';
  }
}

function exitAdmin(){
  isAdmin = false;
  document.body.classList.remove('admin-mode');
  document.getElementById('adminBadge').classList.add('hidden');
  toast('Admin mode deactivated');
}

document.addEventListener('keydown', e => {
  if(e.key === 'Enter' && document.getElementById('loginModal').classList.contains('open')) attemptLogin();
});

/* ════════════════════════════════════════════════════════
   MODAL SYSTEM
════════════════════════════════════════════════════════ */
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
  const err = document.getElementById('loginError');
  if(err) err.classList.remove('show');
}
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if(e.target === m) closeModal(m.id); });
});

/* ════════════════════════════════════════════════════════
   NAV
════════════════════════════════════════════════════════ */
let mobileOpen = false;
function toggleMobile(){ mobileOpen=!mobileOpen; document.getElementById('mobileNav').classList.toggle('open',mobileOpen); }
function closeMobile(){ mobileOpen=false; document.getElementById('mobileNav').classList.remove('open'); }

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  // active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
});

/* ════════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════════════════════
   SKILL BARS
════════════════════════════════════════════════════════ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.width + '%'; });
      barObs.unobserve(e.target);
    }
  });
}, {threshold:0.2});
const sw = document.getElementById('skillBarsWrap');
if(sw) barObs.observe(sw);

/* ════════════════════════════════════════════════════════
   STORAGE HELPERS
════════════════════════════════════════════════════════ */
function getStore(k){ try{ return JSON.parse(localStorage.getItem('ma2_'+k))||[]; }catch{ return []; } }
function saveStore(k,v){ localStorage.setItem('ma2_'+k,JSON.stringify(v)); }
function getStr(k,def){ return localStorage.getItem('ma2_'+k)||def||''; }
function setStr(k,v){ localStorage.setItem('ma2_'+k,v); }

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ════════════════════════════════════════════════════════
   ADMIN ONLY NOTICE
════════════════════════════════════════════════════════ */
function adminOnlyNotice(){
  if(!isAdmin){ toast('Login as admin to manage photos.'); openModal('loginModal'); }
}

/* ════════════════════════════════════════════════════════
   CV DOWNLOAD
════════════════════════════════════════════════════════ */
let cvDataUrl = getStr('ma2_cv_data','');
const CV_FILENAME = getStr('ma2_cv_filename','Memoona_Almas_CV_Updated.pdf');

function downloadCV(){
  if(cvDataUrl){
    const a = document.createElement('a');
    a.href = cvDataUrl;
    a.download = getStr('ma2_cv_filename','Memoona_Almas_CV.pdf');
    a.click();
    toast('📄 CV downloaded!');
  } else {
    toast('📄 CV: Please ask the portfolio owner to upload the CV file via Admin panel.');
    if(isAdmin){ document.getElementById('cvPanel').classList.add('open'); }
  }
}

function handleCVUpload(input){
  const file = input.files[0];
  if(!file) return;
  if(file.type !== 'application/pdf'){ toast('⚠ Please select a PDF file.'); return; }
  const reader = new FileReader();
  reader.onload = function(e){
    cvDataUrl = e.target.result;
    setStr('ma2_cv_data', cvDataUrl);
    setStr('ma2_cv_filename', file.name);
    document.getElementById('cvFileName').value = file.name;
    toast('✓ CV uploaded! Visitors can now download it.');
  };
  reader.readAsDataURL(file);
}

function saveCVName(){
  const name = document.getElementById('cvFileName').value.trim();
  if(name) setStr('ma2_cv_filename', name);
  toast('✓ CV settings saved.');
}

function openCVPanel(){
  if(!isAdmin){ openModal('loginModal'); return; }
  document.getElementById('cvPanel').classList.toggle('open');
}

/* ════════════════════════════════════════════════════════
   CONTACT INFO
════════════════════════════════════════════════════════ */
function loadContactInfo(){
  const em = getStr('ma2_email','moona78615@gmail.com');
  const ph = getStr('ma2_phone','0320-7475162');
  const lo = getStr('ma2_location','Bhalwal, Sargodha, Pakistan');
  const li = getStr('ma2_linkedin','#');

  document.getElementById('disp-email').href = 'mailto:'+em;
  document.getElementById('disp-email').textContent = em;
  document.getElementById('disp-phone').textContent = ph;
  document.getElementById('disp-location').textContent = lo;
  document.getElementById('disp-linkedin').href = li;

  document.getElementById('contact-email').href = 'mailto:'+em;
  document.getElementById('contact-email').textContent = em;
  document.getElementById('contact-phone').textContent = ph;
  document.getElementById('contact-location').textContent = lo;
  document.getElementById('contact-linkedin').href = li;
  if(li && li !== '#') document.getElementById('contact-linkedin').textContent = li.replace('https://','');
}

function openContactModal(){
  if(!isAdmin){ toast('Login as admin to edit contact info.'); return; }
  document.getElementById('editEmail').value = getStr('ma2_email','moona78615@gmail.com');
  document.getElementById('editPhone').value = getStr('ma2_phone','0320-7475162');
  document.getElementById('editLocation').value = getStr('ma2_location','Bhalwal, Sargodha, Pakistan');
  document.getElementById('editLinkedin').value = getStr('ma2_linkedin','');
  openModal('contactModal');
}

function saveContactInfo(){
  setStr('ma2_email', document.getElementById('editEmail').value.trim());
  setStr('ma2_phone', document.getElementById('editPhone').value.trim());
  setStr('ma2_location', document.getElementById('editLocation').value.trim());
  setStr('ma2_linkedin', document.getElementById('editLinkedin').value.trim());
  loadContactInfo();
  closeModal('contactModal');
  toast('✓ Contact info updated!');
}

/* ════════════════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════════════════ */
function sendMessage(){
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const msg = document.getElementById('cf-message').value.trim();
  if(!name || !email || !msg){ toast('⚠ Please fill in all required fields.'); return; }
  const mailto = `mailto:moona78615@gmail.com?subject=${encodeURIComponent(subject||'Portfolio Inquiry')}&body=${encodeURIComponent('From: '+name+' ('+email+')\n\n'+msg)}`;
  window.location.href = mailto;
  toast('✓ Opening your email client...');
}

/* ════════════════════════════════════════════════════════
   EDUCATION SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitEducation(){
  if(!isAdmin) return;
  const data = {
    degree: document.getElementById('eduDegree').value.trim(),
    years: document.getElementById('eduYears').value.trim(),
    institute: document.getElementById('eduInstitute').value.trim(),
    metrics: document.getElementById('eduMetrics').value.trim(),
  };
  if(!data.degree || !data.institute){ toast('⚠ Please fill required fields.'); return; }
  const store = getStore('edu');
  store.unshift(data);
  saveStore('edu',store);
  document.getElementById('eduDegree').value=''; document.getElementById('eduYears').value='';
  document.getElementById('eduInstitute').value=''; document.getElementById('eduMetrics').value='';
  closeModal('educationModal');
  renderEducation();
  toast('✓ Education entry added!');
}

function renderEducation(){
  const container = document.getElementById('dynamicEducation');
  container.innerHTML = '';
  getStore('edu').forEach(item => {
    const div = document.createElement('div');
    div.className = 't-item reveal';
    div.innerHTML = `<div class="t-dot"></div><div class="t-card"><div class="t-card-top"><div><h3 class="t-degree">${item.degree}</h3><p class="t-inst">${item.institute}</p></div><span class="t-badge">${item.years}</span></div><span class="t-metric">${item.metrics}</span></div>`;
    container.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
    revealObs.observe(div);
  });
}

/* ════════════════════════════════════════════════════════
   SKILLS SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitSkill(){
  if(!isAdmin) return;
  const name = document.getElementById('skillName').value.trim();
  const level = parseInt(document.getElementById('skillLevel').value) || 0;
  if(!name || level < 0 || level > 100){
    toast('✗ Please enter valid skill name and level (0-100)');
    return;
  }
  const data = { name, level };
  const store = getStore('skills');
  store.push(data);
  saveStore('skills', store);
  document.getElementById('skillName').value = '';
  document.getElementById('skillLevel').value = '';
  closeModal('skillModal');
  renderSkills();
  toast('✓ Skill added!');
}

function renderSkills(){
  const container = document.getElementById('dynamicSkills');
  container.innerHTML = '';
  getStore('skills').forEach(item => {
    const div = document.createElement('div');
    div.className = 'skill-row';
    div.innerHTML = `<div class="skill-name-row"><span class="skill-name">${item.name}</span><span class="skill-pct">${item.level}%</span></div><div class="skill-bar"><div class="skill-fill" data-width="${item.level}"></div></div>`;
    container.appendChild(div);
  });
  // trigger animation
  setTimeout(() => {
    document.querySelectorAll('.skill-fill').forEach(el => {
      const width = el.getAttribute('data-width');
      el.style.width = width + '%';
    });
  }, 50);
}

/* ════════════════════════════════════════════════════════
   PROFESSIONAL SKILLS SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitProfSkill(){
  if(!isAdmin) return;
  const name = document.getElementById('profSkillName').value.trim();
  if(!name){
    toast('✗ Please enter a skill name');
    return;
  }
  const data = { name };
  const store = getStore('prof_skills');
  store.push(data);
  saveStore('prof_skills', store);
  document.getElementById('profSkillName').value = '';
  closeModal('profSkillModal');
  renderProfSkills();
  toast('✓ Professional skill added!');
}

function renderProfSkills(){
  const container = document.getElementById('dynamicProfSkills');
  container.innerHTML = '';
  getStore('prof_skills').forEach(item => {
    const div = document.createElement('div');
    div.className = 'soft-skill-item';
    div.textContent = item.name;
    container.appendChild(div);
  });
}

/* ════════════════════════════════════════════════════════
   PROFILE PHOTO UPLOAD & LOADING
════════════════════════════════════════════════════════ */
function handlePhotoFileUpload(input){
  if(!isAdmin) return;
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('photoUrl').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function submitProfilePhoto(){
  if(!isAdmin) return;
  const photoUrl = document.getElementById('photoUrl').value.trim();
  const cgpa = document.getElementById('editCGPA').value.trim();
  if(photoUrl){
    setStr('ma2_profile_photo', photoUrl);
    loadProfilePhoto();
  }
  if(cgpa){
    setStr('ma2_cgpa', cgpa);
    document.getElementById('displayCGPA').textContent = cgpa;
  }
  closeModal('photoUploadModal');
  toast('✓ Profile photo updated!');
}

function loadProfilePhoto(){
  const photoUrl = getStr('ma2_profile_photo');
  const cgpa = getStr('ma2_cgpa');
  if(cgpa) document.getElementById('displayCGPA').textContent = cgpa;
  if(photoUrl){
    const imgEl = document.getElementById('aboutImgDisplay');
    const initials = document.getElementById('aboutInitials');
    imgEl.src = photoUrl;
    imgEl.style.display = 'block';
    initials.style.display = 'none';
  }
}

/* ════════════════════════════════════════════════════════
   EXPERIENCE SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitExperience(){
  if(!isAdmin) return;
  const bulletsRaw = document.getElementById('expBullets').value.trim();
  const data = {
    role: document.getElementById('expRole').value.trim(),
    duration: document.getElementById('expDuration').value.trim(),
    company: document.getElementById('expCompany').value.trim(),
    bullets: bulletsRaw.split(',').map(b=>b.trim()).filter(Boolean),
  };
  if(!data.role || !data.company){ toast('⚠ Please fill required fields.'); return; }
  const store = getStore('exp');
  store.unshift(data);
  saveStore('exp',store);
  ['expRole','expDuration','expCompany','expBullets'].forEach(id => document.getElementById(id).value='');
  closeModal('experienceModal');
  renderExperience();
  toast('✓ Experience entry added!');
}

function renderExperience(){
  const container = document.getElementById('dynamicExperience');
  container.innerHTML = '';
  getStore('exp').forEach(item => {
    const li = item.bullets.map(b=>`<li>${b}</li>`).join('');
    const div = document.createElement('div');
    div.className = 'exp-card reveal';
    div.innerHTML = `<div class="exp-card-top"><div><h3 class="exp-role">${item.role}</h3><p class="exp-org">${item.company}</p></div><span class="exp-duration">${item.duration}</span></div><ul class="exp-bullets">${li}</ul>`;
    container.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });
}

/* ════════════════════════════════════════════════════════
   PROJECT SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitProject(){
  if(!isAdmin) return;
  const tagsRaw = document.getElementById('projTags').value.trim();
  const data = {
    title: document.getElementById('projTitle').value.trim(),
    year: document.getElementById('projYear').value.trim(),
    org: document.getElementById('projOrg').value.trim(),
    icon: document.getElementById('projIcon').value.trim() || '📋',
    desc: document.getElementById('projDesc').value.trim(),
    tags: tagsRaw.split(',').map(t=>t.trim()).filter(Boolean),
  };
  if(!data.title || !data.desc){ toast('⚠ Please fill required fields.'); return; }
  const store = getStore('proj');
  store.unshift(data);
  saveStore('proj',store);
  ['projTitle','projYear','projOrg','projIcon','projDesc','projTags'].forEach(id=>document.getElementById(id).value='');
  closeModal('projectModal');
  renderProjects();
  toast('✓ Project added!');
}

function renderProjects(){
  const container = document.getElementById('dynamicProjects');
  container.innerHTML = '';
  getStore('proj').forEach(item => {
    const tagsHtml = item.tags?.map(t=>`<span class="proj-tag">${t}</span>`).join('')||'';
    const div = document.createElement('div');
    div.className = 'project-card reveal';
    div.innerHTML = `<div class="proj-icon">${item.icon||'📋'}</div><div class="proj-top"><span class="proj-year">${item.year}</span><span class="proj-org">${item.org}</span></div><h3 class="proj-title">${item.title}</h3><p class="proj-desc">${item.desc}</p>${tagsHtml?`<div class="proj-tags">${tagsHtml}</div>`:''}`;
    container.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });
}

/* ════════════════════════════════════════════════════════
   ACHIEVEMENT SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function submitAchievement(){
  if(!isAdmin) return;
  const data = {
    tag: document.getElementById('achTag').value.trim(),
    icon: document.getElementById('achIcon').value.trim() || '🏅',
    title: document.getElementById('achTitle').value.trim(),
    desc: document.getElementById('achDesc').value.trim(),
    year: document.getElementById('achYear').value.trim(),
  };
  if(!data.title){ toast('⚠ Please enter a title.'); return; }
  const store = getStore('ach');
  store.unshift(data);
  saveStore('ach',store);
  ['achTag','achIcon','achTitle','achDesc','achYear'].forEach(id=>document.getElementById(id).value='');
  closeModal('achievementModal');
  renderAchievements();
  toast('✓ Achievement added!');
}

function renderAchievements(){
  const container = document.getElementById('dynamicAchievements');
  container.innerHTML = '';
  getStore('ach').forEach(item => {
    const div = document.createElement('div');
    div.className = 'ach-card reveal';
    div.innerHTML = `<div class="ach-icon-box">${item.icon||'🏅'}</div><div class="ach-tag-pill">${item.tag}</div><h3 class="ach-title">${item.title}</h3><p class="ach-desc">${item.desc}</p><span class="ach-year">${item.year}</span>`;
    container.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });
}

/* ════════════════════════════════════════════════════════
   MEDIA (ARTICLES / VIDEOS / PHOTOS) SUBMIT & RENDER
════════════════════════════════════════════════════════ */
function toggleMediaType(){
  const type = document.getElementById('mediaType').value;
  document.getElementById('mediaArticleGroup').classList.toggle('hidden', type !== 'article');
  document.getElementById('mediaVideoGroup').classList.toggle('hidden', type !== 'video');
  document.getElementById('mediaPhotoGroup').classList.toggle('hidden', type !== 'photo');
}

function switchTab(tab, btn){
  document.querySelectorAll('.media-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.media-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-'+tab).classList.add('active');
  btn.classList.add('active');
}

function submitMedia(){
  if(!isAdmin) return;
  const type = document.getElementById('mediaType').value;
  const title = document.getElementById('mediaTitle').value.trim();
  const tag = document.getElementById('mediaTag').value.trim();
  const date = document.getElementById('mediaDate').value;
  if(!title){ toast('⚠ Please enter a title.'); return; }

  const data = { type, title, tag, date };
  if(type === 'article'){
    data.content = document.getElementById('mediaContent').value.trim();
  } else if(type === 'video'){
    data.videoUrl = document.getElementById('mediaVideoUrl').value.trim();
    data.desc = document.getElementById('mediaVideoDesc').value.trim();
  } else if(type === 'photo'){
    data.photoUrl = document.getElementById('mediaPhotoUrl').value.trim();
    data.caption = document.getElementById('mediaPhotoCaption').value.trim();
  }

  const store = getStore('media');
  store.unshift(data);
  saveStore('media',store);
  ['mediaTitle','mediaTag','mediaContent','mediaVideoUrl','mediaVideoDesc','mediaPhotoUrl','mediaPhotoCaption'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('mediaDate').value='';
  closeModal('mediaModal');
  renderMedia();
  toast('✓ Content published!');
}

function formatDate(s){
  if(!s) return '';
  return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

function getYTEmbed(url){
  if(!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if(m) return `https://www.youtube.com/embed/${m[1]}`;
  const v = url.match(/vimeo\.com\/(\d+)/);
  if(v) return `https://player.vimeo.com/video/${v[1]}`;
  return '';
}

function renderMedia(){
  const items = getStore('media');
  const arts = items.filter(i => i.type === 'article');
  const vids = items.filter(i => i.type === 'video');
  const photos = items.filter(i => i.type === 'photo');

  // Articles
  const ag = document.getElementById('articlesGrid');
  const ae = document.getElementById('articlesEmpty');
  const sa = document.getElementById('sampleArticle');

  const dynArt = document.getElementById('dynamicArticles');
  if(!dynArt){
    const d = document.createElement('div'); d.id='dynamicArticles';
    ag.appendChild(d);
  }
  const da = document.getElementById('dynamicArticles');
  if(da) da.innerHTML = '';
  arts.forEach(item => {
    const div = document.createElement('div');
    div.className = 'article-card reveal';
    div.innerHTML = `<div class="article-card-img">📰</div><div class="article-card-body"><div class="article-card-meta"><span class="article-tag-pill">${item.tag||'Article'}</span><span class="article-date-txt">${formatDate(item.date)}</span></div><h3 class="article-card-title">${item.title}</h3><p class="article-card-excerpt">${(item.content||'').substring(0,200)}${(item.content||'').length>200?'...':''}</p><span class="article-read-more" onclick='openArticle(${JSON.stringify(item)})'>Read More →</span></div>`;
    if(da) da.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });

  // Videos
  const vg = document.getElementById('videosGrid');
  const dynVid = document.getElementById('dynamicVideos');
  if(!dynVid){ const d=document.createElement('div'); d.id='dynamicVideos'; vg.appendChild(d); }
  const dv = document.getElementById('dynamicVideos');
  if(dv) dv.innerHTML = '';
  vids.forEach(item => {
    const embed = getYTEmbed(item.videoUrl);
    const div = document.createElement('div');
    div.className = 'article-card reveal';
    div.innerHTML = `<div class="article-card-img">${embed?`<iframe src="${embed}" allowfullscreen style="width:100%;height:100%;border:none"></iframe>`:'▶'}</div><div class="article-card-body"><div class="article-card-meta"><span class="article-tag-pill">${item.tag||'Video'}</span><span class="article-date-txt">${formatDate(item.date)}</span></div><h3 class="article-card-title">${item.title}</h3><p class="article-card-excerpt">${item.desc||''}</p></div>`;
    if(dv) dv.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });

  // Photos
  const pg = document.getElementById('photosGrid');
  const dynPh = document.getElementById('dynamicPhotos');
  if(!dynPh){ const d=document.createElement('div'); d.id='dynamicPhotos'; pg.appendChild(d); }
  const dp = document.getElementById('dynamicPhotos');
  if(dp) dp.innerHTML = '';
  photos.forEach(item => {
    const div = document.createElement('div');
    div.className = 'photo-card reveal';
    div.onclick = () => openLightbox(item.photoUrl);
    if(item.photoUrl){
      div.innerHTML = `<img src="${item.photoUrl}" alt="${item.caption||''}" onerror="this.style.display='none'">`;
    } else {
      div.innerHTML = `<div class="photo-placeholder"><span style="font-size:32px">📷</span><span>${item.caption||'Photo'}</span></div>`;
    }
    if(dp) dp.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  });
}

function openArticle(item){
  document.getElementById('articleReadTitle').textContent = item.title;
  document.getElementById('articleReadMeta').innerHTML = `<span class="article-tag-pill">${item.tag||'Article'}</span><span class="article-date-txt">${formatDate(item.date)}</span>`;
  document.getElementById('articleReadBody').textContent = item.content || '';
  openModal('articleReadModal');
}

/* ════════════════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════════════════ */
function openLightbox(src){
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}

/* ════════════════════════════════════════════════════════
   EXPORT / IMPORT
════════════════════════════════════════════════════════ */
window.exportPortfolioData = function(){
  const keys = ['ma2_edu','ma2_exp','ma2_proj','ma2_ach','ma2_media','ma2_email','ma2_phone','ma2_location','ma2_linkedin','ma2_cv_filename'];
  const data = {};
  keys.forEach(k => { const v = localStorage.getItem(k); if(v) data[k]=v; });
  const str = JSON.stringify({exportedAt:new Date().toISOString(),data},null,2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([str],{type:'application/json'}));
  a.download = 'memoona-portfolio-backup.json';
  a.click();
  return 'Exported!';
};

window.importPortfolioData = function(jsonStr){
  try{
    const obj = JSON.parse(jsonStr);
    if(!obj.data) throw new Error('Invalid');
    Object.keys(obj.data).forEach(k => localStorage.setItem(k, obj.data[k]));
    loadAll(); toast('✓ Portfolio data imported!');
  } catch(e){ console.error(e); }
};

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
function loadAll(){
  loadContactInfo();
  loadProfilePhoto();
  renderSkills();
  renderProfSkills();
  renderEducation();
  renderExperience();
  renderProjects();
  renderAchievements();
  renderMedia();
}

document.addEventListener('DOMContentLoaded', loadAll);
