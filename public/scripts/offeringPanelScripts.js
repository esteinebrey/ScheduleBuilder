// Offering scripts for pages that use panels instead of tables to display it

function showCourses(dropdown, offeringType, sections, editOptions) {
  console.log("show courses");
  console.log(dropdown);
  semesterSelectedId = dropdown.attr("id");
  console.log(semesterSelectedId);
  if (semesterSelectedId !== "courses") {
    // Get rid of offerings displayed
    removeCoursesAlreadyShown();

    // Determine which semester is selected
    semesterSelected = semesterSelectedId.replace("semester", "");

    // Retrieve the offerings
    // Get offerings that student is taking
    if (offeringType.isUserOffering) {
      retrieveOfferingsForSemesterAndUser(
        semesterSelected,
        tables,
        editOptions.userOffering,
        offeringType
      );
    }
    if (offeringType.isNotUserOffering) {
      retrieveOfferingsNotForUser(
        semesterSelected,
        tables,
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
    // retrieve courses
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
      // Add offerings to correct table
      console.log(sections.availableOfferings);
      var sectionId = sections.availableOfferings;
      addOfferingsToTable(offerings, sectionId, editOptions, offeringType);
    }
  };
  xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
  xhr.send();
}

// Create a row for each offering in offerings
function addOfferingsToTable(offerings, sectionId, editOptions, offeringType) {
  if (offerings.length > 0) {
    // Access the table
    console.log("section id");
    console.log(sectionId);
    var section = $(`#${sectionId}`);
    var i;
    var offering;
    // Loop through offerings retrieved
    for (i = 0; i < offerings.length; i++) {
      offering = offerings[i];
      // Create a row and add it to the table specified
      createOfferingPanel(offering, section, editOptions, offeringType);
    }
  }
}

// Function to create row in offerings table
function createOfferingPanel(offering, section, editOptions, offeringType) {
    console.log("create offering panel");
  // Determine the ID for the offering row
  var id =
    editOptions.type === "studentSchedule"
      ? offering.registrationId
      : offering.offeringId;
  var offeringOutput = `<div class='panel panel-default ${editOptions.type}${id}'>`;
  offeringOutput += `<div class="panel-heading">${offering.deptCode} ${offering.courseNumber}: ${offering.name}</div>`;
  offeringOutput += `<div class="panel-body">
    <p>Professor ${offering.prof}</p>
    <p>${offering.credits} credits</p>
    <p>${offering.days} ${offering.time}</p>
    <p>${offering.building} ${offering.room}</p>`;
    offeringOutput += `</div`;
    offeringOutput += `<div class="panel-footer">`;

  // Show capacity and seats filled if course is shown as available and not for specific student
  if (offeringType.isSemesterOffering || offeringType.isNotUserOffering) {
    offeringOutput += `<p>${offering.numberFilled} seat(s) filled out of ${offering.capacity} </p>`;
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
  console.log(section);
  console.log(offeringOutput);

  // Add the row to the table
  section.append(offeringOutput);
}
