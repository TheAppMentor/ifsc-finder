$(document)
    .ready(function() {

        // fix menu when passed
        $('.masthead')
            .visibility({
                once: false,
                onBottomPassed: function() {
                    $('.fixed.menu').transition('fade in');
                },
                onBottomPassedReverse: function() {
                    $('.fixed.menu').transition('fade out');
                }
            });

        // create sidebar and attach to menu open
        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item');

        $('.ui.dropdown')
            .dropdown(
                {
                    action: 'hide',
                    placeholder : 'Fetching Bank Details',
                    onChange: function(value, text, $selectedItem) {
                        processFindBankDiv(text)
                    }                    
                })

        $("#findBankSearchField.ui.search")
            .search({
                type          : 'category',
                apiSettings: {
                    url: "/getBanks/?q={query}"
                },
                minCharacters : 1,
                onResponse : function(theresponse) {
                    console.log("The Response is " + theresponse)
                    return theresponse
                },
                fields: {
                    categories      : 'results',     // array of categories (category view)
                    categoryName    : 'name',        // name of category (category view)
                    categoryResults : 'results',     // array of results (category view)
                    description     : 'description', // result description
                    //image           : 'image',       // result image
                    //price           : 'price',       // result price
                    results         : 'results',     // array of results (standard)
                    title           : 'title',       // result title
                    action          : 'action',      // "view more" object name
                    //actionText      : 'text',        // "view more" text
                    //actionURL       : 'url'          // "view more" url
                },
                onSelect(result, response) {
                    console.log("Result is : " + JSON.stringify(result))
                    console.log("Response is : " + JSON.stringify(response))
                    console.log("Response is : " + result.title)
                        
                    let bankName = result.title

                    $("#findBankSearchField.ui.search").data("selectedBank",bankName)
                    updateDomForLocationSearch(bankName)

                    return response
                }
            });


        function updateDomForLocationSearch(bankName){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    var myObj = JSON.parse(this.responseText);
                    
                    // Insert New JS for city Search
                    var tag = document.createElement("script");
                    tag.src = "javascripts/searchCity.js";
                    document.getElementsByTagName("head")[0].appendChild(tag);

                    document.getElementById('findLocationSegment').outerHTML = myObj.div_locationSearch
                    document.getElementById('findLocationFindBranchGroupSeg').setAttribute("style", "display:block")
                    
                    //Scroll to the newly inserted segment
                    $('html, body').animate({ scrollTop: $('#findLocationSegment').offset().top }, 'slow');
                }
            }

            let finalPath = "/getDomForLocationSearch/?bankName=" + bankName 

            console.log("Final Path is ... : " + finalPath)

            xmlhttp.open("GET", finalPath, true);
            xmlhttp.send();
        }































        /*
        $("#findLocationSearchField.ui.search")
            .search({
                apiSettings: {
                    let selectedBank = $("#findBankSearchField.ui.search").data("selectedBank")
                    url: "/getLocationList/?bankName=" + selectedBank + "&searchInput={query}"
                },
                minCharacters : 1,
                onResponse : function(theresponse) {
                    console.log("The Response is " + theresponse)
                    return theresponse
                },
                fields: {
                    description     : 'state', // result description
                        //image           : 'image',       // result image
                        //price           : 'price',       // result price
                    results         : 'results',     // array of results (standard)
                    title           : 'city',       // result title
                    action          : 'action',      // "view more" object name
                        //actionText      : 'text',        // "view more" text
                        //actionURL       : 'url'          // "view more" url
                },
                onSelect(result, response) {
                    console.log("Result is : " + result)
                    console.log("Response is : " + response)
//findLocationsForBank(result)
                    return response
                }
            });

*/














jQuery(document).ready(function($) {
    var alterClass = function() {
        var ww = document.body.clientWidth;
        if (ww < 400) {
            $("#bankSearchField.ui.search")
                .removeClass("huge")
                .addClass("medium");
            $("#locationSearchField.ui.search")
                .removeClass("huge")
                .addClass("medium");
            $("#branchSearchField.ui.search")
                .removeClass("huge")
                .addClass("medium");
        } else if (ww >= 401) {
            $("#bankSearchField.ui.search")
                .addClass("huge")
                .removeClass("medium");

            $("#locationSearchField.ui.search")
                .addClass("huge")
                .removeClass("medium");

            $("#branchSearchField.ui.search")
                .addClass("huge")
                .removeClass("medium");
        }
    };
    $(window).resize(function() {
        alterClass();
    });
    //Fire it when the page first loads:
    alterClass();
});

});



