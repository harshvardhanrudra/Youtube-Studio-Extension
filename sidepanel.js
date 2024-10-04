let formFilled = false;
// Function to request state from the active tab
function requestStateFromTab() {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "requestState" }, function (response) {
        console.log(response, 'get response') 
        if (response && response.state) {
              const state = response.state;
              console.log("Received state from content script:", state);

              // Only set the form values if the state is not empty
              if (state.ct) {
                  document.getElementById('contentTypeDropdown').value = state.ct;
              }
              if (state.vu) {
                  document.getElementById('vuDropdown').value = state.vu;
              }
              if (state.vp) {
                  document.getElementById('vpDropdown').value = state.vp;
              }
              if (state.category) {
                  document.getElementById('categoryDropdown').value = state.category;
              }
              if (state.agency) {
                  document.getElementById('agencyDropdown').value = state.agency;
              }
          } else {
              console.log("No state received or response is null.");
          }
      });
  });
}
function requestStateFromTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestState" }, function (response) {
          console.log(response, 'get response'); 
          if (response && response.state) {
                const state = response.state;
                console.log("Received state from content script:", state);
  
                // Only set the form values if the state is not empty
                if (state.ct) {
                    document.getElementById('contentTypeDropdown').value = state.ct;
                }
                if (state.vu) {
                    document.getElementById('vuDropdown').value = state.vu;
                }
                if (state.vp) {
                    document.getElementById('vpDropdown').value = state.vp;
                }
                if (state.category) {
                    document.getElementById('categoryDropdown').value = state.category;
                }
                if (state.agency) {
                    document.getElementById('agencyDropdown').value = state.agency;
                }
            } else {
                console.log("No state received or response is null.");
            }
        });
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    console.log("Side panel loaded, requesting state from content.js");
    requestStateFromTab();
    const form = document.getElementById('sidePanelForm');
    if (form) {
      console.log('testing')
        // Fetch JSON data from the provided link
        fetch('https://nbtfeed.indiatimes.com/langapi/config?property=nbt&template=slike_schema&islive=yes') // Replace this URL with your actual JSON URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Populate the form dropdowns using the fetched JSON data
                console.log(data);
                populateFormFromJson(data);
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    }
});

// Function to populate dropdowns from fetched JSON data
function populateFormFromJson(jsonData) {
  // Populate Content Type dropdown
  const contentTypeDropdown = document.getElementById('contentTypeDropdown');
  jsonData.contentType.forEach(item => {
      let option = document.createElement('option');
      option.value = item.tag;
      option.text = item.name;
      contentTypeDropdown.appendChild(option);
  });

  // Populate Video Producer dropdown
  const vpDropdown = document.getElementById('vpDropdown');
  jsonData.videoproducer.forEach(item => {
      let option = document.createElement('option');
      option.value = item.tag;
      option.text = item.name;
      vpDropdown.appendChild(option);
  });

  // Populate Video Uploader dropdown
  const vuDropdown = document.getElementById('vuDropdown');
  jsonData.videouploader.forEach(item => {
      let option = document.createElement('option');
      option.value = item.tag;
      option.text = item.name;
      vuDropdown.appendChild(option);
  });

  // Populate Category dropdown
  const categoryDropdown = document.getElementById('categoryDropdown');
  jsonData.category.forEach(item => {
      let option = document.createElement('option');
      option.value = item.tag;
      option.text = item.name;
      categoryDropdown.appendChild(option);
  });

  // Populate Agency dropdown
  const agencyDropdown = document.getElementById('agencyDropdown');
  jsonData.Agency.forEach(item => {
      let option = document.createElement('option');
      option.value = item.tag;
      option.text = item.name;
      agencyDropdown.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('sidePanelForm');
  if (form) {
      form.addEventListener('submit', handleFormSubmit);
  }
});
// Function to send the current form state to content.js
function sendStateToContentScript() {
  const contentType = document.getElementById('contentTypeDropdown').value;
  const vp = document.getElementById('vpDropdown').value;
  const vu = document.getElementById('vuDropdown').value;
  const category = document.getElementById('categoryDropdown').value;
  const agency = document.getElementById('agencyDropdown').value;

  // Create the new state object based on the current form values
  const newState = {
      ct: contentType,
      vp: vp,
      vu: vu,
      category: category,
      agency: agency
  };

  // Send the state to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setState", state: newState });
  });
}

// Add event listeners to each form element to send state updates immediately
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('contentTypeDropdown').addEventListener('change', sendStateToContentScript);
  document.getElementById('vpDropdown').addEventListener('change', sendStateToContentScript);
  document.getElementById('vuDropdown').addEventListener('change', sendStateToContentScript);
  document.getElementById('categoryDropdown').addEventListener('change', sendStateToContentScript);
  document.getElementById('agencyDropdown').addEventListener('change', sendStateToContentScript);
});


function handleFormSubmit(event) {
    event.preventDefault();

    // Get values from each dropdown
    const contentType = document.getElementById('contentTypeDropdown').value;
    const vp = document.getElementById('vpDropdown').value;
    const vu = document.getElementById('vuDropdown').value;
    const category = document.getElementById('categoryDropdown').value;
    const agency = document.getElementById('agencyDropdown').value;

    // Add console logs to verify the values from the form
    console.log("Content Type:", contentType);
    console.log("VP:", vp);
    console.log("VU:", vu);
    console.log("Category:", category);
    console.log("Agency:", agency);
    
    // Check if all fields are selected (form validation)
    if (contentType && vp && vu && category && agency) {
        formFilled = true;

        // Create an array of tags based on the selected values
        const tags = [
            ` ${contentType}`,
            ` ${vp}`,
            ` ${vu}`,
            ` ${category}`,
            ` ${agency}`
        ];

        console.log('Form submitted:', tags);

        // Send the tags to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'checkTagsVisibility', tags: tags });

            // After form submission, enable the save button
            chrome.tabs.sendMessage(tabs[0].id, { action: 'enableSave' });
        });

        // Reset the form after successful submission
        document.getElementById('sidePanelForm').reset();

        // Clear the form data from localStorage after submission
        localStorage.removeItem('sidePanelFormData');
        console.log('Form data reset and localStorage cleared');
    } else {
        console.error('Please fill all the required fields.');
    }
}
