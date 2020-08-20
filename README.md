# Schedule Builder

## Basic Overview

Schedule Builder is an application that students can use to create their schedule by viewing the courses offered, adding classes, dropping classes, and viewing past schedules. It is also used by administrators to modify, add, and delete courses and to change which users can log into Schedule Builder.

## Terminology

    - Semester: A time period where students can register for classes.

    - Course: A class that has a name, department code, number, credit number, and description. A course does not pertain to any specific semester.

    - Course Offering: A course that pertains to a specific semester that also has the location, professor, capacity, and time.

## Types of Users

<table>
    <tr>
        <th>User Type</th>
        <th>Accessible Pages</th>
    </tr>
    <tr>
        <td>Admin User</td>
        <td>Admin, Course Maintenance, View Courses</td>
    </tr>
    <tr>
        <td>Student User</td>
        <td>Schedule, Build Schedule, View Courses</td>
    </tr>
</table>

## Page Overview

<table>
    <tr>
        <th>Page Name</th>
        <th>User</th>
        <th>Purpose</th>
    </tr>
    <tr>
        <td>Home</td>
        <td>anyone</td>
        <td>Welcome to Schedule Builder</td>
    </tr>
    <tr>
        <td>Login</td>
        <td>anyone</td>
        <td>Enter username and password to log in</td>
    </tr>
    <tr>
        <td>Admin</td>
        <td>admin</td>
        <td>Add, delete, and edit users who can access Schedule Builder</td>
    </tr>
    <tr>
        <td>Course Maintenance</td>
        <td>admin</td>
        <td>Add, delete, and edit semesters, courses, and course offerings</td>
    </tr>
    <tr>
        <td>Schedule</td>
        <td>student</td>
        <td>View specific student's past and current schedules</td>
    </tr>
    <tr>
        <td>Build Schedule</td>
        <td>student</td>
        <td>Add and drop classes for student</td>
    </tr>
    <tr>
        <td>View Courses</td>
        <td>admin, student</td>
        <td>View courses and course offerings</td>
    </tr>
</table>

## Pages

### Home Page

<img src="pageDisplay/homePage.PNG" />

### Login Page

<img src="pageDisplay/loginPage.PNG" />

### Admin Page

<img src="pageDisplay/adminPage.PNG" />

### Course Maintenance Page

<img src="pageDisplay/courseMaintenancePage_modifyCourses.PNG" />
<img src="pageDisplay/courseMaintenancePage_modifySemesters.PNG" />

### Schedule Page

<img src="pageDisplay/schedulePage.PNG" />

### Build Schedule Page

<img src="pageDisplay/buildSchedulePage_dropClasses.PNG" />
<img src="pageDisplay/buildSchedulePage_addClasses.PNG" />

### View Courses Page

<img src="pageDisplay/viewCoursesPage.PNG" />

## Scripts

<table>
    <tr>
        <th>File</th>
        <th>Pages Used</th>
        <th>Purpose</th>
    </tr>
    <tr>
        <td>adminScripts.js</td>
        <td>Admin</td>
        <td>
            <ul>
                <li>Getting and displaying user information</li> 
                <li>Using modals to add, edit, and delete users</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>buildScheduleScripts.js</td>
        <td>Build Schedule</td>
        <td>
            <ul>
                <li>Deleting and adding classes</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>courseModalScripts.js</td>
        <td>Course Maintenance: Modify Courses Tab</td>
        <td>
            <ul>
                <li>Edit and add courses with modal</li> 
                <li>Delete courses</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>coursePanelScripts.js</td>
        <td>View Courses</td>
        <td>
            <ul>
                <li>Retrieve and display courses using Bootstrap panels</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>courseTableScripts.js</td>
        <td>Course Maintenance</td>
        <td>
            <ul>
                <li>Retrieve and display courses in a table format</li> 
                <li>Switch between showing offering table and course table</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>filterScripts.js</td>
        <td>Admin, Build Schedule, Course Maintenance, View Courses</td>
        <td>
            <ul>
                <li>Filter courses, offerings, semesters, or users based on what is searched for</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>navigationBarScripts.js</td>
        <td>Admin, Build Schedule, Course Maintenance, Schedule, View Courses</td>
        <td>
            <ul>
                <li>Show the right options in navigation bar based on type of user</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>offeringModalScripts.js</td>
        <td>Course Maintenance: Modify Courses Tab</td>
        <td>
            <ul>
                <li>Edit and add course offerings with modal</li> 
                <li>Delete course offerings</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>offeringPanelScripts.js</td>
        <td>Build Schedule, Schedule, View Courses</td>
        <td>
            <ul>
                <li>Retrieve and display offerings using Bootstrap panels</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>offeringTableScripts.js</td>
        <td>Course Maintenance</td>
        <td>
            <ul>
                <li>Retrieve and display offerings in a table format</li> 
            </ul>
        </td>
    </tr>
    <tr>
        <td>semesterDropdownTableScripts.js</td>
        <td>Build Schedule, Course Maintenance, Schedule, View Courses</td>
        <td>
            <ul>
                <li>Retrieve and display semesters in a dropdown</li> 
                <li>Update dropdown when an option is selected</li> 
                <li>Retrieve and display semesters in a table format for Course Maintenance</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>semesterModalScripts.js</td>
        <td>Course Maintenance: Modify Semesters Tab</td>
        <td>
            <ul>
                <li>Edit and add semesters with modal</li> 
                <li>Delete semesters</li>
            </ul>
        </td>
    </tr>
</table>

## Styles

## Database