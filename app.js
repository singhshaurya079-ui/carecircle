const globalStorageKey = "carecircle-global-state-v1";

let state = loadGlobalState();

const legacyDemoTitles = new Set([
  "Morning mobility walk",
  "Amoxicillin 500mg",
  "Follow-up with Dr. Rao",
  "Pain was lower after lunch",
  "Physical therapist",
  "Evening hydration check"
]);

const overviewContent = document.querySelector("#overviewContent");
const medicinePlanContent = document.querySelector("#medicinePlanContent");
const proceduresContent = document.querySelector("#proceduresContent"); // New content section
const contactsContent = document.querySelector("#contactsContent"); // New content section
const itemView = document.querySelector("#itemView"); // This is the workspace section

const countdownAlertBanner = document.querySelector("#countdownAlertBanner"); // New global alert banner
const countdownAlertText = document.querySelector("#countdownAlertText");

const board = document.querySelector("#board"); // board is inside itemView (workspace)
const proceduresBoard = document.querySelector("#proceduresBoard"); // board for procedures
const viewTitle = document.querySelector("#viewTitle");
const todayLabel = document.querySelector("#todayLabel");
const openTaskCount = document.querySelector("#openTaskCount");
const medicineDueCount = document.querySelector("#medicineDueCount");
const nextAppointment = document.querySelector("#nextAppointment");
const contactCount = document.querySelector("#contactCount");
const searchInput = document.querySelector("#searchInput");
const contactSearchInput = document.querySelector("#contactSearchInput"); // New contact search input
const procedureSearchInput = document.querySelector("#procedureSearchInput"); // New procedure search input
const familyCaregiversGrid = document.querySelector("#familyCaregiversGrid"); // New contact grid
const medicalProfessionalsGrid = document.querySelector("#medicalProfessionalsGrid"); // New contact grid
const composer = document.querySelector("#composer");
const composerForm = document.querySelector("#composerForm");
const itemTypeSelect = document.querySelector("#itemType"); // Added
const itemTitleLabel = document.querySelector("#itemTitleLabel");
const composerDefaultFields = document.querySelector("#composerDefaultFields");
const composerContactFields = document.querySelector("#composerContactFields");
// Replaced contactRelationshipInput with new dynamic fields
const contactCategorySelect = document.querySelector("#contactCategory");
const contactDynamicInputLabel = document.querySelector("#contactDynamicInputLabel");
const contactDynamicInput = document.querySelector("#contactDynamicInput");
const contactPhoneRegionSelect = document.querySelector("#contactPhoneRegion");
const contactPhoneNumberInput = document.querySelector("#contactPhoneNumber");
const contactPhonePrefix = document.querySelector("#contactPhonePrefix");
const itemDetailsLabel = document.querySelector("#itemDetailsLabel");
const itemTitleInput = document.querySelector("#itemTitle");
const itemDateInput = document.querySelector("#itemDate"); // Added
const itemTimeInput = document.querySelector("#itemTime"); // Added
const itemOwnerInput = document.querySelector("#itemOwner"); // Added
const itemDetailsTextarea = document.querySelector("#itemDetails"); // Added
const profileDialog = document.querySelector("#profileDialog");
const profileForm = document.querySelector("#profileForm");
const patientSwitcher = document.querySelector("#patientSwitcher");
const patientNameDisplay = document.querySelector("#patientNameDisplay");
const patientContextDisplay = document.querySelector("#patientContextDisplay");
const personAvatar = document.querySelector("#personAvatar");
const personName = document.querySelector("#personName");
const personContext = document.querySelector("#personContext");
const emergencyName = document.querySelector("#emergencyName");
const emergencyPhone = document.querySelector("#emergencyPhone");
const currentStatus = document.querySelector("#currentStatus");
const statusChip = document.querySelector("#statusChip");
const nowStatus = document.querySelector("#nowStatus");
const nextStatus = document.querySelector("#nextStatus");
const completedTodayStatus = document.querySelector("#completedTodayStatus");
const careProgressStatus = document.querySelector("#careProgressStatus");
const careLanes = document.querySelector("#careLanes");
const phonePrefix = document.querySelector("#phonePrefix");
const phoneRegion = document.querySelector("#profilePhoneRegion");
const morningMedicineTime = document.querySelector("#morningMedicineTime");
const morningMedicineList = document.querySelector("#morningMedicineList");
const morningMedicineState = document.querySelector("#morningMedicineState");
const nightMedicineTime = document.querySelector("#nightMedicineTime");
const nightMedicineList = document.querySelector("#nightMedicineList");
const nightMedicineState = document.querySelector("#nightMedicineState");
const reminderDialog = document.querySelector("#reminderDialog");
const reminderForm = document.querySelector("#reminderForm");
const reminderType = document.querySelector("#reminderType");
const reminderTitle = document.querySelector("#reminderTitle");
const reminderDetails = document.querySelector("#reminderDetails");
const confirmReminder = document.querySelector("#confirmReminder");

const addPatientButton = document.querySelector("#addPatientButton");
const deleteProfileButton = document.querySelector("#deleteProfileButton"); // New delete button
const deleteConfirmationDialog = document.querySelector("#deleteConfirmationDialog"); // New dialog
const deleteConfirmationInput = document.querySelector("#deleteConfirmationInput"); // Confirmation input
const confirmDeleteButton = document.querySelector("#confirmDeleteButton"); // Confirm delete button
const patientNameToDelete = document.querySelector("#patientNameToDelete"); // Span for patient name in dialog

const emergencyFab = document.querySelector("#emergencyFab"); // New FAB
const emergencyDialog = document.querySelector("#emergencyDialog"); // Emergency dialog
const emergencyPatientName = document.querySelector("#emergencyPatientName"); // Patient name in emergency dialog
const emergencyBloodType = document.querySelector("#emergencyBloodType"); // Blood type in emergency dialog
const emergencyContactName = document.querySelector("#emergencyContactName"); // Emergency contact name in emergency dialog
const emergencyContactPhone = document.querySelector("#emergencyContactPhone"); // Emergency contact phone in emergency dialog
const emergencyContactPhoneLink = document.querySelector("#emergencyContactPhoneLink"); // Emergency contact phone link
const emergencyPrimaryDoctorName = document.querySelector("#emergencyPrimaryDoctorName"); // Primary doctor name in emergency dialog
const emergencyPrimaryDoctorPhone = document.querySelector("#emergencyPrimaryDoctorPhone"); // Primary doctor phone in emergency dialog
const emergencyPrimaryDoctorPhoneLink = document.querySelector("#emergencyPrimaryDoctorPhoneLink"); // Primary doctor phone link

