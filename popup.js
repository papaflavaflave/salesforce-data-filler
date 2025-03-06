let tvShowData = {};

// Fetch TV Show Data
fetch(chrome.runtime.getURL("data.json"))
  .then((response) => response.json())
  .then((data) => {
    tvShowData = data;
    populateTVShows();
  });

const tvShowDropdown = document.getElementById("tvShow");
const characterDropdown = document.getElementById("character");
const populateButton = document.getElementById("populate");

// Populate TV Show Dropdown
function populateTVShows() {
  Object.keys(tvShowData).forEach((show) => {
    const option = document.createElement("option");
    option.value = show;
    option.textContent = show;
    tvShowDropdown.appendChild(option);
  });
  tvShowDropdown.disabled = false;
}

// Populate Characters Dropdown
tvShowDropdown.addEventListener("change", () => {
  characterDropdown.innerHTML = "<option value='' disabled selected>Choose a Character</option>";
  const selectedShow = tvShowDropdown.value;

  tvShowData[selectedShow].forEach((character, index) => {
    const option = document.createElement("option");
    option.value = index; // Use the index to reference the character
    option.textContent = `${character.FirstName} ${character.LastName}`;
    characterDropdown.appendChild(option);
  });

  characterDropdown.disabled = false;
});

// Enable Populate Button
characterDropdown.addEventListener("change", () => {
  populateButton.disabled = false;
});

// Send Data to Content Script
populateButton.addEventListener("click", () => {
  const selectedShow = tvShowDropdown.value;
  const selectedCharacter = tvShowData[selectedShow][characterDropdown.value];

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: "populateContact", 
        data: selectedCharacter 
      });
    });
  });
});