function findLocationsForBank(selectedBankName){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            console.log("WE got back a locations list.... " + JSON.stringify(myObj))
        }                   
    }

    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getLocationList/?" + fullPath + '&bankName=' + selectedBankName //TODO Modify this to fetch bank name from the request header.
    console.log("Final Path is ... : " + finalPath)
    xmlhttp.open("GET", finalPath, true);
    //xmlhttp.setRequestHeader("bankName", selectedBankName)
    xmlhttp.send();

    $('html, body').animate({ scrollTop: $('#findLocationSegment').offset().top }, 'slow');
}



function processFindBankDiv(selectedBankName){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);

            //Generate Statistics talkg
            document.getElementById('steps-div').outerHTML = myObj.div_steps
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats
            document.getElementById('menuboy').outerHTML = myObj.div_dropdown  
            document.getElementById('findBank').id = "findCity"

            $('.ui.dropdown').dropdown()
            $('.ui.dropdown').removeClass("loading")
            $('.ui.dropdown').dropdown('setting','onChange',
                function(value, text, $selectedItem) {
                    if (this.id == "findCity"){
                        processFindCityDiv(xmlhttp.getResponseHeader("bankName"),text)
                    }
                }                    
            ); 
        }                   
    }

    $('.ui.dropdown').addClass("loading")
    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getLocations/?" + fullPath + '&bankName=' + selectedBankName //TODO Modify this to fetch bank name from the request header.

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.setRequestHeader("bankName", selectedBankName)
    xmlhttp.send();
}

function processFindCityDiv(selectedBankName,selectedCity){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('.ui.dropdown').removeClass("loading")

            var myObj = JSON.parse(this.responseText);

            document.getElementById('steps-div').outerHTML = myObj.div_steps
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats

            $('.ui.dropdown').replaceWith(myObj.div_dropdown)

            $('.ui.dropdown').dropdown({
                placeHolder:"Search Bank Branch",
                onChange: function(value, text, $selectedItem) {
                    let selectedBranch = text
                    let selectedBankName = xmlhttp.getResponseHeader("bankName")
                    let selectedLocationName = xmlhttp.getResponseHeader("cityName")
                    processFindBranchDiv(selectedBankName,selectedLocationName,selectedBranch)
                }                    
            }); 
        }                   
    }

    $('.ui.dropdown').addClass("loading")
    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getBranches/?" + fullPath + '&bankName=' + selectedBankName + '&cityName=' + selectedCity

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.setRequestHeader("bankName", selectedBankName)
    xmlhttp.setRequestHeader("cityName", selectedCity)
    xmlhttp.send();
}


function processFindBranchDiv(selectedBank,selectedCity,selectedBranch){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);

            //Generate Statistics talkg
            document.getElementById('steps-div').innerHTML = myObj.div_steps
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats

            // Final results modal
            document.getElementById('modal-finalResult').innerHTML = myObj.div_modal 

            new ClipboardJS('#button-copy-ifsc');

            $('.ui.dropdown').removeClass("loading")
            $('html, body').animate({ scrollTop: $('#statistics-segment').offset().top }, 'slow');

            $('.ui.modal').modal({
                // Set Properites of the modal here.
                //blurring: true 
                //inverted: true
            })
                .modal('show')
            ;
        }                   
    }

    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getBranchDetails/?" + fullPath + '&bankName=' + selectedBank + '&cityName=' + selectedCity + "&branchName=" + selectedBranch 

    $('.ui.dropdown').addClass("loading")
    xmlhttp.open("GET", finalPath, true);
    xmlhttp.setRequestHeader("bankName", selectedBank)
    xmlhttp.setRequestHeader("cityName", selectedCity)
    xmlhttp.setRequestHeader("branchName", selectedBranch)

    xmlhttp.send();
}


function fetchAllBankNames(){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            console.log("Got back JSON object.. " + JSON.stringify(myObj)) 
            console.log("Cat Bef " + categoryContent1) 
            categoryContent1 = myObj
            //return myObj 
            console.log("Cat aft" + categoryContent1) 
        }
    }
    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getBanks/"

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.send();
}
