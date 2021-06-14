// ==UserScript==
// @name            PluralsightCourseExport
// @namespace       https://www.pluralsight.com/
// @version         1.0.0.0
// @description     Download a full course list including level and duration of a specific author
// @author          timhutte@
// @include         https://www.pluralsight.com/authors/*
// @story           It all started with one request from @pndjs... 4/8/2021
// @updateURL       https://github.com/timmes/tampermonkey-scripts/pluralsight-course-export.user.js
// @downloadURL     https://github.com/timmes/tampermonkey-scripts/pluralsight-course-export.user.js
// ==/UserScript==

/*
REVISION HISTORY:
1.0 - 2021-06-14 - Initial version published.
*/

(function() {
    'use strict';

    if (document.getElementById("btnDownloadPSCourseList")) {
        // button already on the page
        return;
    }

    var btnDownload = document.createElement("button");
    btnDownload.style.position = "absolute";
    btnDownload.style.top = "100px";
    btnDownload.style.right = "100px";
    btnDownload.setAttribute("id", "btnDownloadPSCourseList");
    btnDownload.innerHTML = "Download Course List";
    btnDownload.onclick = downloadPSCourseCSV;

    document.body.appendChild(btnDownload);

    function downloadPSCourseCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";

        var divAuthorCourses = document.getElementsByClassName('author__courses')[0];
        var courseList = divAuthorCourses.getElementsByTagName('ul')[0];
        var courseItems = courseList.getElementsByTagName('li');

        for (var i = 0; i < courseItems.length; i++) {

            var courseElem = courseItems[i].getElementsByTagName("a");
            if(courseElem.length >= 1 )
            {
                var courseLink = courseElem[0].href;
                var courseType = courseElem[0].getElementsByClassName('title__type')[0].innerText;
                var courseName = courseElem[0].getElementsByClassName('title__course')[0].innerText;
                var courseLevel = courseElem[0].getElementsByClassName('title__info')[0].getElementsByTagName('div')[0].innerText;
                var courseDuration = courseElem[0].getElementsByClassName('title__info')[0].getElementsByTagName('div')[1].innerText;
                var courseLastUpdated = courseElem[0].getElementsByClassName('title__info')[0].getElementsByTagName('div')[2].innerText;

                csvContent += courseName.replaceAll(","," ") + "," + courseType + "," + courseLevel + "," + courseDuration + "," + courseLastUpdated.replaceAll(","," ") + "," + courseLink + "\r\n";
            }
        }

        var author = document.getElementsByClassName('author__name')[0].getElementsByTagName('h1')[0].innerText;
        var filename = "pluralsight_courses_by_" + author + ".csv";

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link); // Required for FF

        // Fire click event to download the csv
        link.click();
    }

})();