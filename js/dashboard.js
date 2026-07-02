/* ============================================================
   ARTHI CONSTRUCTIONS — Dashboard Logic (Backend Integrated)
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  // ---- Auth Guard ----
  AUTH.guard();

  // ---- Modal helpers ----
  window.openModal  = id => { const el = document.getElementById(id); if (el) el.classList.add('open'); };
  window.closeModal = id => { const el = document.getElementById(id); if (el) el.classList.remove('open'); };
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-close-modal]');
    if (btn) closeModal(btn.getAttribute('data-close-modal'));
    const overlay = e.target.closest('.modal-overlay');
    if (overlay && e.target === overlay) {
      const id = overlay.id;
      if (id) closeModal(id);
    }
  });

  // ---- Populate session/profile ----
  let profile = AUTH.getProfile();
  
  // Connect Socket.IO
  let socket = null;
  if (window.io && profile.projectId) {
    socket = io('http://localhost:5000');
    socket.emit('join_project', {
      projectId: profile.projectId,
      userId: profile.id,
      role: profile.role
    });
    console.log(`🔌 Socket connection initiated. Subscribed to project_${profile.projectId}`);
  }

  // Refresh user profile details from backend
  try {
    const freshProfile = await API.getProfile();
    AUTH.saveProfile(freshProfile);
    profile = freshProfile;
  } catch (err) {
    console.warn('Could not fetch fresh profile, using cached session details.', err);
  }

  // Render basic user visual details
  if (profile.name) {
    const el = document.getElementById('sbName');
    if (el) el.textContent = profile.name;
    const wb = document.getElementById('wbName');
    if (wb) wb.textContent = profile.name;
    const av = document.getElementById('sbAvatar');
    if (av) av.textContent = profile.avatar || profile.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  }
  if (profile.clientCode) {
    const pr = document.getElementById('wbProject');
    if (pr) pr.textContent = 'Project Code: ' + profile.clientCode;
  }

  // ---- Live Time ----
  function updateTime() {
    const el = document.getElementById('topbarTime');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  updateTime();
  setInterval(updateTime, 60000);

  // ---- Sidebar Navigation ----
  const panels  = document.querySelectorAll('.db-panel');
  const sbItems = document.querySelectorAll('.sb-item[data-panel]');
  const pageTitles = {
    overview:     '🏠 Overview',
    gallery:      '📸 Gallery',
    notifications:'🔔 Notifications',
    chat:         '💬 Chat',
    'book-call':  '📞 Book a Call',
    'site-visit': '📅 Book Site Visit',
    requests:     '📋 Raise Request',
    payments:     '💳 Payments',
    documents:    '📂 Documents',
    explore:      '🏗️ Explore Projects',
    simulator:    '🛋️ Room Simulator'
  };

  function switchPanel(panelId) {
    panels.forEach(p => p.classList.remove('active'));
    sbItems.forEach(i => i.classList.remove('active'));
    const target = document.getElementById('panel-' + panelId);
    if (target) target.classList.add('active');
    const activeItem = document.querySelector(`.sb-item[data-panel="${panelId}"]`);
    if (activeItem) activeItem.classList.add('active');
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = pageTitles[panelId] || panelId;
    if (window.innerWidth < 900) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  }

  sbItems.forEach(item => {
    item.addEventListener('click', () => switchPanel(item.getAttribute('data-panel')));
  });

  // ---- Handle ?panel= URL param (e.g. from project pages linking to dashboard) ----
  const urlPanel = new URLSearchParams(window.location.search).get('panel');
  if (urlPanel && document.getElementById('panel-' + urlPanel)) {
    switchPanel(urlPanel);
  }

  // Buttons with data-panel attribute anywhere on page
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-panel]');
    if (btn && !btn.classList.contains('sb-item')) {
      switchPanel(btn.getAttribute('data-panel'));
    }
    const notifBtn = e.target.closest('.notif-btn');
    if (notifBtn) switchPanel('notifications');
  });

  // ---- Sidebar Toggle (mobile) ----
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  if (sidebarToggle) sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  if (sidebarClose) sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

  // ---- Logout ----
  document.getElementById('logoutBtn').addEventListener('click', () => {
    AUTH.logout();
  });

  // ============================================================
  //  CORE DATA LOADING & SYNCING
  // ============================================================
  
  // Track stats dynamically
  let projectDetails = null;

  async function loadDashboardData() {
    if (!profile.projectId) return;

    try {
      // 1. Fetch Project Details
      projectDetails = await API.getProjectDetails(profile.projectId);
      renderProjectOverview(projectDetails);

      // 2. Fetch Construction Updates & Timeline
      renderTimeline(projectDetails.constructionUpdates);

      // 3. Fetch Gallery items
      renderGallery(projectDetails.gallery);

      // 4. Fetch Payments history
      loadPayments();

      // 5. Fetch Documents
      loadDocuments(projectDetails.documents);

      // 6. Fetch raised requests
      loadRequests();

      // 7. Load Notifications
      loadNotifications();

      // 8. Load Chat messages
      loadChat();

    } catch (err) {
      console.error('Error loading dashboard project details:', err);
      showToast('Failed to load project details from server.', 'error');
    }
  }

  // ============================================================
  //  OVERVIEW & TIMELINE
  // ============================================================
  function renderProjectOverview(project) {
    // Project title card
    const idEl = document.getElementById('wbProject');
    if (idEl) idEl.textContent = `Project: ${project.name} (${profile.clientCode})`;
    
    // Stats cards
    const statsContainer = document.querySelector('.db-stats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="db-stat-card">
          <div class="ico gold">🏗️</div>
          <div>
            <div class="val" id="stat-progress">${project.constructionProgress}%</div>
            <div class="lbl">Construction Done</div>
          </div>
        </div>
        <div class="db-stat-card">
          <div class="ico green">✅</div>
          <div>
            <div class="val" id="stat-milestones">${project.constructionUpdates.filter(u => u.percentage === 100).length} / ${project.constructionUpdates.length}</div>
            <div class="lbl">Milestones Cleared</div>
          </div>
        </div>
        <div class="db-stat-card">
          <div class="ico blue">💳</div>
          <div>
            <div class="val" id="stat-payments">₹${(project.constructionProgress > 50 ? '48L' : '22L')}</div>
            <div class="lbl">Amount Paid</div>
          </div>
        </div>
        <div class="db-stat-card">
          <div class="ico warn">📅</div>
          <div>
            <div class="val" id="stat-handover">${project.expectedCompletion.split(' ')[0]} ${project.expectedCompletion.split(' ').slice(-1)[0]}</div>
            <div class="lbl">Est. Handover</div>
          </div>
        </div>
      `;
    }

    // Construction progress list bars
    const progressList = document.querySelector('#panel-overview .db-card-body');
    if (progressList && project.constructionUpdates) {
      let overallProgressHtml = '';
      project.constructionUpdates.forEach((up, idx) => {
        const barColor = up.percentage === 100 ? 'green' : up.percentage > 50 ? 'blue' : '';
        overallProgressHtml += `
          <div class="progress-wrap">
            <div class="progress-label"><span>${up.stage}</span><strong>${up.percentage}%</strong></div>
            <div class="progress-bar"><div class="progress-fill ${barColor}" style="width:${up.percentage}%"></div></div>
          </div>
        `;
      });

      // Overall progress summary bar
      overallProgressHtml += `
        <div class="progress-wrap" style="margin-bottom:0">
          <div class="progress-label"><span><strong>Overall</strong></span><strong>${project.constructionProgress}%</strong></div>
          <div class="progress-bar" style="height:12px"><div class="progress-fill" style="width:${project.constructionProgress}%"></div></div>
        </div>
      `;
      progressList.innerHTML = overallProgressHtml;
    }
  }

  function renderTimeline(updates) {
    const timelineList = document.querySelector('.timeline');
    if (!timelineList || !updates) return;

    let timelineHtml = '';
    updates.forEach(u => {
      let statusDot = 'future';
      let dotContent = '○';

      if (u.percentage === 100) {
        statusDot = 'done';
        dotContent = '✓';
      } else if (u.percentage > 0) {
        statusDot = 'active';
        dotContent = '●';
      }

      const formattedDate = new Date(u.date || Date.now()).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });

      timelineHtml += `
        <li class="timeline-item">
          <div class="tl-dot ${statusDot}">${dotContent}</div>
          <div class="tl-content">
            <div class="tl-title">${u.stage}</div>
            <div class="tl-sub">${u.note || (u.percentage === 100 ? 'Completed successfully' : `In progress — ${u.percentage}% done`)}</div>
            <div class="tl-date">${formattedDate}</div>
          </div>
        </li>
      `;
    });
    timelineList.innerHTML = timelineHtml;
  }

  // ============================================================
  //  CONSTRUCTION GALLERY & LIGHTBOX
  // ============================================================
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbCaption  = document.getElementById('lbCaption');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');
  let lbItems = [], lbIndex = 0;

  function openLightbox(items, index) {
    lbItems = items;
    lbIndex = index;
    showLbSlide();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showLbSlide() {
    const item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbCaption.textContent = item.cap || '';
  }

  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)   lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showLbSlide(); });
  if (lbNext)   lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbItems.length; showLbSlide(); });
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; showLbSlide(); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbItems.length; showLbSlide(); }
  });

  function renderGallery(galleryItems) {
    // 1. Overview panel preview strip (take last 4)
    const previewStrip = document.querySelector('.gallery-strip');
    const recentItems = galleryItems.slice(0, 4);
    if (previewStrip) {
      if (recentItems.length === 0) {
        previewStrip.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:20px;">No updates loaded yet.</div>';
      } else {
        previewStrip.innerHTML = recentItems.map(g => `
          <div class="gs-item" data-lb-src="${g.url}" data-lb-cap="${g.caption || ''}">
            <img src="${g.url}" alt="${g.caption || 'site preview'}">
            <div class="overlay">🔍</div>
          </div>
        `).join('');
      }
    }

    // 2. Main Gallery panel grid
    const mainGrid = document.getElementById('galleryGrid');
    if (mainGrid) {
      if (galleryItems.length === 0) {
        mainGrid.innerHTML = '<div style="grid-column: span 3; color:var(--text-muted); padding:40px; text-align:center;">No photo uploads yet.</div>';
      } else {
        mainGrid.innerHTML = galleryItems.map(g => `
          <div class="gp-item" data-lb-src="${g.url}" data-lb-cap="${g.caption || ''}">
            <img src="${g.url}" alt="${g.caption || 'site progress'}">
            <div class="gp-overlay">🔍</div>
          </div>
        `).join('');
      }
    }

    // Attach lightbox triggers to newly rendered elements
    document.querySelectorAll('[data-lb-src]').forEach((el, i, all) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const items = Array.from(all).map(a => ({ src: a.getAttribute('data-lb-src'), cap: a.getAttribute('data-lb-cap') }));
        openLightbox(items, i);
      });
    });
  }

  // ============================================================
  //  NOTIFICATIONS & ANNOUNCEMENTS
  // ============================================================
  async function loadNotifications() {
    try {
      const notifs = await API.getNotifications();
      renderNotifications(notifs);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }

  function renderNotifications(notifs) {
    // 1. Top bar indicator dot
    const dot = document.querySelector('.notif-btn .dot');
    const unreadCount = notifs.filter(n => !n.read).length;
    if (dot) {
      dot.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    // 2. Sidebar badge count
    const badge = document.querySelector('.sb-item[data-panel="notifications"] .badge');
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }

    // 3. Home Panel Overview: latest notifications
    const recentNotifBody = document.querySelector('.notif-list');
    if (recentNotifBody) {
      const recent = notifs.slice(0, 3);
      if (recent.length === 0) {
        recentNotifBody.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:20px;">No updates.</div>';
      } else {
        recentNotifBody.innerHTML = recent.map(n => {
          const typeIcon = n.title.toLowerCase().includes('payment') ? '💳' : n.title.toLowerCase().includes('photo') ? '📸' : '🔔';
          return `
            <div class="notif-item ${!n.read ? 'unread' : ''}" data-id="${n.id}">
              <div class="ni-ico">${typeIcon}</div>
              <div>
                <div class="ni-title">${n.title}</div>
                <div class="ni-sub">${n.body}</div>
                <div class="ni-time">${timeAgo(new Date(n.timestamp))}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Notifications Panel
    const mainNotifList = document.querySelector('#panel-notifications .notif-list');
    if (mainNotifList) {
      if (notifs.length === 0) {
        mainNotifList.innerHTML = '<div style="color:var(--text-muted);padding:40px;text-align:center;">You have no notifications yet.</div>';
      } else {
        mainNotifList.innerHTML = notifs.map(n => {
          const typeIcon = n.title.toLowerCase().includes('payment') ? '💳' : n.title.toLowerCase().includes('photo') ? '📸' : '🔔';
          return `
            <div class="notif-item ${!n.read ? 'unread' : ''}" data-id="${n.id}">
              <div class="ni-ico">${typeIcon}</div>
              <div>
                <div class="ni-title">${n.title}</div>
                <div class="ni-sub">${n.body}</div>
                <div class="ni-time">${new Date(n.timestamp).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Bind read handler on click
    document.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', async () => {
        const id = parseInt(item.getAttribute('data-id'));
        if (item.classList.contains('unread') && !isNaN(id)) {
          try {
            await API.markNotificationRead(id);
            item.classList.remove('unread');
            loadNotifications(); // Reload indicators
          } catch (e) {
            console.error('Failed to mark notification read', e);
          }
        }
      });
    });
  }

  // ============================================================
  //  REAL-TIME CHAT
  // ============================================================
  const chatInput    = document.getElementById('chatInput');
  const chatSend     = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  // Contact list selection
  document.querySelectorAll('.chat-contact').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chat-contact').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const contactName = btn.querySelector('.cc-name').textContent;
      document.getElementById('chatContactName').textContent = contactName;
      
      const role = btn.querySelector('.cc-role').textContent;
      const statusText = document.querySelector('.chat-header .chat-status');
      if (statusText) {
        statusText.nextElementSibling.lastElementChild.textContent = `${role} · Active`;
      }
      loadChat();
    });
  });

  async function loadChat() {
    if (!profile.projectId) return;

    // Only load if supervisor contact is selected (other contacts remain static mock)
    const activeContact = document.querySelector('.chat-contact.active');
    const isRealChat = activeContact && activeContact.getAttribute('data-contact') === 'supervisor';

    if (!isRealChat) {
      // Mock messages for non-supervisor tabs
      return;
    }

    try {
      const messages = await API.getChatHistory(profile.projectId);
      chatMessages.innerHTML = '';
      messages.forEach(msg => {
        appendMessageUI(msg.content, msg.senderId === profile.id, msg.sender.avatar || 'VR', msg.timestamp);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }

  function appendMessageUI(text, isMe, avatarInitial, timestamp) {
    const row = document.createElement('div');
    row.className = 'msg-row' + (isMe ? ' me' : '');
    
    const av = document.createElement('div');
    av.className = 'msg-av';
    av.textContent = avatarInitial;
    
    const inner = document.createElement('div');
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'msg-time';
    const dateObj = timestamp ? new Date(timestamp) : new Date();
    time.textContent = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    inner.appendChild(bubble);
    inner.appendChild(time);
    row.appendChild(av);
    row.appendChild(inner);
    
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !profile.projectId) return;

    const activeContact = document.querySelector('.chat-contact.active');
    const isRealChat = activeContact && activeContact.getAttribute('data-contact') === 'supervisor';

    if (isRealChat) {
      try {
        const msg = await API.sendChatMessage(profile.projectId, text);
        appendMessageUI(msg.content, true, profile.avatar || 'JS', msg.timestamp);
        chatInput.value = '';
      } catch (err) {
        showToast('Failed to send message', 'error');
      }
    } else {
      // Handle fallback mock chat auto-reply
      appendMessageUI(text, true, profile.avatar || 'JS');
      chatInput.value = '';
      setTimeout(() => {
        const mockReplies = [
          'Got it! We will look into that and update you shortly.',
          'Understood. Let me check with the site operations team.',
          'Noted! I will escalate this modification request.'
        ];
        const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
        appendMessageUI(reply, false, activeContact.querySelector('.cc-av').textContent);
      }, 1000);
    }
  }

  if (chatSend)  chatSend.addEventListener('click', sendMessage);
  if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

  // Listen for Socket.IO incoming chat messages
  if (socket) {
    socket.on('message:receive', (message) => {
      const activeContact = document.querySelector('.chat-contact.active');
      const isSupervisorActive = activeContact && activeContact.getAttribute('data-contact') === 'supervisor';
      
      if (message.senderId !== profile.id && isSupervisorActive) {
        appendMessageUI(message.content, false, message.sender.avatar || 'VR', message.timestamp);
      }
    });

    // Handle real-time layout updates
    socket.on('gallery:new', () => {
      loadDashboardData();
      showToast('New construction photos uploaded by supervisor!', 'success', '📸');
    });

    socket.on('progress:update', (data) => {
      const progressEl = document.getElementById('stat-progress');
      if (progressEl) {
        progressEl.textContent = `${data.constructionProgress}%`;
      }
      loadDashboardData();
      showToast(`Construction progress updated to ${data.constructionProgress}%!`, 'info', '🏗️');
    });

    socket.on('timeline:update', () => {
      loadDashboardData();
      showToast('Supervisor updated the project timeline.', 'info', '📋');
    });

    socket.on('document:new', () => {
      loadDashboardData();
      showToast('A new agreement or document has been uploaded.', 'success', '📂');
    });
  }

  // ============================================================
  //  FINANCIALS & PAYMENTS
  // ============================================================
  async function loadPayments() {
    if (!profile.projectId) return;

    try {
      const payments = await API.getPayments(profile.projectId);
      renderPayments(payments);
    } catch (err) {
      console.error('Error loading payments:', err);
    }
  }

  function renderPayments(payments) {
    const totalCost = 7500000; // Sample fixed cost
    const amountPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
    const amountRemaining = totalCost - amountPaid;
    const paidPct = Math.min(100, Math.round((amountPaid / totalCost) * 100));

    // Update Overview stat card
    const payVal = document.getElementById('stat-payments');
    if (payVal) payVal.textContent = `₹${Math.round(amountPaid / 100000)}L`;

    // Summary Card
    const summaryRow = document.querySelector('.pay-summary');
    const upcoming = payments.find(p => p.status === 'DUE') || payments.find(p => p.status === 'UPCOMING');

    if (summaryRow) {
      summaryRow.innerHTML = `
        <div class="pay-card">
          <div class="pay-label">Total Project Cost</div>
          <div class="pay-amount">₹${totalCost.toLocaleString('en-IN')}</div>
          <div class="pay-sub">Villa Unit — ${profile.clientCode}</div>
        </div>
        <div class="pay-card">
          <div class="pay-label">Amount Paid</div>
          <div class="pay-amount">₹${amountPaid.toLocaleString('en-IN')}</div>
          <div class="pay-sub">${payments.filter(p => p.status === 'PAID').length} installments completed</div>
        </div>
        <div class="pay-card upcoming">
          <div class="pay-label">Next Installment</div>
          <div class="pay-amount">₹${upcoming ? upcoming.amount.toLocaleString('en-IN') : '0'}</div>
          <div class="pay-sub">Due: ${upcoming && upcoming.due ? new Date(upcoming.due).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'}) : 'Completed'}</div>
        </div>
      `;
    }

    // Paid Percentage Bar
    const progressBlock = document.querySelector('#panel-payments .db-card .db-card-body');
    if (progressBlock) {
      progressBlock.innerHTML = `
        <div class="progress-label" style="margin-bottom:9px"><span style="font-weight:700">Payment Progress</span><strong>${paidPct}% Paid</strong></div>
        <div class="progress-bar" style="height:14px"><div class="progress-fill green" style="width:${paidPct}%"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-top:8px">
          <span>₹${amountPaid.toLocaleString('en-IN')} paid</span><span>₹${amountRemaining.toLocaleString('en-IN')} remaining</span>
        </div>
      `;
    }

    // Payment History Table
    const tableBody = document.querySelector('.pay-table tbody');
    if (tableBody) {
      if (payments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No payment schedules found.</td></tr>';
      } else {
        tableBody.innerHTML = payments.map((p, idx) => {
          const statusChip = p.status === 'PAID' ? 'chip-success' : p.status === 'DUE' ? 'chip-warning' : '';
          const statusText = p.status === 'PAID' ? 'Paid' : p.status === 'DUE' ? 'Due' : 'Upcoming';
          return `
            <tr>
              <td>${idx + 1}</td>
              <td>${p.description}</td>
              <td>${p.due ? new Date(p.due).toLocaleDateString('en-IN', {month:'short', year:'numeric'}) : '—'}</td>
              <td>₹${p.amount.toLocaleString('en-IN')}</td>
              <td>${p.method || '—'}</td>
              <td><span class="chip ${statusChip}">${statusText}</span></td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // ============================================================
  //  DOCUMENTS PANEL
  // ============================================================
  function loadDocuments(docs) {
    const docGrid = document.querySelector('.doc-grid');
    if (!docGrid || !docs) return;

    if (docs.length === 0) {
      docGrid.innerHTML = '<div style="grid-column: span 2; padding:40px; text-align:center; color:var(--text-muted);">No documents shared yet.</div>';
      return;
    }

    docGrid.innerHTML = docs.map(doc => {
      const isPdf = doc.name.toLowerCase().includes('pdf') || doc.url.toLowerCase().endsWith('.pdf');
      const icon = isPdf ? '📄' : '🏡';
      const fileClass = isPdf ? 'pdf' : 'docx';

      return `
        <div class="doc-card">
          <div class="doc-ico ${fileClass}">${icon}</div>
          <div>
            <div class="doc-name">${doc.name}</div>
            <div class="doc-meta">${doc.type} · Uploaded ${new Date(doc.date).toLocaleDateString('en-IN')}</div>
          </div>
          <a class="doc-download" href="${doc.url}" target="_blank" style="text-decoration:none;display:flex;align-items:center;justify-content:center;">📥</a>
        </div>
      `;
    }).join('');
  }

  // ============================================================
  //  CLIENT REQUESTS FORM
  // ============================================================
  let selectedCategory = 'Kitchen';

  document.querySelectorAll('.req-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.req-cat').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCategory = btn.getAttribute('data-cat');
    });
  });

  // Requests tabs filter
  document.querySelectorAll('[data-req-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-req-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-req-tab').toUpperCase();
      document.querySelectorAll('#reqList .req-card').forEach(card => {
        const cardStatus = card.getAttribute('data-status').toUpperCase();
        card.style.display = (filter === 'ALL' || cardStatus === filter) ? '' : 'none';
      });
    });
  });

  async function loadRequests() {
    if (!profile.projectId) return;

    try {
      const requests = await API.getRequests(profile.projectId);
      renderRequests(requests);
    } catch (err) {
      console.error('Error loading requests:', err);
    }
  }

  function renderRequests(requests) {
    const list = document.getElementById('reqList');
    if (!list) return;

    if (requests.length === 0) {
      list.innerHTML = '<div style="padding:20px;color:var(--text-muted);text-align:center;">No modification requests raised.</div>';
      return;
    }

    list.innerHTML = requests.map(req => {
      const statusColors = {
        PENDING: 'chip-warning',
        APPROVED: 'chip-info',
        REJECTED: 'chip-danger',
        COMPLETED: 'chip-success'
      };
      
      const statusClass = statusColors[req.status] || '';
      const replyHtml = req.reply ? `<div style="margin-top:8px;font-size:12px;color:var(--pd-gold);background:#fff9eb;padding:8px;border-radius:4px;border-left:3px solid var(--pd-gold);"><b>Supervisor Reply:</b> ${req.reply}</div>` : '';

      return `
        <div class="req-card" data-status="${req.status}">
          <div class="req-info">
            <div class="req-title">${req.title}</div>
            <div class="req-sub">Category: ${req.category} ${req.description ? '· ' + req.description : ''}</div>
            <div class="req-date">Submitted: ${new Date(req.createdAt).toLocaleDateString('en-IN')}</div>
            ${replyHtml}
          </div>
          <span class="chip ${statusClass}">${req.status}</span>
        </div>
      `;
    }).join('');
  }

  // Submit new request
  document.getElementById('submitReqBtn').addEventListener('click', async () => {
    const title = document.getElementById('reqTitle').value.trim();
    const desc  = document.getElementById('reqDesc').value.trim();
    
    if (!title || !profile.projectId) { 
      showToast('Please enter a request title.', 'error'); 
      return; 
    }

    try {
      await API.raiseRequest(profile.projectId, {
        category: selectedCategory,
        title,
        description: desc
      });

      document.getElementById('reqTitle').value = '';
      document.getElementById('reqDesc').value = '';
      
      openModal('reqConfirmModal');
      loadRequests(); // refresh list
    } catch (e) {
      showToast('Failed to submit request', 'error');
    }
  });

  // ============================================================
  //  CALENDAR BUILDERS (CALLS & SITE VISITS)
  // ============================================================
  function buildCalendar(opts) {
    const { gridId, labelId, prevId, nextId, onSelect } = opts;
    const grid      = document.getElementById(gridId);
    const label     = document.getElementById(labelId);
    const prevBtn   = document.getElementById(prevId);
    const nextBtn   = document.getElementById(nextId);
    if (!grid || !label) return;

    let current = new Date();
    current.setDate(1);
    let selectedDate = null;

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    function isAvailable(d) {
      const day = d.getDay();
      const today = new Date(); today.setHours(0,0,0,0);
      return d > today && day !== 0; // Exclude Sundays & Past dates
    }

    function render() {
      label.textContent = MONTHS[current.getMonth()] + ' ' + current.getFullYear();
      const allDays = grid.querySelectorAll('.cal-day');
      allDays.forEach(d => d.remove());

      const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
      const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
      const today = new Date(); today.setHours(0,0,0,0);

      // Blanks
      for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.className = 'cal-day other-month';
        grid.appendChild(blank);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(current.getFullYear(), current.getMonth(), d);
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = d;

        const isToday = date.getTime() === today.getTime();
        if (isToday) cell.classList.add('today');
        if (selectedDate && date.getTime() === selectedDate.getTime()) cell.classList.add('selected');

        if (!isAvailable(date)) {
          cell.classList.add('unavailable');
        } else {
          cell.classList.add('has-slot');
          cell.addEventListener('click', () => {
            selectedDate = date;
            render();
            if (onSelect) onSelect(date);
          });
        }
        grid.appendChild(cell);
      }
    }

    prevBtn.addEventListener('click', () => { current.setMonth(current.getMonth() - 1); render(); });
    nextBtn.addEventListener('click', () => { current.setMonth(current.getMonth() + 1); render(); });

    render();
    return { getSelected: () => selectedDate };
  }

  const callCal  = buildCalendar({ gridId: 'callCalGrid',  labelId: 'callMonthLabel',  prevId: 'callPrevMonth',  nextId: 'callNextMonth' });
  const visitCal = buildCalendar({ gridId: 'visitCalGrid', labelId: 'visitMonthLabel', prevId: 'visitPrevMonth', nextId: 'visitNextMonth' });

  function initTimeSlots(gridId) {
    document.querySelectorAll(`#${gridId} .time-slot:not(.unavailable)`).forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll(`#${gridId} .time-slot`).forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
  }
  initTimeSlots('callTimeGrid');
  initTimeSlots('visitTimeGrid');

  // Book Site Visit
  document.getElementById('confirmVisitBtn').addEventListener('click', async () => {
    const calSel = visitCal.getSelected();
    const timeSel = document.querySelector('#visitTimeGrid .time-slot.selected');
    const visitors = document.getElementById('visitCount').value;
    const notes = document.getElementById('visitNotes').value;

    if (!calSel) { showToast('Please select a date.', 'error'); return; }
    if (!timeSel) { showToast('Please select a time slot.', 'error'); return; }

    try {
      const dateStr = calSel.toISOString().split('T')[0];
      await API.bookVisit(profile.projectId, {
        date: dateStr,
        time: timeSel.getAttribute('data-time'),
        visitors,
        notes
      });

      const readableDate = calSel.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      document.getElementById('visitConfirmText').textContent =
        `Site visit booked for ${readableDate} at ${timeSel.getAttribute('data-time')}. Please carry a valid photo ID. Report to the site security on arrival.`;
      
      openModal('visitConfirmModal');
    } catch (e) {
      showToast('Failed to schedule site visit', 'error');
    }
  });

  // Book Call (handled similarly via SiteVisit booking payload for simplicity)
  document.getElementById('confirmCallBtn').addEventListener('click', async () => {
    const calSel = callCal.getSelected();
    const timeSel = document.querySelector('#callTimeGrid .time-slot.selected');
    const purpose = document.getElementById('callPurpose').value;
    const notes = document.getElementById('callNotes').value;

    if (!calSel) { showToast('Please select a date.', 'error'); return; }
    if (!timeSel) { showToast('Please select a time slot.', 'error'); return; }
    if (!purpose) { showToast('Please select a call purpose.', 'error'); return; }

    try {
      const dateStr = calSel.toISOString().split('T')[0];
      await API.bookVisit(profile.projectId, {
        date: dateStr,
        time: timeSel.getAttribute('data-time'),
        visitors: 'Call Booking',
        notes: `Purpose: ${purpose}. Notes: ${notes}`
      });

      const readableDate = calSel.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      document.getElementById('callConfirmText').textContent =
        `Your call is scheduled for ${readableDate} at ${timeSel.getAttribute('data-time')}. Purpose: ${purpose}. Our team will call you at the registered number.`;
      
      openModal('callConfirmModal');
    } catch (e) {
      showToast('Failed to schedule call', 'error');
    }
  });

  // ============================================================
  //  EXPLORE PROJECTS
  // ============================================================
  async function loadExploreProjects() {
    const expGrid = document.querySelector('.explore-grid');
    if (!expGrid) return;

    try {
      const projects = await API.getProjects();
      expGrid.innerHTML = projects.map(p => {
        const statusClass = p.status === 'COMPLETED' ? 'chip-success' : p.status === 'ONGOING' ? 'chip-info' : 'chip-warning';
        return `
          <div class="exp-card">
            <div class="exp-thumb"><img src="${p.hero || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80'}" alt="${p.name}"></div>
            <div class="exp-info">
              <h4>${p.name}</h4>
              <div class="meta">🏢 ${p.type}</div>
              <div class="meta">📍 ${p.location}</div>
              <div class="meta">💰 From ${p.startingPrice}</div>
              <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                <span class="chip ${statusClass}">${p.status}</span>
                <a href="project-details.html?id=${p.id || 'arthi-skyline-towers'}" class="btn btn-sm btn-gold" style="text-decoration:none">View Details →</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error('Failed to load explore projects list', e);
    }
  }

  // ============================================================
  //  UTILITIES
  // ============================================================
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minutes ago";
    return "just now";
  }

  // Start initialization
  await loadDashboardData();
  await loadExploreProjects();
});