function loadGlobalState() {
  const stored = localStorage.getItem(globalStorageKey);
  if (!stored) {
    return {
      view: "overview",
      filter: "all",
      query: "",
      contactQuery: "",
      procedureQuery: "",
      activeReminder: null,
      patients: [],
      currentPatientId: null,
      medicineAlarmsPlayed: {},
    };
  }

  try {
    const loadedState = JSON.parse(stored);
    // Ensure all top-level keys exist if loading an older state
    return {
      view: loadedState.view || "overview",
      filter: loadedState.filter || "all",
      query: loadedState.query || "",
      contactQuery: loadedState.contactQuery || "",
      procedureQuery: loadedState.procedureQuery || "",
      activeReminder: loadedState.activeReminder || null,
      patients: loadedState.patients || [],
      currentPatientId: loadedState.currentPatientId || (loadedState.patients.length > 0 ? loadedState.patients[0].id : null),
      medicineAlarmsPlayed: loadedState.medicineAlarmsPlayed || {},
    };
  } catch (e) {
    console.error("Error loading state from localStorage:", e);
    return {
      view: "overview",
      filter: "all",
      query: "",
      contactQuery: "",
      procedureQuery: "",
      activeReminder: null,
      patients: [],
      currentPatientId: null,
      medicineAlarmsPlayed: {},
    };
  }
}

function saveGlobalState() {
  localStorage.setItem(globalStorageKey, JSON.stringify(state));
}

function getInitialPatientState(profile) {
  return {
    id: crypto.randomUUID(),
    profile: profile,
    items: [],
    procedures: [],
    medicinePlan: {
      morning: { time: "08:00", medicines: "" },
      night: { time: "20:00", medicines: "" }
    },
    medicineLog: {},
    reminderLog: {},
  };
}

function getCurrentPatient() {
  return state.patients.find((p) => p.id === state.currentPatientId);
}

// Initial setup after loading global state
todayLabel.textContent = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

// Populate patient switcher on load
function populatePatientSwitcher() {
  patientSwitcher.innerHTML = "";
  if (state.patients.length === 0) {
    patientSwitcher.innerHTML = '<option value="">No patients added</option>';
    patientSwitcher.disabled = true;
  } else {
    patientSwitcher.disabled = false;
    state.patients.forEach(patient => {
      const option = document.createElement("option");
      option.value = patient.id;
      option.textContent = patient.profile.name;
      if (patient.id === state.currentPatientId) {
        option.selected = true;
      }
      patientSwitcher.appendChild(option);
    });
  }
}

populatePatientSwitcher(); // Call on initial load

patientSwitcher.addEventListener("change", (event) => {
  state.currentPatientId = event.target.value;
  saveGlobalState();
  render(); // Re-render the entire app for the new patient
});

addPatientButton.addEventListener("click", () => {
  openProfileDialog(true, true); // true for isRequired, true for isNewPatient
});

deleteProfileButton.addEventListener("click", () => {
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    patientNameToDelete.textContent = currentPatient.profile.name;
    deleteConfirmationInput.value = ""; // Clear input on open
    confirmDeleteButton.disabled = true; // Disable until 'DELETE' is typed
    deleteConfirmationDialog.showModal();
  }
});

deleteConfirmationInput.addEventListener("input", () => {
  confirmDeleteButton.disabled = deleteConfirmationInput.value.trim() !== "DELETE";
});

deleteConfirmationDialog.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  if (deleteConfirmationInput.value.trim() === "DELETE") {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      state.patients = state.patients.filter(p => p.id !== currentPatient.id);
      state.currentPatientId = state.patients.length > 0 ? state.patients[0].id : null;
      saveGlobalState();
      populatePatientSwitcher();
      deleteConfirmationDialog.close();
      render();
    }
  }
});

emergencyFab.addEventListener("click", () => {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    alert("Please add a patient first to use the emergency dialer.");
    return;
  }
  emergencyPatientName.textContent = currentPatient.profile.name;
  emergencyBloodType.textContent = currentPatient.profile.bloodType || "N/A";

  const emergencyContact = currentPatient.profile.emergencyName || "N/A";
  const emergencyContactNum = formatPhone(currentPatient.profile) || "N/A";
  emergencyContactName.textContent = emergencyContact;
  emergencyContactPhone.textContent = emergencyContactNum;
  emergencyContactPhoneLink.href = emergencyContactNum !== "N/A" ? `tel:${emergencyContactNum.replace(/\s/g, '')}` : "#";
  emergencyContactPhoneLink.classList.toggle("disabled", emergencyContactNum === "N/A");


  const primaryDoctorPhone = currentPatient.profile.primaryDoctorPhone || "N/A";
  emergencyPrimaryDoctorName.textContent = "N/A"; // Placeholder for actual doctor name if we add it
  emergencyPrimaryDoctorPhone.textContent = primaryDoctorPhone;
  emergencyPrimaryDoctorPhoneLink.href = primaryDoctorPhone !== "N/A" ? `tel:${primaryDoctorPhone.replace(/\s/g, '')}` : "#";
  emergencyPrimaryDoctorPhoneLink.classList.toggle("disabled", primaryDoctorPhone === "N/A");

  emergencyDialog.showModal();
});

emergencyDialog.addEventListener("click", (event) => {
  if (event.target.value === "close") {
    emergencyDialog.close();
  }
});

function navigateToSection(sectionId) {
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    currentPatient.view = sectionId; // Save patient's last viewed section
    state.view = sectionId;
  } else {
    state.view = sectionId; // For no patient selected state
  }
  saveGlobalState();

  // Update active nav tab
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("is-active"));
  const targetTab = document.querySelector(`.nav-tab[data-view="${sectionId}"]`);
  if (targetTab) {
    targetTab.classList.add("is-active");
  }

  // Hide all view sections and show the target one
  document.querySelectorAll(".view-section").forEach((section) => {
    section.classList.add("is-hidden");
  });
  const targetSection = document.querySelector(`#${sectionId}Content`) || document.querySelector(`#itemView`);
  if (targetSection) {
    targetSection.classList.remove("is-hidden");
  } else {
    // If it's a workspace view (tasks, medicine, appointments, notes),
    // then the itemView section is shown.
    if (["tasks", "medicine", "appointments", "notes"].includes(sectionId)) {
      document.querySelector("#itemView").classList.remove("is-hidden");
    }
  }

  // Update view title
  viewTitle.textContent = titleForView(sectionId);

  render(); // Re-render content specific to the new section
}


