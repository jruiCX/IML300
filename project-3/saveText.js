const BIN_ID = '692269b643b1c97be9beeb2a'; 
const API_KEY = '$2a$10$jUQViu8oab0a1mqad9wj0uo/9EeLVsctGZ94Xf9AxuEmNLOVB3Pz2';
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let localWhispers = [];

// 🛠️ 万能安全函数：专门负责显示文字，找不到元素也不报错
function safeShowText(text) {
    const el = document.getElementById('displayText');
    if (el) {
        el.innerText = text;
    } else {
        console.warn("⚠️ 警告：页面上找不到 id='displayText' 的标签，文字无法显示:", text);
    }
}

// 1. 网页加载
window.onload = function() {
    fetch(URL, {
        method: 'GET',
        headers: { 'X-Master-Key': API_KEY }
    })
    .then(res => res.json())
    .then(data => {
        localWhispers = data.record.whispers || [];
        console.log("读取成功，数量:", localWhispers.length);
        displayRandomWhisper();
    })
    .catch(error => {
        console.error("读取失败:", error);
        // 使用安全函数，即使没有 ID 也不报错
        safeShowText("读取失败，请检查控制台");
    });
};

// 显示随机句子
function displayRandomWhisper() {
    if (localWhispers.length === 0) {
        safeShowText("还没有记录...");
        return;
    }
    const randomIndex = Math.floor(Math.random() * localWhispers.length);
    // 使用安全函数
    safeShowText(localWhispers[randomIndex]);
}

// 2. 保存功能
function saveDream() {
    const input = document.getElementById('userInput');
    // 检查输入框是否存在
    if (!input) {
        alert("错误：找不到输入框 id='userInput'");
        return;
    }

    const text = input.value.trim();
    if (!text) return;

    const btn = document.querySelector('button');
    // 检查按钮是否存在
    let originalText = "Save";
    if (btn) {
        originalText = btn.innerText;
        btn.innerText = "Saving...";
        btn.disabled = true;
    }

    localWhispers.push(text);

    fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ whispers: localWhispers })
    })
    .then(response => {
        if (!response.ok) throw new Error("网络响应不正常");
        return response.json();
    })
    .then(data => {
        alert("✅ Saved to the void");
        input.value = '';
        
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }
        
        // 使用安全函数，绝对不会报错
        safeShowText(text);
    })
    .catch(error => {
        console.error("保存失败:", error);
        alert("❌ Save failed: " + error.message);
        localWhispers.pop(); 
        
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}