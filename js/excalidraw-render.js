/* Excalidraw-style architecture diagrams using rough.js */
(function() {
  'use strict';

  var ARCHS = {
    'ai-nudge': {
      columns: [
        [{ label: 'New Tab', sub: 'Chrome MV3', style: 'accent' }],
        [{ label: 'Vanilla JS', sub: 'HTML/CSS' }],
        [
          { label: 'OpenAI API', sub: 'GPT quotes', style: 'group' },
          { label: 'OpenWeather', sub: 'Geolocation', style: 'group' },
          { label: 'Product Hunt', sub: 'Trending feed', style: 'group' }
        ],
        [{ label: 'chrome.storage', sub: 'Keys & prefs', style: 'accent' }]
      ]
    },
    'mac-authenticator': {
      columns: [
        [
          { label: 'File upload', style: 'group' },
          { label: 'Drag & drop', style: 'group' },
          { label: '\u2318V paste', style: 'group' },
          { label: 'Screenshot', style: 'group' }
        ],
        [{ label: 'jimp', sub: 'Image processing' }],
        [{ label: 'qrcode-reader', sub: 'QR decode' }],
        [{ label: 'otplib', sub: 'TOTP (RFC 6238)', style: 'accent' }],
        [{ label: 'SQLite', sub: 'Encrypted store', style: 'accent' }],
        [{ label: 'Electron UI', sub: 'macOS native' }]
      ]
    },
    'langex-pdf': {
      columns: [
        [{ label: 'PDF Upload', sub: 'Drag & drop UI', style: 'accent' }],
        [{ label: 'PHP 8.1+', sub: 'REST controller' }],
        [{ label: 'PyMuPDF', sub: 'Text extraction' }],
        [
          { label: 'LangExtract', sub: 'AI semantic parse', style: 'accent' },
          { label: 'Regex fallback', sub: 'Healthcare patterns', style: 'group' }
        ],
        [{ label: 'Schema map', sub: 'Type-specific' }],
        [{ label: 'JSON / CSV', sub: 'Export', style: 'accent' }]
      ]
    },
    'prompt-pro': {
      columns: [
        [{ label: 'Select text', sub: 'ChatGPT / Copilot', style: 'accent' }],
        [{ label: 'Content script', sub: 'Injected UI' }],
        [{ label: 'Service worker', sub: 'Background (MV3)' }],
        [{ label: 'OpenAI GPT', sub: 'Prompt rewrite', style: 'accent' }],
        [{ label: 'Enhanced prompt', sub: 'Modal preview' }],
        [{ label: 'Apply', sub: 'Replace in input', style: 'accent' }]
      ]
    }
  };

  var NODE_W = 112;
  var NODE_H = 48;
  var NODE_H_SMALL = 34;
  var COL_GAP = 40;
  var ROW_GAP = 8;
  var PAD = 16;
  var NS = 'http://www.w3.org/2000/svg';

  var STYLES = {
    accent:  { fill: '#a5d8ff', stroke: '#1971c2' },
    group:   { fill: '#f1f3f5', stroke: '#868e96' },
    'default': { fill: '#ffffff', stroke: '#495057' }
  };

  function hashSeed(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) % 100000;
  }

  function getH(node) {
    return node.sub ? NODE_H : NODE_H_SMALL;
  }

  function addText(svg, x, y, text, size, color, weight) {
    var el = document.createElementNS(NS, 'text');
    el.setAttribute('x', x);
    el.setAttribute('y', y);
    el.setAttribute('text-anchor', 'middle');
    el.setAttribute('dominant-baseline', 'central');
    el.setAttribute('font-family', "'Caveat', 'Segoe Print', 'Bradley Hand', cursive");
    el.setAttribute('font-size', size);
    el.setAttribute('fill', color);
    if (weight) el.setAttribute('font-weight', weight);
    el.textContent = text;
    svg.appendChild(el);
  }

  function renderDiagram(container, arch) {
    var cols = arch.columns;
    var nCols = cols.length;

    /* compute max column height */
    var maxH = 0;
    cols.forEach(function(col) {
      var h = 0;
      col.forEach(function(n, i) {
        h += getH(n);
        if (i < col.length - 1) h += ROW_GAP;
      });
      if (h > maxH) maxH = h;
    });

    var svgW = nCols * NODE_W + (nCols - 1) * COL_GAP + PAD * 2;
    var svgH = maxH + PAD * 2;

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
    svg.style.maxWidth = svgW + 'px';
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    var rc = rough.svg(svg);

    /* compute node positions */
    var positions = [];
    cols.forEach(function(col, ci) {
      var colX = PAD + ci * (NODE_W + COL_GAP);
      var colH = 0;
      col.forEach(function(n, i) {
        colH += getH(n);
        if (i < col.length - 1) colH += ROW_GAP;
      });
      var y = PAD + (maxH - colH) / 2;
      var colPos = [];
      col.forEach(function(n) {
        var h = getH(n);
        colPos.push({ x: colX, y: y, w: NODE_W, h: h, cx: colX + NODE_W / 2, cy: y + h / 2, node: n });
        y += h + ROW_GAP;
      });
      positions.push(colPos);
    });

    /* draw arrows (behind nodes) */
    for (var i = 0; i < positions.length - 1; i++) {
      positions[i].forEach(function(from) {
        positions[i + 1].forEach(function(to) {
          var x1 = from.x + from.w + 4;
          var y1 = from.cy;
          var x2 = to.x - 4;
          var y2 = to.cy;

          svg.appendChild(rc.line(x1, y1, x2, y2, {
            stroke: '#adb5bd',
            strokeWidth: 1.2,
            roughness: 0.8,
            seed: hashSeed(from.node.label + to.node.label)
          }));

          /* arrowhead */
          var angle = Math.atan2(y2 - y1, x2 - x1);
          var hLen = 7;
          var p1x = x2 - hLen * Math.cos(angle - 0.5);
          var p1y = y2 - hLen * Math.sin(angle - 0.5);
          var p2x = x2 - hLen * Math.cos(angle + 0.5);
          var p2y = y2 - hLen * Math.sin(angle + 0.5);

          var head = document.createElementNS(NS, 'polygon');
          head.setAttribute('points', p1x + ',' + p1y + ' ' + x2 + ',' + y2 + ' ' + p2x + ',' + p2y);
          head.setAttribute('fill', '#adb5bd');
          svg.appendChild(head);
        });
      });
    }

    /* draw nodes (on top) */
    positions.forEach(function(col) {
      col.forEach(function(pos) {
        var st = STYLES[pos.node.style || 'default'];

        /* clean background rect to mask arrows underneath */
        var bg = document.createElementNS(NS, 'rect');
        bg.setAttribute('x', pos.x);
        bg.setAttribute('y', pos.y);
        bg.setAttribute('width', pos.w);
        bg.setAttribute('height', pos.h);
        bg.setAttribute('fill', st.fill);
        bg.setAttribute('rx', '3');
        svg.appendChild(bg);

        /* rough rectangle */
        svg.appendChild(rc.rectangle(pos.x, pos.y, pos.w, pos.h, {
          fill: st.fill,
          fillStyle: 'solid',
          stroke: st.stroke,
          strokeWidth: 1.5,
          roughness: 1.2,
          seed: hashSeed(pos.node.label)
        }));

        /* text labels */
        if (pos.node.sub) {
          addText(svg, pos.cx, pos.cy - 7, pos.node.label, '12.5', '#1e1e1e', '700');
          addText(svg, pos.cx, pos.cy + 9, pos.node.sub, '10', '#868e96', '400');
        } else {
          addText(svg, pos.cx, pos.cy, pos.node.label, '12.5', '#1e1e1e', '700');
        }
      });
    });

    container.appendChild(svg);
  }

  /* wait for rough.js then render all diagrams */
  function init() {
    if (typeof rough === 'undefined') {
      setTimeout(init, 50);
      return;
    }
    document.querySelectorAll('.excalidraw-diagram').forEach(function(el) {
      var project = el.getAttribute('data-project');
      if (ARCHS[project]) renderDiagram(el, ARCHS[project]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
