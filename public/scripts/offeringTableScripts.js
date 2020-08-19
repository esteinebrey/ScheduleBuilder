// File that contains functions to retrieve offerings and shows offerings in tables

// Find the corresponding offerings to the option selected in the dropdown
function onSelect(semesterSelected, offeringType, tables, editOptions) {
  if (semesterSelected !== 'allCourses') {
    // Get rid of offerings displayed
    removeOfferingsAlreadyShown();
    // Get the available offerings
    if (offeringType.isSemesterOffering) {
      retrieveOfferingsForSemester(
        semesterSelected,
        tables,
        editOptions.semesterOffering,
        offeringType
      );
    }
  }
}

// Function so that offerings previously selected are no longer shown
function removeOfferingsAlreadyShown() {
  $("#offeringTable tbody tr").remove();
}

// Get courses offered for a given semester from database using AJAX
function retrieveOfferingsForSemester(semester, tables, editOptions, offeringType) {
  semesterId = semester.replace("semester", "");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Create offerings object
      var offerings = JSON.parse(xhr.responseText);
      // Add offerings to correct table
      var tableId = tables.availableOfferingTable;
      addOfferingsToTable(offerings, tableId, editOptions, offeringType);
    }
  };
  xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
  xhr.send();
}

// Create a row for each offering in offerings
function addOfferingsToTable(offerings, tableId, editOptions, offeringType) {
  if (offerings.length > 0) {
    // Access the table
    var table = $(`#${tableId}`);
    var i;
    var offering;
    // Loop through offerings retrieved
    for (i = 0; i < offerings.length; i++) {
      offering = offerings[i];
      // Create a row and add it to the table specified
      createOfferingRow(offering, table, editOptions, offeringType);
    }
  }
}

// Function to create row in offerings table
function createOfferingRow(offering, table, editOptions, offeringType) {
  // Determine the ID for the offering row
  var id =
    editOptions.type === "studentSchedule"
      ? offering.registrationId
      : offering.offeringId;
  var offeringOutput = `<tr class='${editOptions.type}${id}'>`;
  offeringOutput += `<td id='name${id}'>${offering.name}</td>`;

  // Separate out the department code and course number if offering can be edited
  if (editOptions.edit) {
    offeringOutput += `<td id='code${id}'>${offering.deptCode}</td>`;
    offeringOutput += `<td id='code${id}'>${offering.courseNumber}</td>`;
  }
  // Otherwise combine them
  else {
    offeringOutput += `<td id='code${id}'>${offering.deptCode} ${offering.courseNumber}</td>`;
  }

  offeringOutput += `<td id='prof${id}'>${offering.prof}</td>`;
  offeringOutput += `<td id='credits${id}'>${offering.credits}</td>`;
  offeringOutput += `<td id='days${id}'>${offering.days}</td>`;
  offeringOutput += `<td id='time${id}'>${offering.time}</td>`;

  // Separate out building and room if row can be edited
  if (editOptions.edit) {
    offeringOutput += `<td id='building${id}'>${offering.building}</td>`;
    offeringOutput += `<td id='room${id}'>${offering.room}</td>`;
  }
  // Otherwise combine them
  else {
    offeringOutput += `<td id='location${id}'>${offering.building} ${offering.room}</td>`;
  }

   // Show capacity and sears filled if course is shown as available and not for specific student
   if (offeringType.isSemesterOffering || offeringType.isNotUserOffering) {
    offeringOutput += `<td id='capacity${id}'>${offering.capacity}</td>`;
    // Can't edit number of seats filled
    if (!editOptions.edit) {
      offeringOutput += `<td id='numberFilled${id}'>${offering.numberFilled}</td>`;
    }
  }

  // Show add, edit, and delete icons if they are appropriate
  if (editOptions.delete && editOptions.edit) {
    offeringOutput +=
      "<td> <span class='editOffering glyphicon glyphicon-pencil'></span> <span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
  } else if (editOptions.delete) {
    offeringOutput +=
      "<td><span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
  } 
  // Can't add course if already full
  else if (editOptions.add && !(offeringType.isSemesterOffering && offering.capacity == offering.numberFilled)) {
    offeringOutput +=
      "<td><span class='addOffering glyphicon glyphicon-plus'></span> </td>";
  }
  else if (editOptions.add && (offeringType.isSemesterOffering && offering.capacity == offering.numberFilled)) {
    offeringOutput += "<td></td>";
  }
  offeringOutput += "</tr>";

  // Add the row to the table
  table.append(offeringOutput);
}
