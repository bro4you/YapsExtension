# Yaps Influence Analyzer

Chrome extension to analyze user influence based on Yaps data.

---

## Overview
This Chrome extension allows you to:
- Check the influence level of a single user.
- Compare the influence between two users.
- Visualize data using interactive charts powered by [Chart.js](https://www.chartjs.org/).

The extension fetches data from the [Kaito API](https://api.kaito.ai/) and provides insights into user activity (e.g., total posts, recent activity).

---

## Features
- **Single User Analysis:** Enter a username and get detailed statistics about their activity.
- **User Comparison:** Compare two users side-by-side to see who has more influence.
- **Interactive Charts:** Visualize user data with bar charts for better understanding.
- **Local Chart.js:** The extension uses a local version of Chart.js to comply with Chrome's Content Security Policy (CSP).

---

## Installation

### Prerequisites
- Google Chrome browser installed on your system.
- Basic knowledge of Chrome extensions.

### Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/bro4you/YapsExtension.git

2. **Open Chrome Extensions**:

Open Chrome and go to chrome://extensions/.
Enable "Developer mode" (toggle in the top-right corner).


3. ****Load** the Extension**:
Click "Load unpacked".
Select the folder where you cloned the repository (e.g., YapsExtension).


4. **Verify Installation**:
The extension should now appear in your list of extensions.
You can pin it to the toolbar for easy access.


**Usage**
**Single User Check**
Click on the extension icon in the Chrome toolbar.
Navigate to the "User Check" tab.
Enter a username in the input field and click "Check Influence".
View the results, including:
Total posts.
Posts in the last 7 days.
Influence level (High, Medium, or Low).

**User Comparison**
Switch to the "Compare" tab.
Enter two usernames in the input fields.
Click "Compare Influence".
View a side-by-side comparison of both users' statistics and influence levels.


**Technologies Used**
HTML/CSS: For the extension's user interface.
JavaScript: For logic and interaction.
Chart.js: For rendering interactive charts.
Chrome Extensions API: For integrating with Chrome.
Kaito API: For fetching user data.

****Folder Structure**
YapsExtension/
├── icons/                # Icons for the extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── chart.js              # Local version of Chart.js
├── manifest.json         # Chrome extension manifest
├── popup.html            # Main UI of the extension
├── popup.js              # JavaScript logic
├── styles.css            # Styles for the popup
└── README.md             # This file

**API Details**
The extension fetches data from the Kaito API .
Example endpoint:
https://api.kaito.ai/api/v1/yaps?username=testuser

Response format:
{
  "username": "testuser",
  "yaps_all": 1234.56,
  "yaps_l7d": 123.45
}

**Contributing**
Contributions are welcome! If you'd like to contribute:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeatureName).
Commit your changes (git commit -m "Add some feature").
Push to the branch (git push origin feature/YourFeatureName).
Open a pull request.

**Contact**
For questions or suggestions, feel free to reach out:

GitHub: @bro4you
Twitter (X): [@bro_4_u](https://x.com/bro_4_u?spm=a2ty_o01.29997169.0.0.3d4d5171F3d31g)
