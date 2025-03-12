let singleChart = null;
let compareChart = null;

// Переключение вкладок
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName).style.display = 'block';
  document.getElementById(tabName + '-tab').classList.add('active');
}

// Запрос данных с API
async function fetchYapsData(username) {
  const url = `https://api.kaito.ai/api/v1/yaps?username=${encodeURIComponent(username)}`;
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
    else throw new Error(`Status: ${response.status}`);
  } catch (error) {
    alert(`Error fetching data for ${username}: ${error.message}`);
    return null;
  }
}

// Определение уровня влияния
function analyzeInfluence(yapsData) {
  const yapsAll = yapsData?.yaps_all || 0;
  const yaps7d = yapsData?.yaps_l7d || 0;
  
  if (yapsAll > 1000 && yaps7d > 100) return "High Influence";
  if (yapsAll > 500) return "Medium Influence";
  return "Low Influence";
}

// Проверка одного пользователя
async function checkUser() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Please enter a username!');

  const resultDiv = document.getElementById('single-result');
  resultDiv.innerHTML = 'Loading...';

  const yapsData = await fetchYapsData(username);
  if (yapsData) {
    const influence = analyzeInfluence(yapsData);
    resultDiv.innerHTML = `
      User: ${yapsData.username}<br>
      Total Yaps: ${yapsData.yaps_all.toFixed(2)}<br>
      Yaps Last 7 Days: ${yapsData.yaps_l7d.toFixed(2)}<br>
      Influence Level: <span style="color: ${influence === 'High Influence' ? '#4CAF50' : '#F44336'}">${influence}</span>
    `;

    if (singleChart) singleChart.destroy();
    singleChart = new Chart(document.getElementById('single-chart'), {
      type: 'bar',
      data: {
        labels: ['Total Yaps', 'Yaps Last 7 Days'],
        datasets: [{
          label: username,
          data: [yapsData.yaps_all, yapsData.yaps_l7d],
          backgroundColor: ['#4CAF50', '#2196F3']
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  } else {
    resultDiv.innerHTML = 'Unable to retrieve data.';
  }
}

// Сравнение двух пользователей
async function compareUsers() {
  const user1 = document.getElementById('user1').value.trim();
  const user2 = document.getElementById('user2').value.trim();
  if (!user1 || !user2) return alert('Please enter both usernames!');

  const resultDiv = document.getElementById('compare-result');
  resultDiv.innerHTML = 'Loading...';

  const [yapsData1, yapsData2] = await Promise.all([fetchYapsData(user1), fetchYapsData(user2)]);
  if (yapsData1 && yapsData2) {
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
    compareChart = new Chart(document.getElementById('compare-chart'), {
      type: 'bar',
      data: {
        labels: ['Total Yaps', 'Yaps Last 7 Days'],
        datasets: [
          { label: user1, data: [yapsData1.yaps_all, yapsData1.yaps_l7d], backgroundColor: '#4CAF50' },
          { label: user2, data: [yapsData2.yaps_all, yapsData2.yaps_l7d], backgroundColor: '#2196F3' }
        ]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  } else {
    resultDiv.innerHTML = 'Unable to retrieve data for one or both users.';
  }
}

// Привязка событий к кнопкам
document.getElementById('user-check-tab').addEventListener('click', () => showTab('user-check'));
document.getElementById('compare-tab').addEventListener('click', () => showTab('compare'));
document.getElementById('check-button').addEventListener('click', checkUser);
document.getElementById('compare-button').addEventListener('click', compareUsers);