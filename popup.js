let singleChart = null;
let compareChart = null;

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName).style.display = 'block';
  document.getElementById(tabName + '-tab').classList.add('active');
}

async function fetchYapsData(username) {
  const url = `https://api.kaito.ai/api/v1/yaps?username=${encodeURIComponent(username)}`;
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
    else {
      const error = new Error(`Status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    return { error: error.message, status: error.status };
  }
}

function analyzeInfluence(yapsData) {
  const yapsAll = yapsData?.yaps_all || 0;
  const yaps7d = yapsData?.yaps_l7d || 0;
  
  if (yapsAll > 1000 && yaps7d > 100) return "High Influence";
  if (yapsAll > 500) return "Medium Influence";
  return "Low Influence";
}

function calculateInfluenceScore(yapsData) {
  // Простая формула для примера: нормализуем значения
  const yapsAll = yapsData?.yaps_all || 0;
  const yaps7d = yapsData?.yaps_l7d || 0;
  return Math.min(100, Math.round((yapsAll / 1000) * 50 + (yaps7d / 100) * 50));
}

function applyTheme() {
  const isDark = document.getElementById('dark-theme').checked;
  document.body.classList.toggle('dark', isDark);
  document.querySelector('.container').classList.toggle('dark', isDark);
  document.querySelector('h1').classList.toggle('dark', isDark);
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('dark', isDark));
  document.querySelectorAll('input[type="text"]').forEach(input => input.classList.toggle('dark', isDark));
  document.querySelectorAll('#settings label').forEach(label => label.classList.toggle('dark', isDark));
  document.querySelectorAll('#settings select').forEach(input => input.classList.toggle('dark', isDark));
}

async function checkUser() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Please enter a username!');

  const resultDiv = document.getElementById('single-result');
  resultDiv.innerHTML = 'Loading...';

  const yapsData = await fetchYapsData(username);
  if (yapsData && !yapsData.error) {
    const influence = analyzeInfluence(yapsData);
    resultDiv.innerHTML = `
      User: ${yapsData.username}<br>
      Total Yaps: ${yapsData.yaps_all.toFixed(2)}<br>
      Yaps Last 7 Days: ${yapsData.yaps_l7d.toFixed(2)}<br>
      Influence Level: <span style="color: ${influence === 'High Influence' ? '#4CAF50' : '#F44336'}">${influence}</span>
    `;

    if (singleChart) singleChart.destroy();
    const selectedColor = document.getElementById('chart-color').value;
    const selectedType = document.getElementById('chart-type').value;
    singleChart = new Chart(document.getElementById('single-chart'), {
      type: selectedType,
      data: {
        labels: ['Total Yaps', 'Yaps Last 7 Days'],
        datasets: [{
          label: username,
          data: [yapsData.yaps_all, yapsData.yaps_l7d],
          backgroundColor: selectedType === 'pie' ? ['#4CAF50', '#2196F3'] : selectedColor,
          borderColor: selectedColor,
          borderWidth: selectedType === 'line' ? 2 : 0
        }]
      },
      options: { 
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: selectedType !== 'pie' } }
      }
    });
  } else {
    if (yapsData.status === 400) {
      resultDiv.innerHTML = `User "${username}" not found.`;
    } else {
      resultDiv.innerHTML = `Error: ${yapsData.error || 'Unable to retrieve data.'}`;
    }
  }
}

async function viewInfluenceRadar() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Please enter a username!');

  const resultDiv = document.getElementById('single-result');
  resultDiv.innerHTML = 'Loading radar...';

  const yapsData = await fetchYapsData(username);
  if (yapsData && !yapsData.error) {
    resultDiv.innerHTML = 'Influence Radar displayed below:';
    if (singleChart) singleChart.destroy();

    const selectedColor = document.getElementById('chart-color').value;
    const influenceScore = calculateInfluenceScore(yapsData);
    singleChart = new Chart(document.getElementById('single-chart'), {
      type: 'radar',
      data: {
        labels: ['Total Yaps', 'Recent Activity', 'Influence Score'],
        datasets: [{
          label: username,
          data: [
            Math.min(100, yapsData.yaps_all / 10), // Нормализуем до 100
            Math.min(100, yapsData.yaps_l7d),      // Нормализуем до 100
            influenceScore                          // Уже от 0 до 100
          ],
          backgroundColor: selectedColor + '33', // Прозрачность
          borderColor: selectedColor,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 }
          }
        },
        plugins: { legend: { position: 'top' } }
      }
    });
  } else {
    if (yapsData.status === 400) {
      resultDiv.innerHTML = `User "${username}" not found.`;
    } else {
      resultDiv.innerHTML = `Error: ${yapsData.error || 'Unable to retrieve data.'}`;
    }
  }
}

async function compareUsers() {
  const user1 = document.getElementById('user1').value.trim();
  const user2 = document.getElementById('user2').value.trim();
  if (!user1 || !user2) return alert('Please enter both usernames!');

  const resultDiv = document.getElementById('compare-result');
  resultDiv.innerHTML = 'Loading...';

  const [yapsData1, yapsData2] = await Promise.all([fetchYapsData(user1), fetchYapsData(user2)]);
  if (yapsData1 && yapsData2 && !yapsData1.error && !yapsData2.error) {
    const influence1 = analyzeInfluence(yapsData1);
    const influence2 = analyzeInfluence(yapsData2);
    const winner = yapsData1.yaps_all > yapsData2.yaps_all ? user1 : user2;

    resultDiv.innerHTML = `
      ${user1}: ${yapsData1.yaps_all.toFixed(2)} Yaps (7 days: ${yapsData1.yaps_l7d.toFixed(2)})<br>
      Influence: ${influence1}<br><br>
      ${user2}: ${yapsData2.yaps_all.toFixed(2)} Yaps (7 days: ${yapsData2.yaps_l7d.toFixed(2)})<br>
      Influence: ${influence2}<br><br>
      Comparison: ${winner} has more overall influence.
    `;

    if (compareChart) compareChart.destroy();
    const selectedColor = document.getElementById('chart-color').value;
    const selectedType = document.getElementById('chart-type').value;
    compareChart = new Chart(document.getElementById('compare-chart'), {
      type: selectedType,
      data: {
        labels: ['Total Yaps', 'Yaps Last 7 Days'],
        datasets: [
          { 
            label: user1, 
            data: [yapsData1.yaps_all, yapsData1.yaps_l7d], 
            backgroundColor: selectedType === 'pie' ? '#4CAF50' : selectedColor,
            borderColor: selectedColor,
            borderWidth: selectedType === 'line' ? 2 : 0 
          },
          { 
            label: user2, 
            data: [yapsData2.yaps_all, yapsData2.yaps_l7d], 
            backgroundColor: selectedType === 'pie' ? '#2196F3' : selectedColor,
            borderColor: selectedColor,
            borderWidth: selectedType === 'line' ? 2 : 0 
          }
        ]
      },
      options: { 
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: selectedType !== 'pie' } }
      }
    });
  } else {
    let errorMessage = '';
    if (yapsData1?.status === 400) errorMessage += `User "${user1}" not found.<br>`;
    else if (yapsData1?.error) errorMessage += `Error for ${user1}: ${yapsData1.error}<br>`;
    if (yapsData2?.status === 400) errorMessage += `User "${user2}" not found.<br>`;
    else if (yapsData2?.error) errorMessage += `Error for ${user2}: ${yapsData2.error}<br>`;
    resultDiv.innerHTML = errorMessage || 'Unable to retrieve data for one or both users.';
  }
}

// Сохранение и загрузка настроек
function saveSettings() {
  const settings = {
    chartColor: document.getElementById('chart-color').value,
    chartType: document.getElementById('chart-type').value,
    darkTheme: document.getElementById('dark-theme').checked
  };
  chrome.storage.local.set({ settings }, () => console.log('Settings saved'));
}

function loadSettings() {
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || { chartColor: '#4CAF50', chartType: 'bar', darkTheme: false };
    document.getElementById('chart-color').value = settings.chartColor;
    document.getElementById('chart-type').value = settings.chartType;
    document.getElementById('dark-theme').checked = settings.darkTheme;
    applyTheme();
  });
}

// Привязка событий
document.getElementById('user-check-tab').addEventListener('click', () => showTab('user-check'));
document.getElementById('compare-tab').addEventListener('click', () => showTab('compare'));
document.getElementById('check-button').addEventListener('click', checkUser);
document.getElementById('compare-button').addEventListener('click', compareUsers);
document.getElementById('radar-button').addEventListener('click', viewInfluenceRadar);

// Обработчики изменений настроек
document.getElementById('chart-color').addEventListener('change', saveSettings);
document.getElementById('chart-type').addEventListener('change', saveSettings);
document.getElementById('dark-theme').addEventListener('change', () => {
  applyTheme();
  saveSettings();
});

// Загрузка настроек при запуске
loadSettings();