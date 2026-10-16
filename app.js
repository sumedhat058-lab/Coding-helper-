document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. FIREBASE CONFIGURATION
    // ==========================================
    const firebaseConfig = {
  apiKey: "AIzaSyAXQGwSh6WLI5gUc-ES5jbeBzMWsy8D7bk",
  authDomain: "termux-ai-bot.firebaseapp.com",
  projectId: "termux-ai-bot",
  storageBucket: "termux-ai-bot.firebasestorage.app",
  messagingSenderId: "68826876529",
  appId: "1:68826876529:web:284fe17e98af6f692669d0"
};

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // ==========================================
    // 2. COMMANDS DATA
    // ==========================================
    const commands = [
        { title: "Termux PKG Update", desc: "Termux packages මුලින්ම update කරගන්න.", code: "pkg update && pkg upgrade -y", category: "termux" },
        { title: "Storage Access Enable", desc: "Phone storage එක Termux වලට access දෙන්න.", code: "termux-setup-storage", category: "termux" },
        { title: "Python Install", desc: "Python environment එක set up කරගන්න.", code: "pkg install python -y", category: "termux" },
        { title: "NodeJS Install", desc: "JavaScript runtime environment එක install කරන්න.", code: "pkg install nodejs -y", category: "termux" },
        
        { title: "Git Repo Clone", desc: "GitHub repository එකක් download කරගන්න.", code: "git clone <repository_url>", category: "git" },
        { title: "Git Commit", desc: "Code වෙනස්කම් save කරගන්න.", code: 'git commit -m "ඔයාගේ message එක මෙතනට දෙන්න"', category: "git" },
        { title: "Git Push", desc: "Save කරපු වෙනස්කම් GitHub එකට upload කරන්න.", code: "git push", category: "git" },
        
        { title: "Run Python Script", desc: "ඔයාගේ Python file එක run කරන්න.", code: "python script.py", category: "python" },
        { title: "Install PIP Package", desc: "Python library එකක් download කරගන්න.", code: "pip install <package_name>", category: "python" },
        { title: "Activate Virtual Env", desc: "Isolated environment එකට enter වෙන්න.", code: "source env/bin/activate", category: "python" }
    ];

    const commandList = document.getElementById('commandList');
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.cat-btn');

    let currentFilter = 'all';
    let searchTerm = '';
    let isSignUpMode = false;

    // ==========================================
    // 3. UI RENDERING & FILTERING LOGIC
    // ==========================================
    window.renderCommands = function() {
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
    window.copyCode = function(text, btn) {
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
        btn.innerHTML = "<i class='bx bx-check'></i> Copied!";
        btn.style.background = "var(--success)";
        btn.style.color = "#000";
        btn.style.borderColor = "var(--success)";
        btn.style.transform = "scale(1.05)";

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style = "";
        }, 2000);
    }

    // Search Event Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderCommands();
        });
    }

    // Category Filter Listener
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.cat-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-category');
            renderCommands();
        });
    });

    // ==========================================
    // 4. FIREBASE REAL AUTHENTICATION LOGIC
    // ==========================================
    window.toggleAuthModal = function(show) {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = show ? 'flex' : 'none';
        }
    }

    window.switchAuthMode = function(e) {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        document.getElementById('authTitle').innerText = isSignUpMode ? 'Sign Up (ගිණුමක් සදාගැනීම)' : 'Log In (ඇතුල් වීම)';
        document.getElementById('authSubmitBtn').innerText = isSignUpMode ? 'Sign Up' : 'Log In';
        document.getElementById('authToggleMsg').innerText = isSignUpMode ? 'දැනටමත් ගිණුමක් තිබේද?' : 'ගිණුමක් නැද්ද?';
        document.getElementById('authToggleLink').innerText = isSignUpMode ? 'Log In වන්න' : 'Sign Up වන්න';
    }

    window.handleAuth = function(e) {
        e.preventDefault();
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;

        if (isSignUpMode) {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    userCredential.user.sendEmailVerification()
                        .then(() => {
                            alert("ගිණුම සාර්ථකයි! ඔබගේ உண்மையான Gmail එකට Verification Link එකක් යවන ලදී. කරුණාකර ඔබගේ Email එක පරීක්ෂා කර Verify කරගන්න.");
                            auth.signOut();
                            toggleAuthModal(false);
                        });
                })
                .catch((error) => alert("දෝෂයකි: " + error.message));
        } else {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    if (user.emailVerified) {
                        alert("සාර්ථකව Log In විය!");
                        toggleAuthModal(false);
                    } else {
                        alert("කරුණාකර ඔබගේ Gmail එකට පැමිණ ඇති Verification Link එක මඟින් ගිණුම සක්‍රීය (Verify) කරගන්න!");
                        auth.signOut();
                    }
                })
                .catch((error) => alert("වරදක් ඇත: Password එක හෝ Email එක වැරදියි!"));
        }
    }

    auth.onAuthStateChanged((user) => {
        const userSection = document.getElementById('userSection');
        if (!userSection) return;

        if (user && user.emailVerified) {
            userSection.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; color:var(--accent); font-weight:bold;">${user.email.split('@')[0]}</span>
                    <button class="copy-btn" onclick="auth.signOut()" style="border-color:#ef4444; color:#ef4444;">Log Out</button>
                </div>
            `;
        } else {
            userSection.innerHTML = `
                <button id="loginModalBtn" class="copy-btn" onclick="toggleAuthModal(true)">
                    <i class='bx bx-user'></i> Log In
                </button>
            `;
        }
    });

    // Initial Load Render
    renderCommands();
});

// Inject Smooth Dynamic CSS Animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);
