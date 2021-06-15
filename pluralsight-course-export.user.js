// ==UserScript==
// @name            PluralsightCourseExport
// @namespace       https://www.pluralsight.com/
// @version         2.0.0.0
// @description     Download a full course list including level and duration from the browse or author page
// @author          Tim Huettemeister
// @include         https://www.pluralsight.com/authors/*
// @include         https://www.pluralsight.com/browse
// @updateURL       https://github.com/timmes/tampermonkey-scripts/pluralsight-course-export.user.js
// @downloadURL     https://github.com/timmes/tampermonkey-scripts/pluralsight-course-export.user.js
// ==/UserScript==

/*
REVISION HISTORY:
1.0 - 2021-06-14 - Initial version published.
2.0 - 2021-06-15 - Included functionality for the browse page.
*/

(function() {
    'use strict';

    if (document.getElementById("btnDownloadPSCourseList")) {
        // button already on the page
        return;
    }

    // Create button on page somewhere in the top right
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
        var filename = "";
        
        // URL is https://www.pluralsight.com/browse/
        if (window.location.href.indexOf("browse") > -1)
        {
            var searchResultsList = document.getElementsByClassName('browse-search-results-list')[0];
            var searchResultsItems = searchResultsList.getElementsByTagName('li');
            
            for (var i = 0; i < searchResultsItems.length; i++) {

                var searchResultsElem = searchResultsItems[i].getElementsByTagName("a");
                if(searchResultsElem.length >= 1 )
                {
                    var courseElemLink = searchResultsElem[0].href;
                    var courseElemName = searchResultsElem[0].getElementsByTagName('h3')[0].innerText;
                    var courseElemAuthor = searchResultsElem[0].getElementsByTagName('h4')[0].innerText;
                    var courseElemLevel = searchResultsElem[0].getElementsByClassName('level')[0].innerText;
                    var courseElemDuration = searchResultsElem[0].getElementsByClassName('duration')[0].innerText;

                    csvContent += courseElemName.replaceAll(","," ") + "," + courseElemAuthor.replaceAll("by ","") + "," + courseElemLevel + "," + courseElemDuration + "," + courseElemLink + "\r\n";
                }
            }

            var topic = document.getElementsByClassName('browse-search-form-text')[0].value;
            filename = "pluralsight_courses_by_topic_" + author + ".csv";
        }
        // https://www.pluralsight.com/authors/
        if (window.location.href.indexOf("authors") > -1)
        {
            var divAuthorCourses = document.getElementsByClassName('author__courses')[0];
            var courseList = divAuthorCourses.getElementsByTagName('ul')[0];
            var courseItems = courseList.getElementsByTagName('li');

            for (var j = 0; j < courseItems.length; j++) {

                var courseElem = courseItems[j].getElementsByTagName("a");
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
            filename = "pluralsight_courses_by_" + author + ".csv";
        }        

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link); // Required for FF

        // Fire click event to download the csv
        link.click();
    }

})();