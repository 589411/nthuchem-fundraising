let totalDonations = 0;
const targetAmount = 30000000;
let groupDonations = {};
let groupChart = null;

// 預設的團體列表
const defaultGroups = [
    "個人姓名出列", "愛校人士", "財團法人水木化學文教基金會",
    "化學75B", "化學85B", "化學95B", "化學96B", "化學98B","化學99B",
    "化學00B", "化學01B", "韓建中教授實驗室", "劉瑞雄教授實驗室",
    "汪炳鈞教授實驗室", "鄭建鴻教授實驗室", "成大教職員系友"
];

// 初始化團體捐款數據
defaultGroups.forEach(group => {
    groupDonations[group] = 0;
});

// 處理其他選項的顯示/隱藏
document.getElementById('groupName').addEventListener('change', function() {
    const otherGroupDiv = document.getElementById('otherGroupDiv');
    const otherGroupInput = document.getElementById('otherGroup');
    
    if (this.value === 'other') {
        otherGroupDiv.style.display = 'block';
        otherGroupInput.required = true;
    } else {
        otherGroupDiv.style.display = 'none';
        otherGroupInput.required = false;
    }
});

// 處理表單提交
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    let groupName = document.getElementById('groupName').value;
    
    if (groupName === 'other') {
        groupName = document.getElementById('otherGroup').value;
        // 將新的團體名稱加入選單
        addNewGroup(groupName);
    }
    
    addDonation(name, amount, groupName, email);
    this.reset();
    document.getElementById('otherGroupDiv').style.display = 'none';
});

function addNewGroup(groupName) {
    if (!defaultGroups.includes(groupName) && groupName !== 'other') {
        defaultGroups.push(groupName);
        groupDonations[groupName] = 0;
        
        // 更新選單
        const select = document.getElementById('groupName');
        const option = document.createElement('option');
        option.value = groupName;
        option.textContent = groupName;
        // 插入到 "其他" 選項之前
        const otherOption = select.querySelector('option[value="other"]');
        select.insertBefore(option, otherOption);
    }
}

function addDonation(name, amount, groupName, email) {
    // Validate input
    if (!name || !amount || !groupName) {
        console.error('捐款資訊不完整');
        return false;
    }

    // Convert amount to number and validate
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        console.error('捐款金額無效');
        return false;
    }

    // Create a unique donation record
    const donationRecord = {
        id: Date.now() + Math.random().toString(36).substr(2, 9), // Unique ID
        name: name,
        email: email || '匿名',
        amount: amount,
        group: groupName,
        timestamp: new Date().toISOString()
    };

    // Update total donations and group donations
    totalDonations += amount;
    groupDonations[groupName] = (groupDonations[groupName] || 0) + amount;

    // Add to donations list
    addDonationToList(name, amount, groupName);

    // Update UI elements
    updateProgress();
    updateGroupChart();

    // Check for milestone celebrations
    checkMilestone(amount);

    // Save to localStorage
    saveDonations();

    return true;
}

function updateProgress() {
    const progressPercentage = Math.min((totalDonations / targetAmount) * 100, 100);
    const progressBar = document.getElementById('progressBar');
    const buildingImage = document.getElementById('buildingImage');

    // Update progress bar
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
    
    // Update donation amount display
    document.getElementById('currentAmount').textContent = `當前募得金額：NT$ ${totalDonations.toLocaleString()}`;

    // Dynamic image colorization
    const grayscaleValue = Math.max(0, 1 - (totalDonations / targetAmount));
    buildingImage.style.filter = `grayscale(${grayscaleValue})`;
}

function updateGroupChart() {
    const ctx = document.getElementById('groupDonationChart').getContext('2d');
    
    // 準備圖表數據
    const labels = Object.keys(groupDonations);
    const data = Object.values(groupDonations);
    const backgroundColor = data.map(amount => amount >= 100000 ? 'gold' : '#007bff');
    
    // 如果圖表已存在，銷毀它
    if (groupChart) {
        groupChart.destroy();
    }
    
    // 創建新圖表
    groupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '捐款金額',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'NT$ ' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'NT$ ' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function addDonationToList(name, amount, groupName) {
    const list = document.getElementById('donationsList');
    const item = document.createElement('li');
    item.className = 'list-group-item donation-item';
    item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <span class="donor-name">${name}</span>
                <small class="text-muted d-block">${groupName}</small>
            </div>
            <span class="donation-amount">NT$ ${amount.toLocaleString()}</span>
        </div>
    `;
    
    if (list.firstChild) {
        list.insertBefore(item, list.firstChild);
    } else {
        list.appendChild(item);
    }
    
    while (list.children.length > 10) {
        list.removeChild(list.lastChild);
    }
}

function checkMilestone(amount) {
    let message = '';
    
    if (amount >= 100000) {
        message = `感謝您的慷慨捐助！NT$ ${amount.toLocaleString()} 的捐款將為化學館帶來重大改變！`;
        celebrateDonation(message);
    }
    
    if (totalDonations >= targetAmount) {
        message = '🎉 恭喜！我們已達成募款目標！感謝所有支持者的慷慨相助！';
        celebrateDonation(message);
    }
}

function celebrateDonation(message) {
    const modal = new bootstrap.Modal(document.getElementById('celebrationModal'));
    document.getElementById('celebrationMessage').textContent = message;
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    modal.show();
}

function loadDonations() {
    try {
        const savedData = localStorage.getItem('chemDepartmentDonations');
        if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Reset global tracking variables
            totalDonations = 0;
            groupDonations = {};

            // Validate and process each donation record
            if (parsedData.donations && Array.isArray(parsedData.donations)) {
                parsedData.donations.forEach(record => {
                    const group = record.group || '個人姓名出列';
                    
                    // Ensure group exists
                    if (!defaultGroups.includes(group)) {
                        addNewGroup(group);
                    }

                    // Restore donation tracking
                    totalDonations += record.amount;
                    groupDonations[group] = (groupDonations[group] || 0) + record.amount;
                });

                // Update UI after processing all records
                updateProgress();
                updateGroupChart();
            }
        }
    } catch (error) {
        console.error('載入捐款記錄時發生錯誤:', error);
    }
}

function saveDonations() {
    try {
        const donationsData = {
            totalDonations: totalDonations,
            groupDonations: groupDonations,
            donations: [] // Optional: store detailed donation records
        };

        localStorage.setItem('chemDepartmentDonations', JSON.stringify(donationsData));
    } catch (error) {
        console.error('儲存捐款記錄時發生錯誤:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 載入完成，開始初始化');
    loadDonations();
});
