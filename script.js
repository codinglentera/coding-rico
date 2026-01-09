:root{
  --bg:#0b1220;
  --panel:#0f1724;
  --accent:#65a9ff;
  --cell:#0b1228;
  --grid-border:#0b1228;
  --text:#e6eef8;
  --muted:#9fb2cf;
  --size:28px;
}

*{box-sizing:border-box}
html,body{height:100%;margin:0;font-family:Inter, Roboto, system-ui, Arial, sans-serif;background:linear-gradient(180deg,#041022 0%, #071a2a 100%);color:var(--text)}
.wrap{max-width:980px;margin:30px auto;padding:20px}
h1{text-align:center;margin:0 0 18px;font-weight:600}

.game-area{display:flex;gap:18px;align-items:flex-start;justify-content:center}
.grid{
  display:grid;
  grid-template-columns:repeat(10,var(--size));
  grid-auto-rows:var(--size);
  gap:2px;
  background:linear-gradient(180deg,#081426,#04101a);
  padding:6px;
  border-radius:8px;
  box-shadow:0 12px 30px rgba(2,8,20,0.6);
  width:calc(10 * var(--size) + 2px*9 + 12px);
}
.grid .cell{
  width:var(--size);
  height:var(--size);
  background:var(--cell);
  border-radius:4px;
  transition:background 120ms, box-shadow 120ms;
  box-shadow: inset 0 -4px 8px rgba(2,8,18,0.4);
  border:1px solid rgba(255,255,255,0.03);
}

.sidebar{width:240px;display:flex;flex-direction:column;gap:12px}
.panel{background:var(--panel);padding:12px;border-radius:8px;box-shadow:0 8px 18px rgba(2,8,20,0.5)}
.panel h2{margin:0 0 8px;font-size:14px;color:var(--muted)}
#score,#level{font-size:20px;font-weight:700;color:var(--accent)}

.mini-grid{
  display:grid;
  grid-template-columns:repeat(4,calc(var(--size) / 1.5));
  gap:4px;
  width:calc(4 * var(--size) / 1.5 + 12px);
  margin-top:6px;
}
.mini-grid .cell{width:calc(var(--size) / 1.5);height:calc(var(--size) / 1.5);border-radius:6px}

.controls{display:flex;gap:8px;justify-content:space-between}
button{padding:8px 12px;border-radius:8px;border:0;background:var(--accent);color:#042033;font-weight:700;cursor:pointer}
button:active{transform:translateY(1px)}

.help{font-size:13px;color:var(--muted)}
.help ul{margin:6px 0 0;padding-left:18px}

.overlay{
  position:fixed;left:0;right:0;top:0;bottom:0;
  display:flex;align-items:center;justify-content:center;
  backdrop-filter: blur(2px);
  background:linear-gradient(180deg,rgba(2,6,12,0.6),rgba(2,8,18,0.7));
  color:var(--text);font-size:28px;font-weight:700;
}
.hidden{display:none}

/* colors for tetrominoes */
.tet-o{background:#FFD43B;box-shadow:0 4px 12px rgba(255,196,0,0.25)}
.tet-i{background:#3AD8FF;box-shadow:0 4px 12px rgba(58,216,255,0.12)}
.tet-t{background:#A24DF6;box-shadow:0 4px 14px rgba(162,77,246,0.16)}
.tet-s{background:#48E686;box-shadow:0 4px 14px rgba(72,230,134,0.12)}
.tet-z{background:#FF6B6B;box-shadow:0 4px 14px rgba(255,107,107,0.12)}
.tet-j{background:#3B82F6;box-shadow:0 4px 14px rgba(59,130,246,0.12)}
.tet-l{background:#FF9B3B;box-shadow:0 4px 14px rgba(255,155,59,0.12)}

.merged{opacity:0.98;border:1px solid rgba(0,0,0,0.08)}
