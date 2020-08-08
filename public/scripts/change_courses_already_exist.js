var isCourseTableShown = false;

    function determineTableShown() {
      isCourseTableShown = !isCourseTableShown;
      var offeringDisplay = isCourseTableShown ? "none" : "table";
      var courseDisplay = isCourseTableShown ? "table" : "none";
      $("#offeringTable").css("display", offeringDisplay);
      $("#courseTable").css("display", courseDisplay);
    }

    function setUpDropdown() {
      var dropdown = $("#semesterDropdown");
      dropdown.append(
        '<option value="-1" selected>' + "All Courses" + "</option>"
      );
    }

    function showCorrectTable(obj) {
      // console.log(obj.selectedIndex);
      // var dropdown = $("#semesterDropdown");
      // console.log(obj.options[obj.selectedIndex]);
      var semesterSelected = obj.options[obj.selectedIndex].value;
      if (semesterSelected == -1 && !isCourseTableShown) {
        determineTableShown();
      } else if (isCourseTableShown) {
        determineTableShown();
      }
    }

    function retrieveCourses() {
      // Create XMLHttpRequest
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // Create JSON object
          var obj = JSON.parse(xhr.responseText);
          if (obj.length > 0) {
            // Access the table
            var table = $("#courseTable");
            var i;
            var courseInfo;
            for (i = 0; i < obj.length; i++) {
              courseInfo = obj[i];
              // For each contact, create a row and add it to the table
              createRow(courseInfo, table);
            }
          }
        }
      };
      xhr.open("GET", "getAllCourses", true);
      xhr.send();
    }

    // Add the contact info to the table as a row
    function createRow(courseInfo, table) {
      // Create the row and make each cell of the row
      var courseOutput = `<tr id='row${courseInfo.courseId}'>`;
      courseOutput += `<td id='name${courseInfo.courseId}'>${courseInfo.name}</td>`;
      courseOutput += `<td id='deptCode${courseInfo.courseId}'>${courseInfo.deptCode}</td>`;
      courseOutput += `<td id='number${courseInfo.courseId}'>${courseInfo.courseNumber}</td>`;
      courseOutput += `<td id='credits${courseInfo.courseId}'>${courseInfo.credits}</td>`;
      courseOutput += `<td id='desc${courseInfo.courseId}'>${courseInfo.description}</td>`;
      courseOutput +=
        "<td><span class='addOffering glyphicon glyphicon-plus'></span><span class='editCourse glyphicon glyphicon-pencil'></span> <span class='deleteCourse glyphicon glyphicon-trash'></span> </td>";
      courseOutput += "</tr>";

      // Add the row to the table
      table.append(courseOutput);
    }

    function removeOfferingsAlreadyShown() {
      $("#offeringTable tbody tr").remove();
    }

    // Used to update table when semester from dropdown is changed
    function onSelect(obj, isforSpecificUser) {
      var semesterSelected = obj.options[obj.selectedIndex].value;
      if (semesterSelected !== -1) {
        removeOfferingsAlreadyShown();
        if (isforSpecificUser) {
          $("option#defaultOption").css("display", "none");
          retrieveOfferingsForSemesterAndUser(semesterSelected);
        } else {
          retrieveOfferingsForSemester(semesterSelected);
        }
      }
    }

    function retrieveOfferingsForSemesterAndUser(semesterId) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // Create JSON object
          var obj = JSON.parse(xhr.responseText);
          console.log(obj);
          getOfferingInfo(obj);
        }
      };
      xhr.open("GET", "/getStudentCoursesBySemester/" + semesterId, true);
      xhr.send();
    }

    function retrieveOfferingsForSemester(semesterId) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
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
      xhr.onreadystatechange = function () {
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
          // For each contact, create a row and add it to the table
          createOfferingRow(offeringInfo, table);
        }
      }
    }

    // Used to create row in offerings table
    function createOfferingRow(offeringInfo, table) {
      // Create the row and make each cell of the row
      var offeringOutput = `<tr id='row${offeringInfo.offeringId}'>`;
      offeringOutput += `<td id='name${offeringInfo.offeringId}'>${offeringInfo.name}</td>`;
      offeringOutput += `<td id='code${offeringInfo.offeringId}'>${offeringInfo.deptCode}</td>`;
      offeringOutput += `<td id='code${offeringInfo.offeringId}'>${offeringInfo.courseNumber}</td>`;
      offeringOutput += `<td id='prof${offeringInfo.offeringId}'>${offeringInfo.prof}</td>`;
      offeringOutput += `<td id='credits${offeringInfo.offeringId}'>${offeringInfo.credits}</td>`;
      offeringOutput += `<td id='days${offeringInfo.offeringId}'>${offeringInfo.days}</td>`;
      offeringOutput += `<td id='time${offeringInfo.offeringId}'>${offeringInfo.time}</td>`;
      offeringOutput += `<td id='building${offeringInfo.offeringId}'>${offeringInfo.building}</td>`;
      offeringOutput += `<td id='room${offeringInfo.offeringId}'>${offeringInfo.room}</td>`;
      offeringOutput +=
        "<td> <span class='editOffering glyphicon glyphicon-pencil'></span> <span class='deleteOffering glyphicon glyphicon-trash'></span> </td>";
      offeringOutput += "</tr>";

      // Add the row to the table
      table.append(offeringOutput);
    }