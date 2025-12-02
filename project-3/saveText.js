//70% of this part of code is AI-generated. Modified by RCX.
const BIN_ID = '692269b643b1c97be9beeb2a'; 
const API_KEY = '$2a$10$jUQViu8oab0a1mqad9wj0uo/9EeLVsctGZ94Xf9AxuEmNLOVB3Pz2';
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let localWhispers = [];
let availableVoices = [];

//万能安全显示函数
function safeShowText(text) {
    const el = document.getElementById('displayText');
    if (el) el.innerText = text;
}


function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;

//低语朗读函数
function speakWhisper(text) {
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    
    //优先选柔和的声音
    let selectedVoice = availableVoices.find(voice => voice.name.includes("Samantha"))
                     || availableVoices.find(voice => voice.name.includes("Google US English")) 
                     || availableVoices.find(voice => voice.lang === "en-US");

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    //低语设置
    utterance.volume = 0.3; // 音量小
    utterance.rate = 0.7;   // 语速慢
    utterance.pitch = 0.9;  // 语调沉

    window.speechSynthesis.speak(utterance);
}

// 1. 网页加载
window.onload = function() {
    loadVoices();
    
    fetch(URL, {
        method: 'GET',
        headers: { 'X-Master-Key': API_KEY }
    })
    .then(response => response.json()) 
    .then(data => {
        localWhispers = data.record.whispers || [];
        console.log("读取成功:", localWhispers.length);
        
        setTimeout(() => {
            displayRandomWhisper();
        }, 800);
    })
    .catch(error => {
        console.error("读取失败:", error);
        safeShowText("Silence...");
    });
};

// 显示随机句子
function displayRandomWhisper() {
    if (localWhispers.length === 0) {
        safeShowText("Silence...");
        return;
    }
    const randomIndex = Math.floor(Math.random() * localWhispers.length);
    const textToRead = localWhispers[randomIndex];
    
    safeShowText(textToRead);
    speakWhisper(textToRead);
}

// 2. 保存功能
function saveDream() {
    const input = document.getElementById('userInput');
    if (!input) return; 

    const text = input.value.trim();
    if (!text) return;

    const btn = document.querySelector('button');
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
        if (!response.ok) throw new Error("Network error");
        return response.json();
    })
    .then(data => {
        alert("✅ Saved"); 
        
        input.value = '';
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }

        // 保存成功后朗读
        safeShowText(text); 
        speakWhisper(text); 
    })
    .catch(error => {
        console.error("Save failed:", error);
        alert("❌ Error: " + error.message);
        localWhispers.pop(); 
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}