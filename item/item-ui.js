body {
  margin: 0;
  background: #050814;
  color: #dbe6ff;
  font-family: "Consolas","Roboto Mono",monospace;
}

.top-nav {
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  background: #0a0f2a;
  border-bottom: 1px solid #1e2a55;
}

.top-nav a {
  color: #8faaff;
  text-decoration: none;
}
.top-nav a.active { color: #fff; }

.item-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
}

.item-tabs button {
  background: #0b1225;
  border: 1px solid #1e2a55;
  color: #8faaff;
  padding: 6px 12px;
  cursor: pointer;
}
.item-tabs button.active {
  background: #1e2a55;
  color: #fff;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px,1fr));
  gap: 12px;
  padding: 16px;
}

.item-card {
  background: linear-gradient(145deg,#0b1225,#060a18);
  border: 1px solid #1e2a55;
  padding: 10px;
  cursor: pointer;
}
.item-name { font-size: 0.9em; }
.item-count { font-size: 0.8em; color: #9fbaff; }

/* モーダル */
.modal-bg {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
}
.modal {
  background: #0b1225;
  border: 1px solid #8faaff;
  padding: 16px;
  width: 280px;
}
