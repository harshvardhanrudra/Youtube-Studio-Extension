# YouTube Studio Tag Assistant

This Chrome extension assists with adding predefined tags to videos within YouTube Studio. It allows users to open a side panel where they can select from various predefined options, including content types, video producers (VPs), video uploaders (VUs), categories, and agencies. Based on the selected values, the extension automatically populates the relevant fields and controls the visibility of the "Save" or "Next" button on YouTube Studio's edit and upload pages.

## Features

- Detects when a YouTube Studio edit or upload page is active and automatically enables the extension's side panel.
- Allows users to select predefined tags for content type, VP, VU, category, and agency.
- Automatically fills in the appropriate fields on YouTube Studio and adds the tags to the video.
- Controls the "Save" button on the edit page and the "Next" button on the upload page to ensure the form is completed before proceeding.
- The extension works exclusively on YouTube Studio pages (`https://studio.youtube.com`).

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing the extension files.
5. The extension will now be loaded and active when you navigate to YouTube Studio.

## Usage

1. Open a video in YouTube Studio for either editing or uploading.
2. A floating button will appear at the bottom right corner of the page. Click the button to open the side panel.
3. In the side panel, fill out the form by selecting the appropriate tags for your video:
   - Content Type
   - Video Producer (VP)
   - Video Uploader (VU)
   - Category
   - Agency
4. Once all fields are filled out, the tags will be automatically added to the video.
5. The "Save" button (on edit pages) or the "Next" button (on upload pages) will be enabled once the form is submitted.

## Files

- **manifest.json**: Defines the extension's permissions, content scripts, and background service worker.
- **background.js**: Controls when the side panel is displayed based on the active tab.
- **content.js**: Handles YouTube Studio page detection, floating button creation, and tag addition logic.
- **sidepanel.html**: The HTML structure for the side panel where users select tags.
- **sidepanel.js**: Manages form submission, state synchronization with the content script, and dropdown population from a JSON data source.

## How It Works

1. **Tab Detection**: The extension detects when a YouTube Studio tab is active and enables the side panel only on such pages.
2. **Floating Button**: A floating button is displayed on the page, allowing users to open the side panel.
3. **Form Handling**: Users can fill out a form in the side panel with predefined tags. The selected tags are sent to the content script, which adds them to the relevant fields in YouTube Studio.
4. **Save/Next Button Interception**: The "Save" button on the edit page and the "Next" button on the upload page are controlled by the extension. The user must fill out the form before proceeding with saving or uploading.

## Contributing

Feel free to fork this project and submit pull requests for any enhancements or bug fixes. Suggestions are always welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

