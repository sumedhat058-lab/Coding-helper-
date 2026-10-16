const commands = [
  {
    title: "Termux Packages Update කිරීම",
    desc: "Termux මුලින්ම Install කළ පසු සියලුම Packages Update කරගැනීමට මේ Command එක භාවිත කරන්න.",
    code: "pkg update && pkg upgrade -y",
    category: "termux"
  },
  {
    title: "GitHub Repository එකක් Clone කිරීම",
    desc: "GitHub එකේ තියෙන Project එකක් තමන්ගේ Termux එකට download කරගැනීමට.",
    code: "git clone <repository_url>",
    category: "git"
  },
  {
    title: "Python Virtual Environment එකක් සාදාගැනීම",
    desc: "Python Projects සඳහා වෙනම Isolated Environment එකක් හදාගන්න.",
    code: "python -m venv env",
    category: "python"
  }
];

function renderCommands(data) {
  const container = document.getElementById('commandList');
  container.innerHTML = '';
  
  data.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="cmd-box">
          <code>${item.code}</code>
          <button class="copy-btn" onclick="copyCode('${item.code}', this)">Copy</button>
        </div>
      </div>
    `;
  });
}

function copyCode(text, btn) {
  navigator.clipboard.writeText(text);
  btn.innerText = "Copied! ✓";
  btn.style.background = "#4ade80";
  setTimeout(() => {
    btn.innerText = "Copy";
    btn.style.background = "#38bdf8";
  }, 2000);
}

// Initial Render
renderCommands(commands);