// Rebuild Navigation Listeners from Scratch
document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    navigateToSection(button.dataset.view);
  });
});

document.querySelectorAll(".summary-grid .metric").forEach((card) => {
  card.addEventListener("click", () => {
    navigateToSection(card.dataset.view);
  });
});

// Event listener for contacts search input
if (contactSearchInput) {
  contactSearchInput.addEventListener("input", (event) => {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      currentPatient.contactQuery = event.target.value.trim().toLowerCase();
      saveGlobalState();
      renderContacts(); // Only re-render contacts
    }
  });
}

// Event listener for procedure search input
if (procedureSearchInput) {
  procedureSearchInput.addEventListener("input", (event) => {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      currentPatient.procedureQuery = event.target.value.trim().toLowerCase();
      saveGlobalState();
      renderProcedures(); // Only re-render procedures
    }
  });
}

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      currentPatient.filter = button.dataset.filter;
      saveGlobalState();
    }
    document.querySelectorAll(".segment").forEach((segment) => segment.classList.remove("is-active"));
    button.classList.add("is-active");
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    currentPatient.query = event.target.value.trim().toLowerCase();
    saveGlobalState();
  }
  render();
});

document.querySelector("#openComposer").addEventListener("click", () => {
  itemDateInput.value = todayOffset(0);
  itemTypeSelect.value = "task"; // Reset to default type
  updateComposerFields(itemTypeSelect.value); // Update fields for default type
  composer.showModal();
});

document.querySelector("#closeComposer").addEventListener("click", () => composer.close());
document.querySelector("#cancelComposer").addEventListener("click", () => composer.close());

itemTypeSelect.addEventListener("change", (event) => {
  updateComposerFields(event.target.value);
});

contactPhoneRegionSelect.addEventListener("change", () => {
  contactPhonePrefix.textContent = contactPhoneRegionSelect.value;
});

contactCategorySelect.addEventListener("change", () => {
  toggleContactDynamicInput();
});

// Function to update the dynamic input field based on contact category
function toggleContactDynamicInput() {
  const selectedCategory = contactCategorySelect.value;
  if (selectedCategory === "family-caregivers") {
    contactDynamicInputLabel.childNodes[0].textContent = "Relationship to Patient";
    contactDynamicInput.placeholder = "Parent, Spouse, Friend";
  } else if (selectedCategory === "medical-professionals") {
    contactDynamicInputLabel.childNodes[0].textContent = "Professional Role";
    contactDynamicInput.placeholder = "Surgeon, Doctor, Nurse, Cardiologist";
  }
}

// Function to update composer fields based on selected item type
function updateComposerFields(itemType) {
  // Reset fields that might be conditionally hidden/shown
  itemTitleLabel.querySelector('span').textContent = "Title is required."; // Reset error message

  // Toggle visibility of field groups
  if (itemType === "contact") {
    composerDefaultFields.classList.add("is-hidden");
    composerContactFields.classList.remove("is-hidden");
    itemTitleLabel.childNodes[0].textContent = "Full Name"; // Update label text
    itemTitleInput.placeholder = "John Doe";
    itemDetailsLabel.childNodes[0].textContent = "Additional Notes"; // Update label text for contacts
    itemDetailsTextarea.placeholder = "Example: Preferred communication method, availability, etc.";
    itemTitleInput.required = true; // Full Name is required
    contactCategorySelect.required = true; // Contact Category is required
    contactDynamicInput.required = true; // Dynamic input (relationship/role) is required
    contactPhoneNumberInput.required = false; // Phone is optional

    // Set a default for contact category if not already set (e.g., when opening new composer)
    if (!contactCategorySelect.value) {
      contactCategorySelect.value = "family-caregivers";
    }
    toggleContactDynamicInput(); // Update the dynamic input's label/placeholder based on category

  } else {
    composerDefaultFields.classList.remove("is-hidden");
    composerContactFields.classList.add("is-hidden");
    itemTitleLabel.childNodes[0].textContent = "Title"; // Update label text
    itemTitleInput.placeholder = "Blood pressure check";
    itemDetailsLabel.childNodes[0].textContent = "Details"; // Update label text
    itemDetailsTextarea.placeholder = "Add instructions, dosage, location, or context.";
    itemTitleInput.required = true; // Title is required for other types
    contactCategorySelect.required = false; // Not required for non-contacts
    contactDynamicInput.required = false; // Not required for non-contacts
  }

  // Set phone prefix for contact form if it's visible
  if (!composerContactFields.classList.contains("is-hidden")) {
    contactPhonePrefix.textContent = contactPhoneRegionSelect.value;
  }
}

document.querySelector("#clearItems").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear ALL care items for this patient? This action cannot be undone.")) {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      currentPatient.items = [];
      currentPatient.procedures = [];
      currentPatient.medicineLog = {};
      currentPatient.reminderLog = {};
      currentPatient.medicinePlan = {
        morning: { time: "08:00", medicines: "" },
        night: { time: "20:00", medicines: "" }
      };
      saveGlobalState();
      render();
    }
  }
});

document.querySelector("#editProfile").addEventListener("click", () => openProfileDialog(false, false)); // Not required, not new patient
document.querySelector("#closeProfile").addEventListener("click", () => closeProfileDialog());
document.querySelector("#cancelProfile").addEventListener("click", () => closeProfileDialog());
phoneRegion.addEventListener("change", () => {
  phonePrefix.textContent = phoneRegion.value;
});

document.querySelector("#saveMedicinePlan").addEventListener("click", () => {
  const currentPatient = getCurrentPatient();
  if (currentPatient) {
    currentPatient.medicinePlan = {
      morning: {
        time: morningMedicineTime.value || "08:00",
        medicines: morningMedicineList.value.trim()
      },
      night: {
        time: nightMedicineTime.value || "20:00",
        medicines: nightMedicineList.value.trim()
      }
    };
    saveGlobalState();
    render();
    checkReminders();
  }
});

document.querySelector("#dismissReminder").addEventListener("click", () => {
  dismissActiveReminder();
});

reminderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  completeActiveReminder();
});

composerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const itemType = itemTypeSelect.value;
  let item = {
    id: crypto.randomUUID(),
    type: itemType,
    title: itemTitleInput.value.trim(),
    done: false
  };

  if (itemType === "contact") {
    item.category = contactCategorySelect.value; // Store the selected category
    item.relationship = contactDynamicInput.value.trim(); // Store the dynamic input value
    item.phoneRegion = contactPhoneRegionSelect.value;
    item.phoneNumber = contactPhoneNumberInput.value.trim();
    item.details = itemDetailsTextarea.value.trim(); // Additional notes for contact
    // Clear standard fields for contacts as they are not relevant
    item.date = "";
    item.time = "";
    item.owner = "";
  } else {
    item.date = itemDateInput.value;
    item.time = itemTimeInput.value;
    item.owner = itemOwnerInput.value.trim();
    item.details = itemDetailsTextarea.value.trim();
  }

  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    console.error("No current patient selected.");
    return;
  }

  // Determine if it's a regular item or a procedure/surgery
  if (item.type === "procedure") {
    currentPatient.procedures.unshift(item);
  } else {
    currentPatient.items.unshift(item);
  }
  saveGlobalState(); // Save entire state after item modification

  composerForm.reset();
  composer.close();
  render();
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isNewPatient = profileDialog.dataset.isNewPatient === "true";

  const newProfile = {
    name: document.querySelector("#profileName").value.trim(),
    relationship: document.querySelector("#profileRelationship").value.trim(),
    focus: document.querySelector("#profileFocus").value.trim(),
    emergencyName: document.querySelector("#profileEmergencyName").value.trim(),
    phoneRegion: document.querySelector("#profilePhoneRegion").value,
    emergencyPhone: document.querySelector("#profileEmergencyPhone").value.trim(),
    age: document.querySelector("#profileAge").value.trim(),
    bloodType: document.querySelector("#profileBloodType").value.trim(), // New field
    primaryDoctorPhone: document.querySelector("#profilePrimaryDoctorPhone").value.trim(), // New field
    medicalConditions: document.querySelector("#profileMedicalConditions").value.trim(),
  };

  if (isNewPatient) {
    const newPatient = getInitialPatientState(newProfile);
    state.patients.push(newPatient);
    state.currentPatientId = newPatient.id;
  } else {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      currentPatient.profile = newProfile;
    }
  }

  saveGlobalState();
  profileDialog.close();
  populatePatientSwitcher(); // Update switcher dropdown
  render();
});

function render() {
  const currentPatient = getCurrentPatient();

  // Handle the case where no patient is selected
  if (!currentPatient) {
    // Clear content areas and show placeholders
    board.innerHTML = `<div class="empty"><p>Please add a patient to get started.</p></div>`;
    proceduresBoard.innerHTML = `<div class="empty"><p>Please add a patient to get started.</p></div>`;
    familyCaregiversGrid.innerHTML = `<div class="empty"><p>Please add a patient to get started.</p></div>`;
    medicalProfessionalsGrid.innerHTML = `<div class="empty"><p>Please add a patient to get started.</p></div>`;

    // Clear profile and metric displays
    patientNameDisplay.textContent = "Add a loved one";
    patientContextDisplay.textContent = "Start their care plan";
    personAvatar.textContent = "--";
    emergencyName.textContent = "Add emergency contact";
    emergencyPhone.textContent = "No phone saved";
    openTaskCount.textContent = "0";
    medicineDueCount.textContent = "0";
    nextAppointment.textContent = "None";
    contactCount.textContent = "0";
    currentStatus.textContent = "Ready to start care";
    statusChip.textContent = "No active items";
    statusChip.className = "status-chip";
    nowStatus.textContent = "Nothing scheduled";
    nextStatus.textContent = "No upcoming care";
    completedTodayStatus.textContent = "0 done";
    careProgressStatus.textContent = "0%";
    careLanes.innerHTML = "";
    countdownAlertBanner.classList.add("is-hidden"); // Hide alert if no patient

    // Render an "empty" profile in the sidebar
    renderProfile();
    return;
  }

  // Ensure current patient's view and filter settings are used
  state.view = currentPatient.view || "overview";
  state.filter = currentPatient.filter || "all";
  searchInput.value = currentPatient.query || "";
  contactSearchInput.value = currentPatient.contactQuery || "";
  procedureSearchInput.value = currentPatient.procedureQuery || "";

  // Update active filter segment for itemView (tasks, medicine, etc.)
  document.querySelectorAll(".segment").forEach((segment) => segment.classList.remove("is-active"));
  const targetSegment = document.querySelector(`.segment[data-filter="${state.filter}"]`);
  if (targetSegment) {
    targetSegment.classList.add("is-active");
  }

  // Render components common to all views or always updated
  renderProfile();
  renderMedicinePlan();
  renderMetrics();
  renderCareStatus();
  updateCountdownAlerts();

  // Render specific content based on the current view
  if (state.view === "overview") {
    // Overview content is rendered by renderMetrics, renderCareStatus, etc.
  } else if (state.view === "medicine") {
    // Medicine plan content is rendered by renderMedicinePlan
  } else if (state.view === "procedures") {
    renderProcedures();
  } else if (state.view === "contacts") {
    renderContacts();
  } else { // For tasks, appointments, notes, medicine (workspace items)
    const visibleItems = getVisibleItems();
    board.innerHTML = "";
    if (visibleItems.length === 0) {
      board.innerHTML = `<div class="empty"><p>No matching care items yet.</p></div>`;
    } else {
      visibleItems.forEach((item) => board.appendChild(renderCard(item)));
    }
  }
}

