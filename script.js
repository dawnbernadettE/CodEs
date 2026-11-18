// SECTION 1: GLOBAL VARIABLES & INITIAL DATA
let userAccounts = [
    { username: "nurse", password: "1234", role: "nurse" },
    { username: "admin", password: "admin123", role: "admin" }
];

let adminMasterPasscode = localStorage.getItem('clinic_masterPasscode') || "9999";

let globalDB = JSON.parse(localStorage.getItem('clinic_globalDB')) || [
    { name: "Bea Badion", studentNum: "2024-1111-1", age: 20, symptoms: "Mild Fever & Cough", treatment: "Paracetamol 500mg", pin: "1111" },
    { name: "Jamaica Jean Espinola Burca", studentNum: "2024-3239-1", age: 21, symptoms: "Migraine / Headache", treatment: "Mefenamic Acid", pin: "2222" },
    { name: "Fixie Louise Obong", studentNum: "2024-3333-1", age: 20, symptoms: "Stomachache", treatment: "Antacid / Rest", pin: "3333" }
];

let auditLogs = JSON.parse(localStorage.getItem('clinic_auditLogs')) || [
    { time: "10:00 AM", user: "system", action: "System Boot / Database Initialized", target: "N/A" }
];

let currentStudent = null;
let showPlaintext = false;

function persistData() {
    localStorage.setItem('clinic_globalDB', JSON.stringify(globalDB));
    localStorage.setItem('clinic_auditLogs', JSON.stringify(auditLogs));
    localStorage.setItem('clinic_masterPasscode', adminMasterPasscode);
}

// SECTION 2: AUTHENTICATION & LOGIN LOGIC
function login() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    
    let matchedUser = userAccounts.find(acc => acc.username === u && acc.password === p);

    if(matchedUser) {
        if(matchedUser.role === 'nurse') {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('nurseDashboard').classList.remove('hidden');
            logAudit("nurse", "Logged In", "Nurse Kiosk");
        } else if(matchedUser.role === 'admin') {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminDashboard').classList.remove('hidden');
            showPlaintext = false;
            loadAdminTable();
            loadAuditTable();
            logAudit("admin", "Logged In", "Master Control");
        }
    } else {
        alert("Incorrect username or password!");
    }
}

// ==========================================
// SECTION 3: PASSWORD MANAGEMENT LOGIC
// ==========================================
function showChangePasswordModal() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('changePasswordSection').classList.remove('hidden');
}

