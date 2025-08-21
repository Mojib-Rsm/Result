# Create a polished, responsive HTML landing page for "Result (Bd Result Hub)"
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Result (Bd Result Hub)</title>
  <meta name="description" content="All Bangladesh Education Board Result Archive with detailed marks for JSC, JDC, SSC, DAKHIL, HSC, ALIM, VOCATIONAL.">
  <meta name="theme-color" content="#0ea5e9">
  <style>
    :root{
      --bg:#0b1220;
      --panel:#0f172a;
      --muted:#94a3b8;
      --text:#e2e8f0;
      --brand:#0ea5e9;
      --brand-2:#22d3ee;
      --accent:#10b981;
      --ring: rgba(14,165,233,.45);
      --card:#111827;
      --shadow: 0 20px 60px rgba(2,6,23,.35);
      --radius: 16px;
    }
    @media (prefers-color-scheme: light){
      :root{
        --bg:#f8fafc;
        --panel:#ffffff;
        --card:#ffffff;
        --text:#0f172a;
        --muted:#475569;
        --shadow: 0 20px 60px rgba(2,6,23,.08);
      }
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      background: radial-gradient(1200px 600px at 10% -10%, rgba(34,211,238,.12), transparent 60%),
                  radial-gradient(1200px 600px at 110% 10%, rgba(14,165,233,.12), transparent 60%),
                  var(--bg);
      color:var(--text);
      line-height:1.6;
    }
    a{color:var(--brand);text-decoration:none}
    a:hover{text-decoration:underline}
    .container{max-width:1100px;margin:0 auto;padding:24px}
    header{
      display:flex;align-items:center;justify-content:space-between;
      gap:16px;padding:12px 0;
    }
    .brand{
      display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.2px
    }
    .brand svg{width:34px;height:34px;filter:drop-shadow(0 8px 20px rgba(34,211,238,.25))}
    .badge{
      display:inline-flex;gap:8px;align-items:center;
      background: linear-gradient(135deg, rgba(14,165,233,.15), rgba(34,211,238,.15));
      border:1px solid rgba(148,163,184,.25);
      padding:6px 10px;border-radius:999px;font-size:12px;color:var(--muted)
    }
    .hero{
      display:grid;grid-template-columns: 1.1fr .9fr;gap:28px;align-items:center;padding:28px 0 12px;
    }
    @media (max-width: 900px){
      .hero{grid-template-columns:1fr}
    }
    .hero h1{
      font-size: clamp(28px, 4vw, 44px);line-height:1.12;margin:8px 0 12px;
      letter-spacing:-.02em;
    }
    .lead{color:var(--muted);font-size: clamp(14px, 2.2vw, 17px)}
    .panel{
      background:linear-gradient(180deg, rgba(255,255,255,.03), transparent), var(--panel);
      border:1px solid rgba(148,163,184,.2);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }
    .form{
      padding:16px;
      display:grid;grid-template-columns: repeat(2, 1fr);gap:14px;
    }
    .form .full{grid-column:1 / -1}
    label{display:block;font-size:12px;color:var(--muted);margin:0 0 6px 6px}
    input,select,button{
      width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(148,163,184,.35);
      background: var(--card);color:var(--text);outline:none;
    }
    input:focus,select:focus{box-shadow:0 0 0 4px var(--ring);border-color:var(--brand)}
    button{
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      border:none;font-weight:700;cursor:pointer;letter-spacing:.2px;
    }
    button:hover{filter:brightness(1.05)}
    .illu{
      padding:18px;display:grid;gap:10px
    }
    .kpi{display:flex;gap:12px;align-items:center}
    .kpi .num{
      font-weight:900;font-size:26px;
      background:linear-gradient(135deg,var(--brand), var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent
    }
    .tabs{display:flex;gap:8px;flex-wrap:wrap;padding:8px}
    .tab{font-size:12px;padding:6px 10px;border:1px solid rgba(148,163,184,.25);border-radius:999px;color:var(--muted)}
    .grid{display:grid;grid-template-columns: repeat(3, 1fr);gap:16px;margin-top:18px}
    @media (max-width: 800px){.grid{grid-template-columns:1fr}}
    .card{padding:16px;border-radius:16px;background:linear-gradient(180deg, rgba(14,165,233,.06), transparent), var(--panel);border:1px solid rgba(148,163,184,.2)}
    h2{font-size:20px;margin:0 0 8px}
    .list{margin:0;padding-left:18px}
    footer{
      margin-top:32px;padding:24px;border-top:1px dashed rgba(148,163,184,.3);color:var(--muted);font-size:14px
    }
    .credits{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .pill{padding:6px 10px;border-radius:999px;border:1px solid rgba(148,163,184,.25);color:var(--muted);font-size:12px}
    .result-preview{padding:12px;border-radius:12px;background:linear-gradient(180deg, rgba(16,185,129,.08), transparent);border:1px dashed rgba(16,185,129,.4);font-size:14px;color:var(--muted)}
    .note{font-size:12px;color:var(--muted);margin-top:8px}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand" aria-label="Result Bd Result Hub">
        <!-- Minimal inline logo -->
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#22d3ee"/><stop offset="1" stop-color="#0ea5e9"/>
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="52" height="52" rx="12" stroke="url(#g)" stroke-width="2"/>
          <path d="M18 36c6 0 8-10 14-10s8 10 14 10" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
          <circle cx="32" cy="24" r="3" fill="#10b981"/>
        </svg>
        <span>Result (Bd Result Hub)</span>
      </div>
      <span class="badge" title="Bangladesh Education Boards archive">
        🇧🇩 All Boards · Archive
      </span>
    </header>

    <section class="hero">
      <div>
        <h1>Bangladesh Education Board Results — One Hub</h1>
        <p class="lead">
          Access result archives for <strong>JSC, JDC, SSC, DAKHIL, HSC, ALIM, VOCATIONAL</strong> exams — with detailed subject-wise marks whenever available.
        </p>

        <div class="panel form" id="query-panel" role="region" aria-labelledby="query-title">
          <div class="full" id="query-title" style="font-weight:700">Quick Lookup</div>

          <div>
            <label for="exam">Exam</label>
            <select id="exam" required>
              <option value="">Select exam</option>
              <option>JSC</option>
              <option>JDC</option>
              <option>SSC</option>
              <option>DAKHIL</option>
              <option>HSC</option>
              <option>ALIM</option>
              <option>VOCATIONAL</option>
            </select>
          </div>

          <div>
            <label for="board">Board</label>
            <select id="board" required>
              <option value="">Select board</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
              <option>Rajshahi</option>
              <option>Comilla</option>
              <option>Jessore</option>
              <option>Barisal</option>
              <option>Sylhet</option>
              <option>Dinajpur</option>
              <option>Mymensingh</option>
              <option>Madrasah</option>
              <option>Technical</option>
            </select>
          </div>

          <div>
            <label for="year">Year</label>
            <input id="year" type="number" min="2001" max="2099" step="1" placeholder="e.g., 2024" required />
          </div>

          <div>
            <label for="roll">Roll / Registration No.</label>
            <input id="roll" type="text" placeholder="Enter roll or registration number" required />
          </div>

          <div class="full">
            <button id="lookup">Search Result</button>
            <p class="note">Demo only — wire this button to your API or backend route later.</p>
          </div>

          <div class="full result-preview" id="preview" hidden>
            <strong>Preview:</strong> Sample result card will appear here after search.
          </div>
        </div>

        <div class="tabs" aria-label="Supported exams">
          <span class="tab">JSC</span><span class="tab">JDC</span><span class="tab">SSC</span>
          <span class="tab">DAKHIL</span><span class="tab">HSC</span><span class="tab">ALIM</span><span class="tab">VOCATIONAL</span>
        </div>
      </div>

      <div class="panel illu">
        <div class="kpi">
          <div class="num" aria-label="Boards covered">11</div>
          <div>
            <div style="font-weight:700">Boards Covered</div>
            <div class="muted">General · Madrasah · Technical</div>
          </div>
        </div>
        <div class="kpi">
          <div class="num" aria-label="Exam years">2001–Present</div>
          <div>
            <div style="font-weight:700">Exam Years</div>
            <div class="muted">Historical archive where available</div>
          </div>
        </div>
        <div class="kpi">
          <div class="num" aria-label="Detailed marks">Marks</div>
          <div>
            <div style="font-weight:700">Detailed Breakdown</div>
            <div class="muted">Subject-wise when provided</div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid" aria-label="Features">
      <article class="card">
        <h2>All Boards, One Place</h2>
        <p>Dhaka, Chittagong, Rajshahi, Comilla, Jessore, Barisal, Sylhet, Dinajpur, Mymensingh, plus Madrasah and Technical boards.</p>
      </article>
      <article class="card">
        <h2>Detailed Subject Marks</h2>
        <p>View grade points and subject-wise marks whenever the source provides them — helpful for admissions and verification.</p>
      </article>
      <article class="card">
        <h2>Fast & Lightweight</h2>
        <p>Clean UI with no heavy dependencies. Embed easily into existing PHP/JS apps or run as a static site with an API.</p>
      </article>
    </section>

    <section class="grid" aria-label="How to use">
      <article class="card">
        <h2>1. Clone</h2>
        <pre><code>git clone https://github.com/Mojib-Rsm/Result.git
cd Result</code></pre>
      </article>
      <article class="card">
        <h2>2. Configure</h2>
        <p>Connect the search form to your backend route (e.g., <code>/api/result</code>) or client script that fetches data from your archive.</p>
      </article>
      <article class="card">
        <h2>3. Deploy</h2>
        <p>Host on your preferred provider (shared hosting, VPS, or static hosting). Add caching for speedy lookups.</p>
      </article>
    </section>

    <footer>
      <div class="credits">
        <span class="pill">Developed by <a href="https://t.me/MrTools_BD" target="_blank" rel="noopener">Mojib Rsm</a></span>
        <span class="pill">License: GPL-3.0</span>
        <span class="pill">Repo: <a href="https://github.com/Mojib-Rsm/Result" target="_blank" rel="noopener">Mojib-Rsm/Result</a></span>
      </div>
      <p class="note">This is a front-end demo template. Replace the demo handler with real API logic for production use.</p>
    </footer>
  </div>

  <script>
    // Demo handler for the search form
    const btn = document.getElementById('lookup');
    const preview = document.getElementById('preview');
    btn?.addEventListener('click', () => {
      const exam = document.getElementById('exam').value;
      const board = document.getElementById('board').value;
      const year = document.getElementById('year').value;
      const roll = document.getElementById('roll').value;

      if(!exam || !board || !year || !roll){
        preview.hidden = false;
        preview.style.borderColor = 'rgba(244,63,94,.5)';
        preview.style.background = 'linear-gradient(180deg, rgba(244,63,94,.08), transparent)';
        preview.innerHTML = '<strong>Missing info:</strong> Please fill all fields to continue.';
        return;
      }

      // Replace this block with a real fetch to your API endpoint
      // Example:
      // fetch(`/api/result?exam=${exam}&board=${board}&year=${year}&roll=${encodeURIComponent(roll)}`)
      //   .then(r => r.json())
      //   .then(showResultCard)
      //   .catch(() => showError('Unable to fetch result.'));

      const sample = {
        name: 'Rahim Uddin',
        exam, board, year, roll,
        gpa: '5.00 (A+)',
        details: [
          {subject:'Bangla', mark:95, grade:'A+'},
          {subject:'English', mark:90, grade:'A+'},
          {subject:'Math', mark:100, grade:'A+'},
        ]
      };

      preview.hidden = false;
      preview.style.borderColor = 'rgba(16,185,129,.4)';
      preview.style.background = 'linear-gradient(180deg, rgba(16,185,129,.08), transparent)';
      preview.innerHTML = `
        <div style="display:grid;gap:6px">
          <div><strong>${sample.name}</strong> · <span style="opacity:.8">${sample.exam} · ${sample.board} · ${sample.year}</span></div>
          <div><strong>GPA:</strong> ${sample.gpa}</div>
          <div style="display:grid;gap:4px">
            ${sample.details.map(d => \`<div>• \${d.subject}: \${d.mark} (\${d.grade})</div>\`).join('')}
          </div>
        </div>
      `;
    });
  </script>
</body>
</html>
"""
with open("/mnt/data/bd-result-hub.html", "w", encoding="utf-8") as f:
    f.write(html_content)
"/mnt/data/bd-result-hub.html"
