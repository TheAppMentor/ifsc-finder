        $("#findLocationSearchField.ui.search")
            .search({
                apiSettings: {
                    url: "/getLocationList/?bankName=" + $("#findBankSearchField.ui.search").data("selectedBank") + "&searchInput={query}"
                },
                selectFirstResult : true,
                fullTextSearch: true,
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

                    let selectedLocation = result.city 
                    let selectedBank = $("#findBankSearchField.ui.search").data("selectedBank")

                    $("#findLocationSearchField.ui.search").data("selectedLocation",selectedLocation)
                    updateDomForBranchSearch(selectedBank,selectedLocation)
                }
            });



        function updateDomForBranchSearch(bankName,locationName){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    var myObj = JSON.parse(this.responseText);
                    
                    // Insert New JS for city Search
                    var tag = document.createElement("script");
                    tag.src = "javascripts/searchBranches.js";
                    document.getElementsByTagName("head")[0].appendChild(tag);

                    document.getElementById('findBranchSegment').outerHTML = myObj.div_branchSearch
                    document.getElementById('infoDivShowingBranchSearch').outerHTML = myObj.div_info
                    
                    //Scroll to the newly inserted segment
                    $('html, body').animate({ scrollTop: $('#divider_findBranch').offset().top }, 'slow');
                }
            }

            let finalPath = "/getDomForBranchSearch/?bankName=" + bankName + "&locationName=" + locationName  

            console.log("Final Path is ... : " + finalPath)

            xmlhttp.open("GET", finalPath, true);
            xmlhttp.send();
        }