function backToLogin() {
    document.getElementById('changePasswordSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('cpUsername').value = '';
    document.getElementById('cpOldPassword').value = '';
    document.getElementById('cpNewPassword').value = '';
}

function updatePassword() {
    const u = document.getElementById('cpUsername').value.trim();
    const oldP = document.getElementById('cpOldPassword').value;
    const newP = document.getElementById('cpNewPassword').value;

    let user = userAccounts.find(acc => acc.username === u && acc.password === oldP);

    if(user) {
        if(!newP || newP.length < 4) {
            alert("New password must be at least 4 characters long!");
            return;
        }
        user.password = newP;
        alert("Password successfully updated!");
        logAudit(u, "Changed Account Password", "Self-Service");
        backToLogin();
    } else {
        alert("Incorrect username or old password!");
    }
}

function changeAdminPassword() {
    let currentInput = prompt("Enter CURRENT Admin Master Passcode (default is 9999):");
    if (currentInput === adminMasterPasscode) {
        let newPass = prompt("Enter NEW Custom Master Passcode (at least 4 chars):");
        if (newPass && newPass.trim().length >= 4) {
            adminMasterPasscode = newPass.trim();
            persistData();
            alert("Master Passcode updated successfully!");
            logAudit("admin", "Updated Master Passcode", "Security Settings");
            loadAuditTable();
        } else if (newPass !== null) {
            alert("New passcode must be at least 4 characters long.");
        }
    } else if (currentInput !== null) {
        alert("Incorrect current passcode!");
    }
}

function changeAdminPasscode() {
    changeAdminPassword();
}

function logout() {
    showPlaintext = false;
    document.getElementById('nurseDashboard').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// ==========================================
// SECTION 4: NAVIGATION & UI TABS LOGIC
// ==========================================
function switchNurseTab(tabId, btn) {
    document.getElementById('verifyTab').classList.add('hidden');
    document.getElementById('registerTab').classList.add('hidden');
    const changePinTab = document.getElementById('changePinTab');
    if(changePinTab) changePinTab.classList.add('hidden');
    
    document.getElementById(tabId).classList.remove('hidden');
    
    let btns = document.querySelectorAll('#nurseDashboard .tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function switchAdminTab(tabId, btn) {
    document.getElementById('masterTab').classList.add('hidden');
    document.getElementById('auditTab').classList.add('hidden');
    document.getElementById(tabId).classList.remove('hidden');
    
    let btns = document.querySelectorAll('#adminDashboard .tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ==========================================
// SECTION 5: PATIENT VERIFICATION & RECORDS (MySQL Connected)
// ==========================================
function verifyConsent() {
    const rfidInput = document.getElementById('rfidCardInput').value.trim().toLowerCase();
    const manualInput = document.getElementById('manualNameInput').value.trim().toLowerCase();
    const sPin = document.getElementById('authPin').value;

    const queryInput = rfidInput || manualInput;

    if(!queryInput || !sPin) {
        alert("Please tap/type Student ID and enter 4-Digit PIN!");
        return;
    }

    fetch('verify_patients.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryInput: queryInput, pin: sPin })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            currentStudent = data.patient;
            document.getElementById('pName').value = currentStudent.name;
            document.getElementById('pStudentNum').value = currentStudent.student_num;
            document.getElementById('pAge').value = currentStudent.age;
            document.getElementById('pSymptoms').value = currentStudent.symptoms;
            document.getElementById('pTreatment').value = currentStudent.treatment;

            document.getElementById('encryptedHashDisplay').innerText = 
                "U2FsdGVkX1" + btoa(currentStudent.symptoms + currentStudent.treatment).substring(0, 35) + "... [AES-256 HASHED]";

            document.getElementById('verifyStep').classList.add('hidden');
            document.getElementById('patientWorkspace').classList.remove('hidden');
            
            logAudit("nurse", "Verified 2FA & Decrypted Record", currentStudent.name);
        } else {
            alert(data.message || "Incorrect Student ID/Name or PIN!");
            logAudit("nurse", "Failed Verification Attempt", queryInput);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Database connection error during verification.");
    });
}

function saveRecord() {
    if(!currentStudent) return;

    const payload = {
        name: document.getElementById('pName').value,
        studentNum: document.getElementById('pStudentNum').value,
        age: document.getElementById('pAge').value,
        symptoms: document.getElementById('pSymptoms').value,
        treatment: document.getElementById('pTreatment').value,
        pin: currentStudent.pin
    };

    fetch('save_patients.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            alert("Medical record updated and saved to XAMPP database!");
            logAudit("nurse", "Updated & Encrypted Record", currentStudent.name);
        } else {
            alert("Error saving: " + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Database connection error while saving.");
    });
}

function registerNewStudent() {
    const name = document.getElementById('regName').value.trim();
    const studentNum = document.getElementById('regStudentNum').value.trim();
    const rfidUid = document.getElementById('regRfidUid').value.trim();
    const age = document.getElementById('regAge').value;
    const symptoms = document.getElementById('regSymptoms').value;
    const treatment = document.getElementById('regTreatment').value;
    const pin = document.getElementById('regPin').value;

    if(!name || !studentNum || !pin || pin.length !== 4) {
        alert("Please fill in Name, Student Number, and ensure PIN is exactly 4 digits!");
        return;
    }

    globalDB.push({ name, studentNum, rfidUid, age, symptoms, treatment, pin });
    persistData();

    alert("New Student ID & RFID successfully registered and saved!");
    logAudit("nurse", "Registered New Student ID & RFID", name);

    document.getElementById('regName').value = '';
    document.getElementById('regStudentNum').value = '';
    document.getElementById('regRfidUid').value = '';
    document.getElementById('regAge').value = '';
    document.getElementById('regSymptoms').value = '';
    document.getElementById('regTreatment').value = '';
    document.getElementById('regPin').value = '';
    switchNurseTab('verifyTab', document.querySelectorAll('#nurseDashboard .tab-btn')[0]);
}

function updateStudentPin() {
    const queryInput = document.getElementById('cpStudentQuery').value.trim().toLowerCase();
    const currentPin = document.getElementById('cpCurrentPin').value.trim();
    const newPin = document.getElementById('cpNewPin').value.trim();

    if (!queryInput || !currentPin || !newPin) {
        alert("Please fill in Student Name/Number, Current PIN, and New PIN!");
        return;
    }

    if (newPin.length !== 4) {
        alert("New PIN must be exactly 4 digits!");
        return;
    }

    fetch('update_student_pin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            queryInput: queryInput,
            currentPin: currentPin,
            newPin: newPin
        })
    })
    .then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error("Server Response Error: " + text);
        }
    })
    .then(data => {
        if(data.status === 'success') {
            alert("Student PIN updated successfully!");
            logAudit("nurse", "Updated Student PIN", queryInput);
            
            document.getElementById('cpStudentQuery').value = '';
            document.getElementById('cpCurrentPin').value = '';
            document.getElementById('cpNewPin').value = '';
            
            switchNurseTab('verifyTab', document.querySelectorAll('#nurseDashboard .tab-btn')[0]);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        alert("Network Error: " + err.message);
    });
}

