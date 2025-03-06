chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "populateContact") {
    const data = message.data;

    try {
      // Function to find and populate input fields using 'name' or 'placeholder'
      function populateField(fieldName, placeholder, value) {
        let field = document.querySelector(`input[name='${fieldName}']`) || 
                    document.querySelector(`input[placeholder='${placeholder}']`);
        if (field) {
          field.focus(); // Focus for reliability
          field.value = value; // Set the value
          field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
          console.log(`Populated ${fieldName} with ${value}`);
        } else {
          console.warn(`Field '${fieldName}' not found.`);
        }
      }

      // Populate fields
      populateField("firstName", "First Name", data.FirstName);
      populateField("lastName", "Last Name", data.LastName);
      populateField("Email", "Email", data.Email);
      populateField("Phone", "Phone", data.Phone);

      console.log("Contact fields populated successfully!");
    } catch (error) {
      console.error("Error populating fields:", error);
    }
  }
});