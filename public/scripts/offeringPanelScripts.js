// Offering scripts for pages that use panels instead of tables to display it

function showCourses(dropdown, offeringType, sections, editOptions) {
  // Determine the semester selected
  semesterSelectedId = dropdown.attr("id");
  // Get rid of offerings displayed
  removeCoursesAlreadyShown();

  if (semesterSelectedId !== "allCourses") {
    // Determine which semester is selected
    semesterSelected = semesterSelectedId.replace("semester", "");

    // Retrieve the offerings
    // Get offerings that student is taking
    if (offeringType.isUserOffering) {
      retrieveOfferingsForSemesterAndUser(
        semesterSelected,
        sections,
        editOptions.userOffering,
        offeringType
      );
    }
    if (offeringType.isNotUserOffering) {
      retrieveOfferingsNotForUser(
        semesterSelected,
        sections,
        editOptions.userOffering,
        offeringType
      );
    }
    // Get the available offerings
    if (offeringType.isSemesterOffering) {
      retrieveOfferingsForSemester(
        semesterSelected,
        sections,
        editOptions.semesterOffering,
        offeringType
      );
    }
  } else {
    // Retrieve courses if 'All Courses' option selected
    retrieveCourses();
  }
}

function removeCoursesAlreadyShown() {
  $("div#courses").empty();
}

// Get courses offered for a given semester from database using AJAX
function retrieveOfferingsForSemester(
  semesterId,
  sections,
  editOptions,
  offeringType
) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create offerings object
      var offerings = JSON.parse(xhr.responseText);
      // Add offerings to correct section
      var sectionId = sections.availableOfferings;
      addOfferingsToSection(offerings, sectionId, editOptions, offeringType);
    }
  };
  xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
  xhr.send();
}

// Create a panel for each offering in offerings
function addOfferingsToSection(
  offerings,
  sectionId,
  editOptions,
  offeringType
) {
  if (offerings.length > 0) {
    // Access the section
    var section = $(`#${sectionId}`);
    var i;
    var offering;
    // Loop through offerings retrieved
    for (i = 0; i < offerings.length; i++) {
      offering = offerings[i];
      // Create a panel to represent the offering
      createOfferingPanel(offering, section, editOptions, offeringType);
    }
  }
}

// Function to create an offering panel and show it
function createOfferingPanel(offering, section, editOptions, offeringType) {
  // Determine the ID for the offering row
  var id =
    editOptions.type === "studentSchedule"
      ? offering.registrationId
      : offering.offeringId;

  // Determine the color of the panel
  // Show offering is filled by making it red
  var bodyColor;
  var headingColor;
  if (offering.capacity <= offering.numberFilled) {
    bodyColor = "bg-danger";
    headingColor = "panel-heading-red";
  }
  // Show offering is almost full by making it yellow
  else if (offering.capacity - 5 <= offering.numberFilled) {
    bodyColor = "bg-warning";
    headingColor = "panel-heading-yellow";
  }
  // Show offering has room by making it green
  else {
    bodyColor = "bg-success";
    headingColor = "panel-heading-green";
  }
  // Create panel for offering
  var offeringOutput = `<div class='panel panel-default ${editOptions.type}${id}'>`;
  offeringOutput += `<div class="panel-heading ${headingColor}">${offering.deptCode} ${offering.courseNumber}: ${offering.name} (${offering.credits} credits)</div>`;
  offeringOutput += `<div class="panel-body ${bodyColor}">
    <p><span class="offeringLabel">Instructor:</span> ${offering.prof}</p>
    <p><span class="offeringLabel">Meeting Times:</span> ${offering.days} ${offering.time}</p>
    <p><span class="offeringLabel">Location:</span> ${offering.building} ${offering.room}</p>`;
  offeringOutput += `</div`;
  offeringOutput += `<div class="panel-footer">`;

  // Show capacity and seats filled if course is shown as available and not for specific student
  if (offeringType.isSemesterOffering || offeringType.isNotUserOffering) {
    offeringOutput += `<p class="rightAlign">${offering.numberFilled} seat(s) filled out of ${offering.capacity} </p>`;
  }

  // Show add and delete icons if they are appropriate
  if (editOptions.delete) {
    offeringOutput +=
      "<span class='deleteOffering glyphicon glyphicon-trash'></span>";
  }
  // Can't add course if already full
  else if (
    editOptions.add &&
    !(
      offeringType.isSemesterOffering &&
      offering.capacity == offering.numberFilled
    )
  ) {
    offeringOutput +=
      "<span class='addOffering glyphicon glyphicon-plus'></span>";
  }
  offeringOutput += `</div>`;
  // Add the panel to section
  section.append(offeringOutput);
}
