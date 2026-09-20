// --- 1. REFLECTED & DOM XSS ---
function runXss() {
    let input = document.getElementById('xss_input').value;
    document.getElementById('xss_output').innerHTML = input; // LỖI: innerHTML chấp nhận thẻ <img> độc hại
}

// Check XSS qua URL dạng: ?search=<img src=x onerror=alert(1)>
const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get('search');
if (searchParam) {
    document.getElementById('xss_output').innerHTML = "Tìm kiếm cho: " + searchParam;
}

// --- 2. STORED XSS ---
function saveStoredXss() {
    let input = document.getElementById('stored_input').value;
    localStorage.setItem('stored_xss_data', input);
    loadStoredXss();
}
function loadStoredXss() {
    let data = localStorage.getItem('stored_xss_data');
    document.getElementById('stored_output').innerHTML = data ? data : "Không có dữ liệu.";
}
function clearStoredXss() {
    localStorage.removeItem('stored_xss_data');
    location.reload();
}

// --- 3. SQL INJECTION (MÔ PHỎNG DB) ---
const mockDatabase = [
    { id: "1", name: "Admin", email: "admin@system.local" },
    { id: "2", name: "UserA", email: "usera@gmail.com" }
];
function runSqlInjection() {
    let input = document.getElementById('sqli_input').value.trim();
    let outputDiv = document.getElementById('sqli_output');
    
    if (input.toLowerCase().includes("' or '1'='1")) {
        let res = "Query: SELECT * FROM users WHERE id = '" + input + "'<br><br>";
        mockDatabase.forEach(user => { res += `ID: ${user.id} | Name: ${user.name}<br>`; });
        outputDiv.innerHTML = res + "<br><span style='color:#2ed573;'>=> SQLi Thành công!</span>";
    } else {
        let found = mockDatabase.find(user => user.id === input);
        outputDiv.innerHTML = found ? `ID: ${found.id} | Name: ${found.name}` : "Không tìm thấy.";
    }
}

// --- 4. LOCAL FILE INCLUSION (LFI - GIẢ LẬP) ---
function runLfi() {
    let input = document.getElementById('lfi_input').value.trim();
    let output = document.getElementById('lfi_output');
    
    if (input.includes("secret_config.txt")) {
        output.innerText = "🚨 FLAG: DB_PASSWORD=SuperSecret123#\n[+] Bạn đã đọc trộm được file cấu hình!";
    } else if (input.includes("passwd")) {
        output.innerText = "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/bin/sh";
    } else {
        output.innerText = "Lỗi: File '" + input + "' không tồn tại.";
    }
}

// --- 5. COMMAND INJECTION (GIẢ LẬP) ---
function runCommandInjection() {
    let input = document.getElementById('cmd_input').value.trim();
    let output = document.getElementById('cmd_output');
    let basePing = `PING ${input}...\n1 packets transmitted, 1 received.`;
    
    if (input.includes(";") || input.includes("&") || input.includes("|")) {
        output.innerText = basePing + "\n\n\$ Executing injected command...\n-----------------------------------\nroot\nLinux secure-server-01\n[+] Command Injection thành công!";
    } else {
        output.innerText = input ? basePing : "Vui lòng nhập IP.";
    }
}

// --- 6. CSRF (GIẢ LẬP) ---
function runCsrfAttack() {
    document.getElementById('current_pw').innerText = "HACKED_BY_CSRF_999";
    alert("Ôi không! Bạn vừa bấm trúng link dính CSRF, mật khẩu tài khoản đã tự động bị thay đổi!");
}

// Tự động tải Stored XSS khi trang web vừa mở lên
window.onload = function() {
    loadStoredXss();
}