function renderContacts() {
  familyCaregiversGrid.innerHTML = "";
  medicalProfessionalsGrid.innerHTML = "";

  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    contactsContent.querySelector(".contact-groups-container").innerHTML = `<div class="empty"><p>No patient selected.</p></div>`;
    return;
  }

  const contacts = currentPatient.items.filter((item) => item.type === "contact");
  const filteredContacts = contacts.filter((item) => {
    const haystack = `${item.title} ${item.details} ${item.relationship} ${item.category} ${item.phoneNumber}`.toLowerCase();
    return haystack.includes(currentPatient.contactQuery);
  });

  filteredContacts.forEach((contact) => {
    const card = document.createElement("article");
    card.className = "contact-card";
    // Construct contact details
    let contactDetailsHtml = [];

    // Display the dynamic relationship/role field
    if (contact.relationship) {
      const labelText = contact.category === "medical-professionals" ? "Role" : "Relationship";
      contactDetailsHtml.push(`<p class="contact-dynamic-field"><strong>${labelText}:</strong> ${escapeHtml(contact.relationship)}</p>`);
    }

    const fullPhoneNumber = (contact.phoneRegion && contact.phoneNumber) ? `${contact.phoneRegion} ${contact.phoneNumber}` : '';
    if (fullPhoneNumber) {
      contactDetailsHtml.push(`<p class="contact-phone"><strong>Phone:</strong> ${escapeHtml(fullPhoneNumber)}</p>`);
    }
    if (contact.details) { // This is now for additional notes for contacts
      contactDetailsHtml.push(`<p class="contact-notes">${escapeHtml(contact.details)}</p>`);
    }
    if (contactDetailsHtml.length === 0) {
      contactDetailsHtml.push(`<p class="muted">No details provided.</p>`);
    }


    card.innerHTML = `
      <h4>${escapeHtml(contact.title)}</h4>
      ${contactDetailsHtml.join('')}
      <div class="card-actions">
        <button type="button" data-action="edit-contact" data-id="${contact.id}">Edit</button>
        <button type="button" data-action="delete-contact" data-id="${contact.id}">Delete</button>
      </div>
    `;

    card.querySelector('[data-action="edit-contact"]').addEventListener("click", (event) => {
      const itemId = event.target.dataset.id;
      const itemToEdit = currentPatient.items.find((i) => i.id === itemId);
      if (itemToEdit && itemToEdit.type === "contact") {
        itemTypeSelect.value = itemToEdit.type;
        updateComposerFields(itemToEdit.type); // Update fields for contact type
        itemTitleInput.value = itemToEdit.title;

        // Handle legacy data: if category is not set, infer from old relationship or default
        let initialCategory = itemToEdit.category || "family-caregivers";
        let initialDynamicValue = itemToEdit.relationship || "";

        // If no explicit category but old relationship contains medical keywords, suggest medical
        if (!itemToEdit.category && (initialDynamicValue.toLowerCase().includes("doctor") || initialDynamicValue.toLowerCase().includes("nurse") || initialDynamicValue.toLowerCase().includes("therapist"))) {
          initialCategory = "medical-professionals";
        }
        
        contactCategorySelect.value = initialCategory;
        toggleContactDynamicInput(); // Update label/placeholder based on the *newly set* category
        contactDynamicInput.value = initialDynamicValue; // Populate dynamic input

        contactPhoneRegionSelect.value = itemToEdit.phoneRegion || "+1";
        contactPhonePrefix.textContent = contactPhoneRegionSelect.value;
        contactPhoneNumberInput.value = itemToEdit.phoneNumber || "";
        itemDetailsTextarea.value = itemToEdit.details || ""; // Additional notes
        composer.dataset.editingId = itemId;
        composer.showModal();
      }
    });

    card.querySelector('[data-action="delete-contact"]').addEventListener("click", (event) => {
      if (confirm("Are you sure you want to delete this contact?")) {
        const itemId = event.target.dataset.id;
        currentPatient.items = currentPatient.items.filter((candidate) => candidate.id !== itemId);
        saveGlobalState(); // Save entire state after item modification
        renderContacts();
      }
    });

    // Categorization based on the new category field
    if (contact.category === "medical-professionals") {
      medicalProfessionalsGrid.appendChild(card);
    } else { // Default to family-caregivers or if category is not set
      familyCaregiversGrid.appendChild(card);
    }
  });

  if (familyCaregiversGrid.children.length === 0 && medicalProfessionalsGrid.children.length === 0) {
    contactsContent.querySelector(".contact-groups-container").innerHTML = `<div class="empty"><p>No matching contacts yet.</p></div>`;
  } else if (familyCaregiversGrid.children.length === 0) {
    contactsContent.querySelector(".contact-group:first-child").classList.add("is-hidden");
  } else {
    contactsContent.querySelector(".contact-group:first-child").classList.remove("is-hidden");
  }

  if (medicalProfessionalsGrid.children.length === 0) {
    contactsContent.querySelector(".contact-group:last-child").classList.add("is-hidden");
  } else {
    contactsContent.querySelector(".contact-group:last-child").classList.remove("is-hidden");
  }
}

function renderProcedures() {
  proceduresBoard.innerHTML = "";
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    proceduresBoard.innerHTML = `<div class="empty"><p>No patient selected.</p></div>`;
    return;
  }
  const filteredProcedures = currentPatient.procedures.filter((item) => {
    const haystack = `${item.title} ${item.details} ${item.owner}`.toLowerCase();
    return haystack.includes(currentPatient.procedureQuery);
  });

  if (filteredProcedures.length === 0) {
    proceduresBoard.innerHTML = `<div class="empty"><p>No matching procedures or surgeries yet.</p></div>`;
    return;
  }
  filteredProcedures.sort(compareItemsBySchedule).forEach((procedure) => proceduresBoard.appendChild(renderCard(procedure)));
}

function renderProfile() {
  const currentPatient = getCurrentPatient();

  if (!currentPatient || !currentPatient.profile) {
    patientNameDisplay.textContent = "Add Patient";
    patientContextDisplay.textContent = "";
    personAvatar.textContent = "--";
    personName.textContent = "Add a loved one";
    personContext.textContent = "Start their care plan";
    emergencyName.textContent = "Add emergency contact";
    emergencyPhone.textContent = "No phone saved";
    return;
  }

  patientNameDisplay.textContent = currentPatient.profile.name;
  patientContextDisplay.textContent = [currentPatient.profile.relationship, currentPatient.profile.focus].filter(Boolean).join(" - ") || "Care plan";

  personAvatar.textContent = getInitials(currentPatient.profile.name);
  personName.textContent = currentPatient.profile.name;
  personContext.textContent = [currentPatient.profile.relationship, currentPatient.profile.focus].filter(Boolean).join(" - ") || "Care plan";
  emergencyName.textContent = currentPatient.profile.emergencyName || "Emergency contact";
  emergencyPhone.textContent = formatPhone(currentPatient.profile) || "Add emergency phone";
}

function renderMedicinePlan() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    morningMedicineTime.value = "08:00";
    morningMedicineList.value = "";
    nightMedicineTime.value = "20:00";
    nightMedicineList.value = "";
    morningMedicineState.textContent = "No patient selected.";
    nightMedicineState.textContent = "No patient selected.";
    return;
  }

  morningMedicineTime.value = currentPatient.medicinePlan.morning.time;
  morningMedicineList.value = currentPatient.medicinePlan.morning.medicines;
  nightMedicineTime.value = currentPatient.medicinePlan.night.time;
  nightMedicineList.value = currentPatient.medicinePlan.night.medicines;

  morningMedicineState.textContent = medicineDoseState("morning");
  nightMedicineState.textContent = medicineDoseState("night");
}

