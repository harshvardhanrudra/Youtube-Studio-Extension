// Track whether the form is filled
let formFilled = false;

let state = {
    ct: "", // Content Type
    vu: "", // Video Unit
    vp: "", // VP
    category: "", // Category
    agency: "" // Agency
};
console.log("Initial state in content.js:", state);


// Create and insert the floating button
function createFloatingButton() {
    let button = document.createElement("button");
    button.innerText = "Open Side Panel";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "10000";
    button.style.padding = "12px 24px";
    button.style.backgroundColor = "#FF0000";
    button.style.color = "#FFFFFF";
    button.style.border = "none";
    button.style.borderRadius = "25px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.fontWeight = "bold";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    button.style.transition = "all 0.3s ease";

    button.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#CC0000";
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
    });

    button.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#FF0000";
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });

    button.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "openSidePanel" });
    });

    document.body.appendChild(button);
}

// Call this function when the content script loads
createFloatingButton();


// Function to check if we are on the edit page
function isOnEditPage() {
    return window.location.href.includes('/edit');
}

// Function to check if we are on the upload page
function isOnUploadPage() {
    return window.location.href.includes('/upload');
}

// Function to handle the edit page scenario
function handleEditPage() {
    console.log("User is on the YouTube Studio Edit page.");
    createFloatingButton();  // Keep the side panel functionality
    interceptSaveButton();   // Existing behavior for edit page
}

// Function to handle the upload page scenario
function handleUploadPage() {
    console.log("User is on the YouTube Studio Upload page.");
    clickShowMoreButton();  // Automatically click Show More for tags input
    createFloatingButton();  // Enable the side panel functionality
    interceptSaveButton();   // Add save button logic if necessary for upload
}

// Automatically click the Show More button on the upload page
function clickShowMoreButton() {
    const showMoreButton = document.querySelector('#toggle-button[aria-disabled=false]');
    if (showMoreButton && !showMoreClicked) {
        showMoreButton.click();
        console.log('Show More button clicked on the edit page.');
        showMoreClicked = true;  // Set the flag to true after clicking
    } else {
        console.log('Show More button already clicked or not found.');
    }
}


// Differentiate between edit and upload page scenarios
if (isOnEditPage()) {
    handleEditPage();  // Edit page specific behavior
} else if (isOnUploadPage()) {
    handleUploadPage();  // Upload page specific behavior
} else {
    console.log("User is on an unsupported page.");
}

// Continue with the rest of your original logic for the save button and form state management...

// Function to disable the save button
function disableSaveButton() {
    const saveButton = document.querySelector('#save[tabindex="-1"]');
    if (saveButton) {
        saveButton.disabled = true;  // Disable the save button
        console.log("Save button disabled");
    } else {
        console.log("Save button not found.");
    }
}

// Disable the save button when the content script loads
disableSaveButton();

function interceptSaveButton() {
    const saveButton = document.querySelector('#save[tabindex="-1"]');
    
    if (saveButton) {
        saveButton.addEventListener('click', function(event) {
            if (!formFilled) {
                event.preventDefault();  // Prevent the default save action
                event.stopPropagation();  // Stop the save action from propagating
                console.log("Save prevented, form not yet submitted. Opening side panel.");

                // Send a message to background.js to open the side panel
                chrome.runtime.sendMessage({ action: "openSidePanel" });
            } else {
                console.log("Form submitted, save action allowed.");
                // Let the default save action proceed
            }
        }, true);
    } else {
        console.log("Save button not found.");
    }
}

// Call this function when the content script loads
interceptSaveButton();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "enableSave") {
        formFilled = true;
        enableSaveButton();
        sendResponse({ success: true });  
    }
});

// Function to enable the save button
function enableSaveButton() {
    const saveButton = document.querySelector('#save[tabindex="-1"]');
    if (saveButton) {
        saveButton.disabled = false;  // Enable the save button
        console.log("Save button enabled.");
    } else {
        console.log("Save button not found.");
    }
}
function interceptNextButton() {
    const nextButton = document.querySelector('#next-button[]tabindex="-1"]');  
    if (nextButton) {
        nextButton.addEventListener('click', function(event) {
            if (!formFilled) {
                event.preventDefault();  // Prevent the default Next action
                event.stopPropagation();  // Stop the Next action from propagating
                console.log("Next prevented, form not yet submitted. Opening side panel.");

                // Send a message to background.js to open the side panel
                chrome.runtime.sendMessage({ action: "openSidePanel" });
            } else {
                console.log("Form submitted, Next action allowed.");
                // Let the default Next action proceed
            }
        }, true);
    } else {
        console.log("Next button not found.");
    }
}

if (isOnUploadPage()) {
    interceptNextButton();  // Intercept Next button on the upload page
}

// Function to handle tag visibility and message passing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.warn("extension message: " ,message , " sender: " , sender)
    if (message.action === "requestState") {
      // Side panel requests the current state
      sendResponse({ state: state });
      console.log("State sent to side panel:", state);
    } else if (message.action === "setState") {
      // Side panel updates the state
      state = { ...state, ...message.state };
      console.log("State updated in content script:", state);
    } else if (message.action === 'checkTagsVisibility') {
      const tagsSection = document.querySelector('#tag-container');
      if (!tagsSection || tagsSection.offsetParent === null) {
        resetPageScrollAndClick(message.tags);
      } else {
        addTagsToField(message.tags);
        formFilled = true;  // Mark form as filled when tags are added
      }
    } else if (message.action === 'addTags') {
      addTagsToField(message.tags);
      formFilled = true;  // Mark form as filled when tags are added
    } else if (message.action === 'allowSave') {
      formFilled = true;  // Mark form as filled when allowed to save
      const saveButton = document.querySelector('#save[tabindex="-1"]');
      if (saveButton) {
        saveButton.click();
      }
    } else if (message.action === 'showSaveBanner') {
      showSaveBanner();
    }
  });

// Helper function to reset scroll and click
function resetPageScrollAndClick(tags) {
    const scrollableSection = document.querySelector('#main');
    const showMoreButton = document.querySelector('#toggle-button[aria-disabled=false]');

    if (!scrollableSection) {
        console.log('Scrollable section (#main) not found');
        return;
    }

    if (showMoreButton) {
        console.log('Scrolling to the Show More button within the scrollable section...');
        scrollableSection.scrollTo({ top: scrollableSection.scrollHeight, behavior: 'smooth' });

        setTimeout(() => {
            showMoreButton.click();
            console.log('Show More button clicked');

            setTimeout(() => {
                scrollableSection.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('Scrolling to the top of the #main section...');
                setTimeout(() => {
                    addTagsToField(tags);
                }, 1000);
            }, 2000);
        }, 2000);
    } else {
        console.log('Show More button not found.');
        addTagsToField(tags);
    }
}

// Helper function to add tags to the field
function addTagsToField(tags) {
    const tagsBox = document.querySelector('#text-input'); // Replace with the correct selector for the tag input field
    if (tagsBox) {
        tags.forEach(tag => {
            tagsBox.value = tag;
            tagsBox.dispatchEvent(new Event('input', { bubbles: true }));

            // Simulate 'Enter' keypress to add the tag
            const enterEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' });
            tagsBox.dispatchEvent(enterEvent);
        });
        console.log(`Tags added: ${tags.join(', ')}`);
    } else {
        console.log('Tag field not found.');
    }
}

