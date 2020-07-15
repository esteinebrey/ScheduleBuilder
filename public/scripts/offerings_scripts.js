
function removeOfferingsAlreadyShown() {
  $("#offeringTable tbody tr").remove();
}

// Used to update table when semester from dropdown is changed
function onSelect(obj, isforSpecificUser) {
    // console.log(obj.selectedIndex);
    // var dropdown = $("#semesterDropdown");
    // console.log(obj.options[obj.selectedIndex]);
    var semesterSelected = obj.options[obj.selectedIndex].value;
    if (semesterSelected !== -1) {
      removeOfferingsAlreadyShown();
      if (isforSpecificUser) {
        retrieveOfferingsForSemesterAndUser(semesterSelected);
      }
      else {
        retrieveOfferingsForSemester(semesterSelected);
      }
      
    }
  }

  function retrieveOfferingsForSemesterAndUser(semesterId) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Create JSON object
        var obj = JSON.parse(xhr.responseText);
        getOfferingInfo(obj);
      }
    };
    xhr.open("GET", "/getStudentCoursesBySemester/" + semesterId, true);
    xhr.send();
  }

  function retrieveOfferingsForSemester(semesterId) {
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            // Create JSON object
            var obj = JSON.parse(xhr.responseText);
            getOfferingInfo(obj);
          }
        };
        xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
        xhr.send();
  }

  // Used to get offerings in database to show in table based on semester
  function retrieveOfferingsForSemester(semesterId) {
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            // Create JSON object
            var obj = JSON.parse(xhr.responseText);
            getOfferingInfo(obj);
          }
        };
        xhr.open("GET", "/getCoursesBySemester/" + semesterId, true);
        xhr.send();
  }

  function getOfferingInfo(obj) {
    if (obj.length > 0) {
        // Access the table
        var table = $("#offeringTable");
        var i;
        var offeringInfo;
        for (i = 0; i < obj.length; i++) {
          offeringInfo = obj[i];
          console.log(offeringInfo);
          // For each contact, create a row and add it to the table
          createOfferingRow(offeringInfo, table);
        }
      }
  }

  // Used to create row in offerings table
  function createOfferingRow(offeringInfo, table) {
        // Create the row and make each cell of the row
        var offeringOutput = "<tr class='offeringRow'>";
        offeringOutput += "<td>" + offeringInfo.name + "</td>";
        offeringOutput += "<td>" + offeringInfo.deptCode + " " + offeringInfo.courseNumber + "</td>";
        offeringOutput += "<td>" + offeringInfo.prof + "</td>";
        offeringOutput += "<td>" + offeringInfo.credits + "</td>";
        offeringOutput += "<td>" + offeringInfo.days + "</td>";
        offeringOutput += "<td>" + offeringInfo.time + "</td>";
        offeringOutput += "<td>" + offeringInfo.building + " " + offeringInfo.room + "</td>";
        offeringOutput += "</tr>"

        // Add the row to the table
        table.append(offeringOutput);
  }

  // Used to get semesters to put in dropdown
  function retrieveSemesters() {
    // Create XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Create JSON object
        var obj = JSON.parse(xhr.responseText);
        if (obj.length > 0) {
          // Access the table
          var dropdown = $("#semesterDropdown");
          dropdown.append('<option value="-1" selected>' + "All Courses" + '</option>');
          var i;
          var semesterInfo;
          for (i = 0; i < obj.length; i++) {
            semesterInfo = obj[i];
            console.log(semesterInfo);
            // For each contact, create a row and add it to the table
            addToSemesterDropdown(semesterInfo, dropdown);
          }
        }

      }
    };
    xhr.open("GET", "getSemesters", true);
    xhr.send();
}

// Used to get the semesters to show in dropdown
function addToSemesterDropdown(semesterInfo, dropdown) {
    var semesterOutput = "<option value='"+semesterInfo.semesterId +"'>";
    semesterOutput += semesterInfo.season + " " + semesterInfo.year;
    semesterOutput += "</option>"

    // Add the row to the table
    dropdown.append(semesterOutput);
}