function renderCareStatus() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    // Handled by the main render() function when no patient is selected
    return;
  }

  const today = todayOffset(0);
  const datedItems = currentPatient.items.filter((item) => item.date);
  const todayItems = datedItems.filter((item) => item.date === today);
  const medicineDoses = getPlannedMedicineDoses();
  const openToday = todayItems.filter((item) => !item.done);
  const completedToday = todayItems.filter((item) => item.done);
  const overdue = datedItems.filter((item) => !item.done && item.date < today);
  const dueMedicineDoses = medicineDoses.filter((dose) => dose.isDue && !dose.done);
  const completedMedicineDoses = medicineDoses.filter((dose) => dose.done);
  const upcoming = datedItems
    .filter((item) => !item.done && item.date >= today)
    .sort(compareItemsBySchedule);
  const current = openToday.sort(compareItemsBySchedule)[0];
  const currentDose = dueMedicineDoses[0];
  const next = upcoming.find((item) => item.id !== current?.id) || upcoming[0];
  const completedCount = currentPatient.items.filter((item) => item.done).length;
  const totalCareUnits = currentPatient.items.length + medicineDoses.length;
  const progress = totalCareUnits === 0 ? 0 : Math.round(((completedCount + completedMedicineDoses.length) / totalCareUnits) * 100);

  if (overdue.length > 0 || dueMedicineDoses.length > 0) {
    const attentionCount = overdue.length + dueMedicineDoses.length;
    currentStatus.textContent = `${attentionCount} care item${attentionCount === 1 ? "" : "s"} need attention`;
    statusChip.textContent = "Needs attention";
    statusChip.className = "status-chip needs-attention";
  } else if (currentDose) {
    currentStatus.textContent = "Medicine in progress";
    statusChip.textContent = "Medicine time";
    statusChip.className = "status-chip active";
  } else if (current) {
    currentStatus.textContent = `${labelForType(current.type)} in progress`;
    statusChip.textContent = "Active today";
    statusChip.className = "status-chip active";
  } else if ((completedToday.length > 0 || completedMedicineDoses.length > 0) && openToday.length === 0) {
    currentStatus.textContent = "Today's scheduled care is complete";
    statusChip.textContent = "On track";
    statusChip.className = "status-chip";
  } else {
    currentStatus.textContent = state.items.length === 0 ? "Ready to start care" : "No active care right now";
    statusChip.textContent = state.items.length === 0 ? "No active items" : "On track";
    statusChip.className = "status-chip";
  }

  nowStatus.textContent = currentDose ? doseStatusText(currentDose) : current ? statusItemText(current) : overdue[0] ? statusItemText(overdue[0]) : "Nothing scheduled";
  nextStatus.textContent = next ? statusItemText(next) : nextMedicineDoseText(medicineDoses);
  completedTodayStatus.textContent = `${completedToday.length + completedMedicineDoses.length} done`;
  careProgressStatus.textContent = `${progress}%`;
  renderCareLanes(medicineDoses);
}

function renderCareLanes(medicineDoses = getPlannedMedicineDoses()) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    careLanes.innerHTML = "";
    return;
  }

  const laneTypes = ["medicine", "task", "appointment", "note"];
  careLanes.innerHTML = "";

  laneTypes.forEach((type) => {
    const items = currentPatient.items.filter((item) => item.type === type);
    const extraTotal = type === "medicine" ? medicineDoses.length : 0;
    const extraComplete = type === "medicine" ? medicineDoses.filter((dose) => dose.done).length : 0;
    const complete = items.filter((item) => item.done).length + extraComplete;
    const total = items.length + extraTotal;
    const percent = total === 0 ? 0 : Math.round((complete / total) * 100);
    const lane = document.createElement("article");
    lane.className = "care-lane";
    lane.innerHTML = `
      <div class="lane-top">
        <span class="lane-label">${labelForType(type)}</span>
        <span class="lane-count">${complete}/${total}</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
    `;
    careLanes.appendChild(lane);
  });
}

function renderMetrics() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    openTaskCount.textContent = "0";
    medicineDueCount.textContent = "0";
    contactCount.textContent = "0";
    nextAppointment.textContent = "None";
    return;
  }

  openTaskCount.textContent = currentPatient.items.filter((item) => item.type === "task" && !item.done).length;
  const plannedMedicineDue = getPlannedMedicineDoses().filter((dose) => dose.isDue && !dose.done).length;
  medicineDueCount.textContent = currentPatient.items.filter((item) => item.type === "medicine" && !item.done && item.date <= todayOffset(0)).length + plannedMedicineDue;
  contactCount.textContent = currentPatient.items.filter((item) => item.type === "contact").length;

  const next = currentPatient.items
    .filter((item) => item.type === "appointment" && item.date)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];

  nextAppointment.textContent = next ? formatShortDate(next.date) : "None";
}

function renderCard(item) {
  const card = document.createElement("article");
  card.className = `card ${item.done ? "is-done" : ""}`;
  card.innerHTML = `
    <div class="card-header">
      <div>
        <span class="pill ${item.type}">${labelForType(item.type)}</span>
        <h3>${escapeHtml(item.title)}</h3>
      </div>
    </div>
    <p class="card-details">${escapeHtml(item.details || "No details added.")}</p>
    <div class="meta-list">
      ${item.date ? `<span>${formatDate(item.date)}${item.time ? ` at ${formatTime(item.time)}` : ""}</span>` : ""}
      ${item.owner ? `<span>Assigned to ${escapeHtml(item.owner)}</span>` : ""}
      <span>${item.done ? "Completed" : "Open"}</span>
    </div>
    <div class="card-actions">
      <button type="button" data-action="toggle">${item.done ? "Reopen" : "Complete"}</button>
      <button type="button" data-action="delete">Delete</button>
    </div>
  `;

  card.querySelector('[data-action="toggle"]').addEventListener("click", () => {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      const targetItem = currentPatient.items.find((candidate) => candidate.id === item.id);
      if (targetItem) {
        targetItem.done = !targetItem.done;
      } else {
        // Also check in procedures if it's a procedure type
        const targetProcedure = currentPatient.procedures.find((candidate) => candidate.id === item.id);
        if (targetProcedure) {
          targetProcedure.done = !targetProcedure.done;
        }
      }
      saveGlobalState();
      render();
    }
  });

  card.querySelector('[data-action="delete"]').addEventListener("click", () => {
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
      if (item.type === "procedure") {
        currentPatient.procedures = currentPatient.procedures.filter((candidate) => candidate.id !== item.id);
      } else {
        currentPatient.items = currentPatient.items.filter((candidate) => candidate.id !== item.id);
      }
      saveGlobalState();
      render();
    }
  });

  return card;
}

