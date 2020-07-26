// Contains functions that use AJAX to get back offerings, and add offering info to tables

// Get courses taken for specific student for specific semester using AJAX
function retrieveOfferingsForSemesterAndUser(semesterId) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Create offerings object
        var offerings = JSON.parse(xhr.responseText);
        // Add to table
        var tableId = "offeringTable";
        var options = {delete: true, add: false, type: "studentSchedule"};
        addOfferingsToTable(offerings, tableId, options);
      }
    };
    xhr.open("GET", "/getStudentCoursesBySemester/" + semesterId, true);
    xhr.send();
  }

  // Get courses offered for a given semester from database using AJAX
  function retrieveOfferingsForSemester(semesterId) {
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            // Create offerings object
            var offerings = JSON.parse(xhr.responseText);
            // Add offerings to table with specified ID
            var tableId = "offeringOptionsTable";
            var options = {delete: false, add: true, type: "coursesOffered"};
            addOfferingsToTable(offerings, tableId, options);
          }
        };
        xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
        xhr.send();
  }

    // Create a row for each offering in offerings
    function addOfferingsToTable(offerings, tableId, options) {
        if (offerings.length > 0) {
            // Access the table
            var table = $(`#${tableId}`);
            var i;
            var offering;
            // Loop through offerings retrieved
            for (i = 0; i < offerings.length; i++) {
              offering = offerings[i];
              // Create a row and add it to the table specified
              createOfferingRow(offering, table, options);
            }
          }
      }

  // Used to create row in offerings table
  function createOfferingRow(offering, table, options) {
    // Create the row and make each cell of the row
    var id = options.type === "studentSchedule" ? offering.registrationId : offering.offeringId;
    var offeringOutput = `<tr class='${options.type}${id}'>`;
    offeringOutput += `<td id='name${id}'>${offering.name}</td>`;
    offeringOutput += `<td id='code${id}'>${offering.deptCode} ${offering.courseNumber}</td>`;
    offeringOutput += `<td id='prof${id}'>${offering.prof}</td>`;
    offeringOutput += `<td id='credits${id}'>${offering.credits}</td>`;
    offeringOutput += `<td id='days${id}'>${offering.days}</td>`;
    offeringOutput += `<td id='time${id}'>${offering.time}</td>`;
    offeringOutput += `<td id='location${id}'>${offering.building} ${offering.room}</td>`;
    if (options.delete) {
        offeringOutput += "<td><span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
    }
    else {
        offeringOutput += "<td><span class='addOffering glyphicon glyphicon-plus'></span> </td>";
    }
    offeringOutput += "</tr>";

    // Add the row to the table
    table.append(offeringOutput);
}
