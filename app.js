// --- Expanded Command Data ---
const commands = [
    // Termux
    { title: "Termux PKG Update", desc: "මුලින්ම Termux Packages Update කරගන්න.", code: "pkg update && pkg upgrade -y", category: "termux" },
    { title: "Storage Access ලබාගැනීම", desc: "Phone Storage එක Termux වලට Use කරන්න.", code: "termux-setup-storage", category: "termux" },
    { title: "Python Install කිරීම", desc: "Python Env එක සාදාගන්න.", code: "pkg install python -y", category: "termux" },
    { title: "NodeJS Install කිරීම", desc: "JavaScript Runtime එක Install කරන්න.", code: "pkg install nodejs -y", category: "termux" },
    
    // Git
    { title: "Git Repo Clone කිරීම", desc: "GitHub Repository එකක් download කරන්න.", code: "git clone <repository_url>", category: "git" },
    { title: "Git Commit කිරීම", desc: "ඔයාගේ Code වෙනස්කම් Save කරන්න.", code: 'git commit -m "ඔයාගේ message එක"', category: "git" },
    { title: "Git Push කිරීම", desc: "Save කරපු වෙනස්කම් GitHub එකට Upload කරන්න.", code: "git push", category: "git" },
    
    // Python
    { title: "Python Script එකක් Run කිරීම", desc: "හදපු Python File එකක් Run කරන්න.", code: "python script.name.py", category: "python" },
    { title: "PIP Package එකක් Install කිරීම", desc: "Python Library එකක් download කරන්න.", code: "pip install <package_name>", category: "python" },
    { title: "Virtual Env එකක් Active කිරීම", desc: "Isolated Env එකට ඇතුල් වෙන්න.", code: "source env/bin/activate", category: "python" }
];

// --- UI Elements ---
const commandList = document.getElementById('commandList');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.cat-btn');

let currentFilter = 'all';
let searchTerm = '';

// --- Core Logic: Render & Filter ---
function renderCommands() {
    commandList.innerHTML = '';
    
    // Advanced Filtering Logic
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
        // Create card HTML with modern classes
        const cardHTML = `
            <div class="card" style="animation: fadeInUp 0.5s ease forwards ${index * 0.1}s; opacity: 0;">
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

// --- Interaction Logic ---

// 1. One-Tap Copy with Animation
function copyCode(text, btn) {
    if (!navigator.clipboard) {
        // Fallback for older browsers
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
    btn.innerHTML = "<i class='bx bx-check'></i> Copied!";
    btn.style.background = "var(--success)";
    btn.style.color = "#000";
    btn.style.borderColor = "var(--success)";
    btn.style.transform = "scale(1.1)";

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style = ""; // Reset inline styles
    }, 2000);
}

// 2. Real-time Search
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderCommands();
});

// 3. Category Filter Click
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // UI: change active button
        document.querySelector('.cat-btn.active').classList.remove('active');
        btn.classList.remove('inactive');
        btn.classList.add('active');
        
        // Logic: apply filter
        currentFilter = btn.getAttribute('data-category');
        renderCommands();
    });
});

// --- Simple CSS Animation Injection ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

// --- Initial Render ---
renderCommands();