function getVisibleItems() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    return [];
  }
  return currentPatient.items.filter((item) => {
    // Only show items relevant to the current view (tasks, appointments, notes, medicine in workspace)
    const matchesView = (pluralType(item.type) === state.view || (state.view === "medicine" && item.type === "medicine")) && item.type !== "contact";

    const matchesFilter =
      currentPatient.filter === "all" ||
      (currentPatient.filter === "today" && item.date === todayOffset(0)) ||
      (currentPatient.filter === "open" && !item.done);
    const haystack = `${item.type} ${item.title} ${item.owner} ${item.details}`.toLowerCase();
    return matchesView && matchesFilter && haystack.includes(currentPatient.query);
  });
}


// These functions now operate on the current patient's data directly
// The top-level `state` object is managed by `loadGlobalState`/`saveGlobalState`

function medicineDoseState(slot) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    return `No patient selected.`;
  }
  const dose = getPlannedMedicineDoses().find((candidate) => candidate.slot === slot);
  if (!dose) {
    return `No ${slot} medicines saved.`;
  }
  if (dose.done) {
    return `Taken today at ${dose.time}.`;
  }
  if (dose.isDue) {
    return `Due now at ${dose.time}.`;
  }
  return `Scheduled for ${dose.time}.`;
}


function getPlannedMedicineDoses() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    return [];
  }

  return ["morning", "night"]
    .map((slot) => {
      const plan = currentPatient.medicinePlan[slot];
      if (!plan?.medicines) {
        return null;
      }
      const key = medicineDoseKey(slot);
      return {
        id: `medicine-${slot}-${todayOffset(0)}`,
        kind: "medicine-dose",
        slot,
        title: `${capitalize(slot)} medicine`,
        details: plan.medicines,
        time: plan.time,
        done: Boolean(currentPatient.medicineLog[key]),
        isDue: isTimeDue(plan.time)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function checkReminders() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient || reminderDialog.open || profileDialog.open || composer.open) {
    return;
  }

  const todayKey = todayOffset(0);
  if (!state.medicineAlarmsPlayed[currentPatient.id]) { // Link alarms to patient ID
    state.medicineAlarmsPlayed[currentPatient.id] = {};
  }
  if (!state.medicineAlarmsPlayed[currentPatient.id][todayKey]) { // Link alarms to patient ID and day
    state.medicineAlarmsPlayed[currentPatient.id][todayKey] = {};
  }


  const medicineReminder = getPlannedMedicineDoses().find((dose) => dose.isDue && !dose.done && !isReminderDismissed(dose.id));
  if (medicineReminder) {
    // Audible alarm for medicine
    if (!state.medicineAlarmsPlayed[currentPatient.id][todayKey][medicineReminder.id]) {
      const utterance = new SpeechSynthesisUtterance(`Time for medicine: ${medicineReminder.details}`);
      window.speechSynthesis.speak(utterance);
      state.medicineAlarmsPlayed[currentPatient.id][todayKey][medicineReminder.id] = true; // Mark as played
      saveGlobalState(); // Save state after playing alarm
      console.log(`Medicine alarm played for: ${medicineReminder.details}`);
    }

    showReminder({
      kind: "medicine-dose",
      id: medicineReminder.id,
      title: `${capitalize(medicineReminder.slot)} medicine time`,
      type: "Medicine reminder",
      details: medicineReminder.details,
      confirmText: "Mark as taken",
      slot: medicineReminder.slot
    });
    return;
  }

  const allDueItems = [
    ...currentPatient.items.filter((item) => ["appointment", "task", "medicine"].includes(item.type)),
    ...currentPatient.procedures // include procedures for reminders
  ].filter((item) => !item.done && item.date === todayOffset(0) && item.time && isTimeDue(item.time) && !isReminderDismissed(item.id))
    .sort(compareItemsBySchedule);

  const itemReminder = allDueItems[0];

  if (itemReminder) {
    showReminder({
      kind: "item",
      id: itemReminder.id,
      title: `${labelForType(itemReminder.type)} time`,
      type: `${labelForType(itemReminder.type)} reminder`,
      details: `${itemReminder.title}${itemReminder.details ? ` - ${itemReminder.details}` : ""}`,
      confirmText: itemReminder.type === "appointment" ? "Acknowledge" : "Complete"
    });
  }
}

function updateCountdownAlerts() {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    countdownAlertBanner.classList.add("is-hidden");
    return;
  }

  const now = new Date();
  const today = todayOffset(0);

  const upcomingEvents = [
    ...currentPatient.items.filter(item => ["appointment"].includes(item.type) && !item.done && item.date && item.time),
    ...currentPatient.procedures.filter(item => !item.done && item.date && item.time)
  ].map(item => {
    const [year, month, day] = item.date.split("-").map(Number);
    const [hour, minute] = item.time.split(":").map(Number);
    const eventDate = new Date(year, month - 1, day, hour, minute);
    return {
      title: item.title,
      type: item.type,
      dateTime: eventDate
    };
  }).filter(event => event.dateTime.getTime() > now.getTime()) // Only future events
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()); // Sort by soonest

  if (upcomingEvents.length > 0) {
    const nextEvent = upcomingEvents[0];
    const timeDiff = nextEvent.dateTime.getTime() - now.getTime();

    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      let countdownText = `${labelForType(nextEvent.type)} in: `;
      if (days > 0) countdownText += `${days}d `;
      if (hours > 0 || days > 0) countdownText += `${hours}h `;
      countdownText += `${minutes}m ${seconds}s`;

      countdownAlertText.textContent = countdownText;
      countdownAlertBanner.classList.remove("is-hidden");
    } else {
      countdownAlertBanner.classList.add("is-hidden");
    }
  } else {
    countdownAlertBanner.classList.add("is-hidden");
  }
}

function showReminder(reminder) {
  state.activeReminder = reminder;
  reminderType.textContent = reminder.type;
  reminderTitle.textContent = reminder.title;
  reminderDetails.textContent = reminder.details;
  confirmReminder.textContent = reminder.confirmText;
  reminderDialog.showModal();
}

function completeActiveReminder() {
  if (!state.activeReminder) {
    reminderDialog.close();
    return;
  }

  const currentPatient = getCurrentPatient();
  if (!currentPatient) {
    reminderDialog.close();
    return;
  }

  if (state.activeReminder.kind === "medicine-dose") {
    currentPatient.medicineLog[medicineDoseKey(state.activeReminder.slot)] = new Date().toISOString();
  } else {
    const item = currentPatient.items.find((candidate) => candidate.id === state.activeReminder.id);
    if (item && item.type !== "appointment") {
      item.done = true;
    } else {
      const procedure = currentPatient.procedures.find((candidate) => candidate.id === state.activeReminder.id);
      if (procedure) {
        procedure.done = true;
      }
    }
  }

  rememberReminder(state.activeReminder.id);
  state.activeReminder = null;
  saveGlobalState(); // Save entire state after item modification
  reminderDialog.close();
  render();
}

function dismissActiveReminder() {
  if (state.activeReminder) {
    snoozeReminder(state.activeReminder.id);
  }
  state.activeReminder = null;
  reminderDialog.close();
}

function rememberReminder(id) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) return;

  currentPatient.reminderLog[reminderLogKey(id)] = {
    status: "done",
    at: new Date().toISOString()
  };
  saveGlobalState();
}

function snoozeReminder(id) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) return;

  const until = new Date(Date.now() + 15 * 60 * 1000);
  currentPatient.reminderLog[reminderLogKey(id)] = {
    status: "snoozed",
    until: until.toISOString()
  };
  saveGlobalState();
}

function isReminderDismissed(id) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) return false;

  const entry = currentPatient.reminderLog[reminderLogKey(id)];
  if (!entry) {
    return false;
  }
  if (entry.status === "done") {
    return true;
  }
  if (entry.status === "snoozed") {
    return new Date(entry.until).getTime() > Date.now();
  }
  return false;
}

function reminderLogKey(id) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) return `no-patient:${todayOffset(0)}:${id}`; // Fallback if no patient
  return `${currentPatient.id}:${todayOffset(0)}:${id}`;
}

function medicineDoseKey(slot) {
  const currentPatient = getCurrentPatient();
  if (!currentPatient) return `no-patient:${todayOffset(0)}:${slot}`; // Fallback if no patient
  return `${currentPatient.id}:${todayOffset(0)}:${slot}`;
}

function openProfileDialog(isRequired, isNewPatient) {
  const currentPatient = getCurrentPatient();
  const profile = currentPatient?.profile;

  document.querySelector("#profileName").value = profile?.name || "";
  document.querySelector("#profileRelationship").value = profile?.relationship || "";
  document.querySelector("#profileFocus").value = profile?.focus || "";
  document.querySelector("#profileEmergencyName").value = profile?.emergencyName || "";
  document.querySelector("#profilePhoneRegion").value = profile?.phoneRegion || "+1";
  phonePrefix.textContent = document.querySelector("#profilePhoneRegion").value;
  document.querySelector("#profileEmergencyPhone").value = profile?.emergencyPhone || "";
  document.querySelector("#profileAge").value = profile?.age || "";
  document.querySelector("#profileBloodType").value = profile?.bloodType || ""; // New field
  document.querySelector("#profilePrimaryDoctorPhone").value = profile?.primaryDoctorPhone || ""; // New field
  document.querySelector("#profileMedicalConditions").value = profile?.medicalConditions || "";

  profileDialog.dataset.required = String(isRequired);
  profileDialog.dataset.isNewPatient = String(isNewPatient); // Store if it's a new patient
  profileDialog.showModal();
}

function closeProfileDialog() {
  // If required and no profile exists after trying to close a new patient dialog,
  // we might want to prevent closing or show a message.
  // For now, allow closing but the initial render will handle the empty state.
  profileDialog.close();
}

function todayOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value) {
  const [hour, minute] = value.split(":");
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2026, 0, 1, Number(hour), Number(minute)));
}

function formatPhone(profile) {
  if (!profile.emergencyPhone) {
    return "";
  }
  return `${profile.phoneRegion || "+1"} ${profile.emergencyPhone}`;
}

function isTimeDue(time) {
  const [hour, minute] = time.split(":").map(Number);
  const now = new Date();
  const due = new Date();
  due.setHours(hour || 0, minute || 0, 0, 0);
  return due.getTime() <= now.getTime();
}

function compareItemsBySchedule(a, b) {
  return `${a.date || "9999-12-31"} ${a.time || "23:59"}`.localeCompare(`${b.date || "9999-12-31"} ${b.time || "23:59"}`);
}

function statusItemText(item) {
  const dateText = item.date === todayOffset(0) ? "Today" : formatShortDate(item.date);
  const timeText = item.time ? `, ${formatTime(item.time)}` : "";
  return `${item.title} (${dateText}${timeText})`;
}

function doseStatusText(dose) {
  return `${dose.title} (Today, ${formatTime(dose.time)})`;
}

function nextMedicineDoseText(doses) {
  const nextDose = doses.find((dose) => !dose.done && !dose.isDue);
  return nextDose ? doseStatusText(nextDose) : "No upcoming care";
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "--";
  }
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function labelForType(type) {
  return {
    task: "Task",
    medicine: "Medicine",
    appointment: "Appointment",
    procedure: "Procedure", // New type
    note: "Note",
    contact: "Contact"
  }[type];
}

function pluralType(type) {
  return {
    task: "tasks",
    medicine: "medicine",
    appointment: "appointments",
    procedure: "procedures", // New type
    note: "notes",
    contact: "contacts"
  }[type];
}

function titleForView(view) {
  return {
    overview: "Overview",
    tasks: "Tasks",
    medicine: "Medicine",
    appointments: "Appointments",
    procedures: "Procedures & Surgeries", // New view title
    notes: "Notes",
    contacts: "Contacts"
  }[view];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Initial load logic
if (state.patients.length === 0) {
  openProfileDialog(true, true); // Required, and it's for a new patient
} else {
  // Ensure a current patient is selected if one exists but currentPatientId is null
  if (!state.currentPatientId && state.patients.length > 0) {
    state.currentPatientId = state.patients[0].id;
    saveGlobalState();
  }
  const currentPatient = getCurrentPatient();
  const initialView = currentPatient ? (currentPatient.view || "overview") : "overview";
  navigateToSection(initialView);
}

checkReminders();
updateCountdownAlerts(); // Initial call

// Replaced this block that was redundant or doing too much at once.
// The render function is called once by navigateToSection on initial load.
// Periodic updates for time-sensitive elements will be handled by setInterval.
setInterval(() => {
  if (getCurrentPatient()) { // Only update if a patient is active
    renderCareStatus();
    renderMetrics();
    renderMedicinePlan();
  }
  checkReminders();
  updateCountdownAlerts(); // Update countdowns in the global banner
}, 1000); // Check every second for countdown and more frequent reminders
