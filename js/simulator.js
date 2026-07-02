/* ============================================================
   ARTHI CONSTRUCTIONS — Room Simulator
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  AUTH.guard();

  // ---- Back to Dashboard ----
  document.getElementById('backDashboard').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });

  // ---- Canvas Setup ----
  const canvas = document.getElementById('roomCanvas');
  const ctx = canvas.getContext('2d');

  let ROOM_W = 600, ROOM_H = 480;
  canvas.width  = ROOM_W;
  canvas.height = ROOM_H;

  // ---- State ----
  let items        = [];   // furniture items on canvas
  let selectedId   = null;
  let wallColor    = '#FAFAFA';
  let floorStyle   = 'marble';
  let activeTool   = 'move';
  let history      = [];
  let dragItem     = null;
  let dragOffX     = 0, dragOffY = 0;
  let resizeAnchor = null;
  let idCounter    = 0;
  // Palette drag
  let paletteData  = null;

  // ---- Helpers ----
  function newId() { return ++idCounter; }

  function saveHistory() {
    history.push(JSON.parse(JSON.stringify(items)));
    if (history.length > 50) history.shift();
  }

  function undo() {
    if (history.length === 0) { showToast('Nothing to undo.'); return; }
    items = history.pop();
    selectedId = null;
    updateSelPanel();
    redraw();
  }

  function getItem(id) { return items.find(i => i.id === id); }

  function hitTest(x, y) {
    // Iterate in reverse so top item is selected first
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      if (pointInRect(x, y, it)) return it;
    }
    return null;
  }

  function pointInRect(x, y, it) {
    // Rotate point back into item's local frame
    const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
    const rad = -it.rotation * Math.PI / 180;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    const lx = cos * (x - cx) - sin * (y - cy);
    const ly = sin * (x - cx) + cos * (y - cy);
    return lx >= -it.w / 2 && lx <= it.w / 2 && ly >= -it.h / 2 && ly <= it.h / 2;
  }

  // ---- Drawing ----
  function drawFloor() {
    const patterns = {
      marble:     () => {
        const g = ctx.createLinearGradient(0, 0, ROOM_W, ROOM_H);
        g.addColorStop(0, '#f5f5f5'); g.addColorStop(.5, '#e8e8e8'); g.addColorStop(1, '#f0f0f0');
        ctx.fillStyle = g;
      },
      'wood-light': () => {
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(0, 0, ROOM_W, ROOM_H);
        // planks
        ctx.strokeStyle = '#C4A072';
        ctx.lineWidth = 1;
        for (let x = 0; x < ROOM_W; x += 26) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ROOM_H); ctx.stroke();
        }
        return;
      },
      'wood-dark': () => {
        ctx.fillStyle = '#6B3A2B';
        ctx.fillRect(0, 0, ROOM_W, ROOM_H);
        ctx.strokeStyle = '#4A2518';
        ctx.lineWidth = 1;
        for (let x = 0; x < ROOM_W; x += 26) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ROOM_H); ctx.stroke();
        }
        return;
      },
      tiles: () => {
        const tileSize = 32;
        for (let row = 0; row * tileSize < ROOM_H; row++) {
          for (let col = 0; col * tileSize < ROOM_W; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#f5f5f5' : '#e0e0e0';
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
          }
        }
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = .5;
        for (let x = 0; x <= ROOM_W; x += tileSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ROOM_H); ctx.stroke(); }
        for (let y = 0; y <= ROOM_H; y += tileSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ROOM_W, y); ctx.stroke(); }
        return;
      },
      concrete: () => { ctx.fillStyle = '#B0ADA8'; },
      carpet:   () => { ctx.fillStyle = '#7B6B8B'; }
    };
    const fn = patterns[floorStyle];
    if (fn) fn();
    if (floorStyle === 'marble' || floorStyle === 'concrete' || floorStyle === 'carpet') {
      ctx.fillRect(0, 0, ROOM_W, ROOM_H);
    }
  }

  function drawWalls() {
    // Wall fill
    ctx.fillStyle = wallColor;
    // Draw thin room border as "walls"
    const wall = 20;
    ctx.fillRect(0, 0, ROOM_W, wall);           // top
    ctx.fillRect(0, ROOM_H - wall, ROOM_W, wall); // bottom
    ctx.fillRect(0, 0, wall, ROOM_H);           // left
    ctx.fillRect(ROOM_W - wall, 0, wall, ROOM_H); // right

    // Wall outline
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, ROOM_W - 3, ROOM_H - 3);

    // Door indicator
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(wall, ROOM_H - wall, 60, wall);
    ctx.fillStyle = 'rgba(255,255,255,.65)';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText('DOOR', wall + 15, ROOM_H - 6);
  }

  function drawItem(it) {
    const cx = it.x + it.w / 2;
    const cy = it.y + it.h / 2;
    ctx.save();
    ctx.globalAlpha = (it.opacity ?? 100) / 100;
    ctx.translate(cx, cy);
    ctx.rotate(it.rotation * Math.PI / 180);

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,.22)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    // Body
    ctx.fillStyle = it.color || '#8B6F47';
    const r = Math.min(8, it.w / 4, it.h / 4);
    roundRect(ctx, -it.w/2, -it.h/2, it.w, it.h, r);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Border
    ctx.strokeStyle = it.id === selectedId ? '#d4a24c' : 'rgba(0,0,0,.15)';
    ctx.lineWidth   = it.id === selectedId ? 2.5 : 1;
    ctx.stroke();

    // Emoji label
    ctx.font = `${Math.min(it.w, it.h) * 0.38}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.fillText(it.emoji, 0, -4);

    // Label text
    ctx.font = `bold ${Math.max(9, Math.min(12, it.w / 7))}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(0,0,0,.65)';
    ctx.fillText(it.label, 0, it.h / 2 - 7);

    // Selection handles
    if (it.id === selectedId) {
      drawHandles(it);
    }

    ctx.restore();
  }

  function drawHandles(it) {
    const corners = [
      [-it.w/2 - 5, -it.h/2 - 5],
      [ it.w/2 + 5, -it.h/2 - 5],
      [ it.w/2 + 5,  it.h/2 + 5],
      [-it.w/2 - 5,  it.h/2 + 5],
    ];
    ctx.fillStyle = '#d4a24c';
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    // Rotation handle
    ctx.beginPath();
    ctx.moveTo(0, -it.h/2 - 5);
    ctx.lineTo(0, -it.h/2 - 22);
    ctx.strokeStyle = '#d4a24c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#d4a24c';
    ctx.beginPath();
    ctx.arc(0, -it.h/2 - 24, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    drawWalls();
    items.forEach(drawItem);
  }

  // ---- Selection Panel ----
  function updateSelPanel() {
    const selInfo     = document.getElementById('selInfo');
    const selControls = document.getElementById('selControls');
    const selName     = document.getElementById('selName');
    const selOpacity  = document.getElementById('selOpacity');

    if (!selectedId) {
      selInfo.innerHTML = '<div class="emptn">Click an item to select it</div>';
      selControls.style.display = 'none';
      return;
    }
    const it = getItem(selectedId);
    if (!it) { selectedId = null; updateSelPanel(); return; }
    selInfo.innerHTML = '';
    selControls.style.display = '';
    selName.textContent = it.emoji + ' ' + it.label;
    selOpacity.value = it.opacity ?? 100;
  }

  // ---- Canvas Pointer Events ----
  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height)
    };
  }

  // Rotation handle: is point near it?
  function nearRotHandle(x, y, it) {
    const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
    const rad = it.rotation * Math.PI / 180;
    const hx = cx + Math.sin(rad) * (it.h / 2 + 24) * -1 + Math.cos(rad) * 0;
    const hy = cy - Math.cos(rad) * (it.h / 2 + 24) + Math.sin(rad) * 0;
    const dx = x - hx, dy = y - hy;
    return Math.sqrt(dx*dx + dy*dy) < 12;
  }

  // Resize handle: corner hit
  function nearCorner(x, y, it) {
    const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
    const rad = -it.rotation * Math.PI / 180;
    const cos = Math.cos(rad), sin = Math.sin(rad);
    const lx = cos * (x - cx) - sin * (y - cy);
    const ly = sin * (x - cx) + cos * (y - cy);
    const corners = [
      { name: 'tl', lx: -it.w/2, ly: -it.h/2 },
      { name: 'tr', lx:  it.w/2, ly: -it.h/2 },
      { name: 'br', lx:  it.w/2, ly:  it.h/2 },
      { name: 'bl', lx: -it.w/2, ly:  it.h/2 },
    ];
    for (const c of corners) {
      if (Math.abs(lx - c.lx) < 12 && Math.abs(ly - c.ly) < 12) return c.name;
    }
    return null;
  }

  let rotating = false, rotStartAngle = 0, rotItemAngle = 0;
  let resizing = false, resizeCorner = null, resizeStartX = 0, resizeStartY = 0, resizeStartW = 0, resizeStartH = 0;

  canvas.addEventListener('mousedown',  onDown);
  canvas.addEventListener('touchstart', onDown, { passive: false });

  function onDown(e) {
    e.preventDefault();
    const { x, y } = canvasPos(e);

    if (activeTool === 'delete') {
      const it = hitTest(x, y);
      if (it) {
        saveHistory();
        items = items.filter(i => i.id !== it.id);
        if (selectedId === it.id) { selectedId = null; updateSelPanel(); }
        redraw();
        showToast('Item deleted.', 'default', '🗑️');
      }
      return;
    }

    if (activeTool === 'duplicate') {
      const it = hitTest(x, y);
      if (it) {
        saveHistory();
        const clone = { ...JSON.parse(JSON.stringify(it)), id: newId(), x: it.x + 20, y: it.y + 20 };
        items.push(clone);
        selectedId = clone.id;
        updateSelPanel();
        redraw();
        showToast('Item duplicated.', 'success', '📋');
      }
      return;
    }

    const hit = hitTest(x, y);

    if (hit && hit.id === selectedId && activeTool === 'move') {
      // Check rotation handle
      if (nearRotHandle(x, y, hit)) {
        rotating = true;
        const cx = hit.x + hit.w / 2, cy = hit.y + hit.h / 2;
        rotStartAngle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
        rotItemAngle  = hit.rotation;
        return;
      }
    }

    if (hit && hit.id === selectedId) {
      // Check resize corner
      const corner = nearCorner(x, y, hit);
      if (corner) {
        resizing = true;
        resizeCorner = corner;
        resizeStartX = x; resizeStartY = y;
        resizeStartW = hit.w; resizeStartH = hit.h;
        return;
      }
    }

    if (hit) {
      selectedId = hit.id;
      updateSelPanel();
      if (activeTool !== 'rotate') {
        dragItem = hit;
        const cx = hit.x + hit.w / 2, cy = hit.y + hit.h / 2;
        const rad = -hit.rotation * Math.PI / 180;
        dragOffX = Math.cos(rad) * (x - cx) - Math.sin(rad) * (y - cy);
        dragOffY = Math.sin(rad) * (x - cx) + Math.cos(rad) * (y - cy);
      }
    } else {
      selectedId = null;
      updateSelPanel();
    }
    redraw();
  }

  document.addEventListener('mousemove',  onMove);
  document.addEventListener('touchmove',  onMove, { passive: false });

  function onMove(e) {
    if (e.cancelable) e.preventDefault();
    const { x, y } = canvasPos(e);

    if (rotating && selectedId) {
      const it = getItem(selectedId);
      if (!it) return;
      const cx = it.x + it.w / 2, cy = it.y + it.h / 2;
      const angle = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
      it.rotation = rotItemAngle + (angle - rotStartAngle);
      redraw();
      return;
    }

    if (resizing && selectedId) {
      const it = getItem(selectedId);
      if (!it) return;
      const dx = x - resizeStartX, dy = y - resizeStartY;
      it.w = Math.max(30, resizeStartW + dx);
      it.h = Math.max(30, resizeStartH + dy);
      redraw();
      return;
    }

    if (dragItem) {
      const it = getItem(dragItem.id);
      if (!it) return;
      const rad = it.rotation * Math.PI / 180;
      const newCx = x - (Math.cos(rad) * dragOffX - Math.sin(rad) * dragOffY);
      const newCy = y - (Math.sin(rad) * dragOffX + Math.cos(rad) * dragOffY);
      it.x = Math.max(0, Math.min(ROOM_W - it.w, newCx - it.w / 2));
      it.y = Math.max(0, Math.min(ROOM_H - it.h, newCy - it.h / 2));
      redraw();
    }
  }

  document.addEventListener('mouseup',  onUp);
  document.addEventListener('touchend', onUp);

  function onUp() {
    if (dragItem || rotating || resizing) saveHistory();
    dragItem = null;
    rotating = false;
    resizing = false;
    resizeCorner = null;
  }

  // ---- Cursor ----
  canvas.addEventListener('mousemove', e => {
    const { x, y } = canvasPos(e);
    if (activeTool === 'delete') { canvas.style.cursor = 'crosshair'; return; }
    if (activeTool === 'duplicate') { canvas.style.cursor = 'copy'; return; }
    const hit = hitTest(x, y);
    if (hit) {
      if (hit.id === selectedId && nearRotHandle(x, y, hit)) canvas.style.cursor = 'grab';
      else if (hit.id === selectedId && nearCorner(x, y, hit)) canvas.style.cursor = 'nwse-resize';
      else canvas.style.cursor = 'move';
    } else {
      canvas.style.cursor = 'default';
    }
  });

  // ---- Keyboard shortcuts ----
  document.addEventListener('keydown', e => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (document.activeElement.tagName === 'INPUT') return;
      if (selectedId) {
        saveHistory();
        items = items.filter(i => i.id !== selectedId);
        selectedId = null;
        updateSelPanel();
        redraw();
      }
    }
    if (e.key === 'r' || e.key === 'R') {
      if (selectedId) {
        const it = getItem(selectedId);
        if (it) { saveHistory(); it.rotation = (it.rotation + 90) % 360; redraw(); }
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      if (selectedId) {
        const it = getItem(selectedId);
        if (it) {
          saveHistory();
          const clone = { ...JSON.parse(JSON.stringify(it)), id: newId(), x: it.x + 20, y: it.y + 20 };
          items.push(clone);
          selectedId = clone.id;
          updateSelPanel();
          redraw();
        }
      }
    }
  });

  // ---- Toolbar ----
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTool = btn.getAttribute('data-tool');
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---- Palette Drag (HTML drag API) ----
  document.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      paletteData = {
        type:  item.getAttribute('data-type'),
        emoji: item.getAttribute('data-emoji'),
        label: item.getAttribute('data-label'),
        w:     parseInt(item.getAttribute('data-w')) || 80,
        h:     parseInt(item.getAttribute('data-h')) || 60,
        color: item.getAttribute('data-color') || '#8B6F47'
      };
      e.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('dragend', () => {});
  });

  const canvasArea = document.getElementById('canvasArea');
  canvasArea.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  canvasArea.addEventListener('drop', e => {
    e.preventDefault();
    if (!paletteData) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) - paletteData.w / 2;
    const y = (e.clientY - rect.top)  * (canvas.height / rect.height) - paletteData.h / 2;
    saveHistory();
    const newItem = {
      id:       newId(),
      type:     paletteData.type,
      emoji:    paletteData.emoji,
      label:    paletteData.label,
      x:        Math.max(20, Math.min(ROOM_W - paletteData.w - 20, x)),
      y:        Math.max(20, Math.min(ROOM_H - paletteData.h - 20, y)),
      w:        paletteData.w,
      h:        paletteData.h,
      color:    paletteData.color,
      rotation: 0,
      opacity:  100
    };
    items.push(newItem);
    selectedId = newItem.id;
    updateSelPanel();
    redraw();
    paletteData = null;
    showToast(`${newItem.emoji} ${newItem.label} added!`, 'success');
  });

  // ---- Wall Color ----
  document.querySelectorAll('#wallColorGrid .clr-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      wallColor = sw.getAttribute('data-color');
      document.querySelectorAll('#wallColorGrid .clr-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      redraw();
    });
  });

  // ---- Flooring ----
  document.querySelectorAll('#floorGrid .floor-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      floorStyle = opt.getAttribute('data-floor');
      document.querySelectorAll('#floorGrid .floor-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      redraw();
    });
  });

  // ---- Room Size ----
  document.getElementById('applyRoomSize').addEventListener('click', () => {
    const w = parseInt(document.getElementById('roomW').value);
    const h = parseInt(document.getElementById('roomH').value);
    if (w >= 300 && h >= 300) {
      ROOM_W = w; ROOM_H = h;
      canvas.width  = ROOM_W;
      canvas.height = ROOM_H;
      redraw();
      showToast(`Room resized to ${w}×${h}px`, 'success', '📐');
    } else {
      showToast('Minimum room size is 300×300.', 'error');
    }
  });

  // ---- Selection panel controls ----
  document.getElementById('selRotate').addEventListener('click', () => {
    const it = getItem(selectedId);
    if (!it) return;
    saveHistory();
    it.rotation = (it.rotation + 90) % 360;
    redraw();
  });

  document.getElementById('selDelete').addEventListener('click', () => {
    if (!selectedId) return;
    saveHistory();
    items = items.filter(i => i.id !== selectedId);
    selectedId = null;
    updateSelPanel();
    redraw();
    showToast('Item deleted.', 'default', '🗑️');
  });

  document.getElementById('selDuplicate').addEventListener('click', () => {
    const it = getItem(selectedId);
    if (!it) return;
    saveHistory();
    const clone = { ...JSON.parse(JSON.stringify(it)), id: newId(), x: it.x + 20, y: it.y + 20 };
    items.push(clone);
    selectedId = clone.id;
    updateSelPanel();
    redraw();
    showToast('Item duplicated!', 'success', '📋');
  });

  document.getElementById('selOpacity').addEventListener('input', e => {
    const it = getItem(selectedId);
    if (!it) return;
    it.opacity = parseInt(e.target.value);
    redraw();
  });

  // ---- Save ----
  document.getElementById('saveBtn').addEventListener('click', () => {
    const layout = { items, wallColor, floorStyle, ROOM_W, ROOM_H };
    localStorage.setItem('arthi_room_layout', JSON.stringify(layout));
    showToast('Layout saved to local storage!', 'success', '💾');
  });

  // ---- Reset ----
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (items.length === 0) { showToast('Canvas is already empty.'); return; }
    saveHistory();
    items = [];
    selectedId = null;
    updateSelPanel();
    redraw();
    showToast('Canvas cleared.', 'default', '🗑️');
  });

  // ---- Undo ----
  document.getElementById('undoBtn').addEventListener('click', undo);

  // ---- Load saved layout ----
  try {
    const saved = JSON.parse(localStorage.getItem('arthi_room_layout'));
    if (saved) {
      items     = saved.items     || [];
      wallColor = saved.wallColor || '#FAFAFA';
      floorStyle= saved.floorStyle|| 'marble';
      if (saved.ROOM_W) { ROOM_W = saved.ROOM_W; canvas.width  = ROOM_W; document.getElementById('roomW').value = ROOM_W; }
      if (saved.ROOM_H) { ROOM_H = saved.ROOM_H; canvas.height = ROOM_H; document.getElementById('roomH').value = ROOM_H; }
      idCounter = items.reduce((m, i) => Math.max(m, i.id), 0);
      // Restore wall color swatch
      document.querySelectorAll('#wallColorGrid .clr-swatch').forEach(sw => {
        if (sw.getAttribute('data-color') === wallColor) sw.classList.add('selected');
        else sw.classList.remove('selected');
      });
      document.querySelectorAll('#floorGrid .floor-opt').forEach(opt => {
        if (opt.getAttribute('data-floor') === floorStyle) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });
      showToast('Previous layout loaded!', 'success', '💾');
    }
  } catch (ex) {}

  // ---- Initial render ----
  redraw();

  // ---- Hint auto-hide ----
  setTimeout(() => {
    const hint = document.getElementById('canvasHint');
    if (hint) hint.style.opacity = '0';
  }, 4000);

});