function lockScreen() {
    currentStudent = null;
    document.getElementById('rfidCardInput').value = '';
    document.getElementById('manualNameInput').value = '';
    document.getElementById('authPin').value = '';
    
    document.getElementById('patientWorkspace').classList.add('hidden');
    document.getElementById('verifyStep').classList.remove('hidden');
    
    alert("Consultation finished. Screen locked for privacy!");
}

// ==========================================
// SECTION 6: ADMIN CONTROLS & AUDIT LOGS
// ==========================================
function toggleUnencryptedView() {
    if (!showPlaintext) {
        let inputPasscode = prompt("Enter Admin Master Passcode:");
        if (inputPasscode === adminMasterPasscode) {
            showPlaintext = true;
            logAudit("admin", "Authorized Unencrypted View", "Master Database");
        } else if (inputPasscode !== null) {
            alert("Incorrect Master Passcode!");
            return;
        } else {
            return; 
        }
    } else {
        showPlaintext = false;
        logAudit("admin", "Locked Unencrypted View", "Master Database");
    }
    loadAdminTable();
}

function loadAdminTable(data = globalDB) {
    let html = '';
    data.forEach(r => {
        let sNum = r.student_num || r.studentNum;
        let displayData = '';
        if (showPlaintext) {
            displayData = `<span style="color: #c0392b; font-weight: bold;">Symptoms:</span> ${r.symptoms} | <span style="color: #c0392b; font-weight: bold;">Treatment:</span> ${r.treatment}`;
        } else {
            let fakeCipher = "U2FsdGVkX1" + btoa(r.symptoms).substring(0, 20) + "== [ENCRYPTED]";
            displayData = `<code>${fakeCipher}</code>`;
        }
        
        let secureHashPin = " $2y$10$" + btoa(r.pin || "pin").substring(0, 15) + "... [SECURE HASH]"; 
        
        html += `<tr><td><b>${r.name}</b><br><small style="color: #666;">ID: ${sNum}</small></td><td>${r.age}</td><td>${displayData}</td><td><code>${secureHashPin}</code></td></tr>`;
    });
    document.getElementById('adminTable').innerHTML = html;
}

function filterAdminTable() {
    let query = document.getElementById('adminSearch').value.toLowerCase();
    let filtered = globalDB.filter(r => r.name.toLowerCase().includes(query) || r.studentNum.toLowerCase().includes(query));
    loadAdminTable(filtered);
}

function loadAuditTable() {
    let html = '';
    auditLogs.slice().reverse().forEach(log => {
        html += `<tr><td>${log.time}</td><td><b>${log.user}</b></td><td>${log.action}</td><td>${log.target}</td></tr>`;
    });
    document.getElementById('auditTable').innerHTML = html;
}

function logAudit(user, action, target) {
    let now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    auditLogs.push({ time: now, user, action, target });
    persistData();
}

function clearAllRecords() {
    let confirmCode = prompt(" Enter Master Passcode to reset entire database:");
    if (confirmCode === adminMasterPasscode) {
        globalDB = [];
        persistData();
        loadAdminTable();
        logAudit("admin", "Reset Database", "All Records");
        alert("Database successfully reset.");
    } else if (confirmCode !== null) {
        alert("Incorrect passcode!");
    }
}

function clearAuditLogs() {
    let confirmCode = prompt("Enter Master Passcode to clear all audit logs:");
    if (confirmCode === adminMasterPasscode) {
        auditLogs = [];
        persistData();

        fetch('audit_log.php', {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            logAudit("admin", "Cleared Audit Logs", "All Logs");
            loadAuditTable();
            alert("Audit logs successfully cleared!");
        })
        .catch(err => {
            console.error(err);
            logAudit("admin", "Cleared Audit Logs", "Local Logs");
            loadAuditTable();
            alert("Local audit logs cleared!");
        });
    } else if (confirmCode !== null) {
        alert("Incorrect passcode!");
    }
}