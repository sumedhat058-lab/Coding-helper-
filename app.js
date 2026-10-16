// ==========================================
// 1. COMMANDS DATA
// ==========================================
const commands = [
    // Termux
    { title: "Termux PKG Update", desc: "Termux packages මුලින්ම update කරගන්න.", code: "pkg update && pkg upgrade -y", category: "termux" },
    { title: "Storage Access Enable", desc: "Phone storage එක Termux වලට access දෙන්න.", code: "termux-setup-storage", category: "termux" },
    { title: "Python Install", desc: "Python environment එක set up කරගන්න.", code: "pkg install python -y", category: "termux" },
    { title: "NodeJS Install", desc: "JavaScript runtime environment එක install කරන්න.", code: "pkg install nodejs -y", category: "termux" },
    
    // Git
    { title: "Git Repo Clone", desc: "GitHub repository එකක් download කරගන්න.", code: "git clone <repository_url>", category: "git" },
    { title: "Git Commit", desc: "Code වෙනස්කම් save කරගන්න.", code: 'git commit -m "ඔයාගේ message එක මෙතනට දෙන්න"', category: "git" },
    { title: "Git Push", desc: "Save කරපු වෙනස්කම් GitHub එකට upload කරන්න.", code: "git push", category: "git" },
    
    // Python
    { title: "Run Python Script", desc: "ඔයාගේ Python file එක run කරන්න.", code: "python script.py", category: "python" },
    { title: "Install PIP Package", desc: "Python library එකක් download කරගන්න.", code: "pip install <package_name>", category: "python" },
    { title: "Activate Virtual Env", desc: "Isolated environment එකට enter වෙන්න.", code: "source env/bin/activate", category: "python" }
];

// UI Variables
const commandList = document.getElementById('commandList');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.cat-btn');

let currentFilter = 'all';
let searchTerm = '';

// ==========================================
// 2. UI RENDERING & FILTERING LOGIC
// ==========================================
function renderCommands() {
    if (!commandList) return;
    commandList.innerHTML = '';
    
    const filteredData = commands.filter(cmd => {
        const matchesCategory = (currentFilter === 'all' || cmd.category === currentFilter);
        const matchesSearch = (
            cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesCategory && matchesSearch;
    });

    if (filteredData.length === 0) {
        commandList.innerHTML = `
            <div class="card" style="text-align:center; padding: 40px; border-color: rgba(239, 68, 68, 0.3);">
                <i class='bx bx-search-alt' style="font-size: 3rem; color: #ef4444; margin-bottom: 10px;"></i>
                <h3 style="color: #ef4444;">කිසිවක් හමු වුණේ නැත!</h3>
                <p>ඔයා search කළ දේට අදාළ commands අපේ ලිස්ට් එකේ නැහැ.</p>
            </div>
        `;
        return;
    }

    filteredData.forEach((item, index) => {
        const cardHTML = `
            <div class="card" style="animation: fadeInUp 0.5s ease forwards ${index * 0.05}s; opacity: 0;">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <div class="cmd-box">
                    <code class="cmd-text">${item.code}</code>
                    <button class="copy-btn" onclick="copyCode('${item.code.replace(/'/g, "\\'")}', this)">
                        <i class='bx bx-copy'></i> Copy
                    </button>
                </div>
            </div>
        `;
        commandList.innerHTML += cardHTML;
    });
}

// One-Tap Copy with Animation
function copyCode(text, btn) {
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showCopyFeedback(btn);
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(btn);
    });
}

function showCopyFeedback(btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx
