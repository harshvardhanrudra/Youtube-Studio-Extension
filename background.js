// Define the YouTube Studio origin
const YOUTUBE_STUDIO_ORIGIN = 'https://studio.youtube.com';

// Allows users to open the side panel by clicking the button
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openSidePanel') {
        console.log("Received request to open side panel from content.js.");
        chrome.sidePanel.open({ tabId: sender.tab.id });
        chrome.sidePanel.setOptions({ enabled: true });
    }
});

// Listen for tab updates and control the side panel's visibility
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    const url = new URL(tab.url);

    // Check if the tab is YouTube Studio
    if (url.origin === YOUTUBE_STUDIO_ORIGIN) {
        // Enable the side panel on YouTube Studio
        await chrome.sidePanel.setOptions({
            tabId,
            path: 'sidepanel.html',
            enabled: true
        });
    } else {
        // Disable the side panel on all other sites
        await chrome.sidePanel.setOptions({
            tabId,
            enabled: false
        });
    }
});



