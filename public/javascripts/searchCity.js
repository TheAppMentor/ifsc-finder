        $("#findLocationSearchField.ui.search")
            .search({
                apiSettings: {
                    url: "/getLocationList/?bankName=" + $("#findBankSearchField.ui.search").data("selectedBank") + "&searchInput={query}"
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

                    $('html, body').animate({ scrollTop: $('#findBranchSegment').offset().top }, 'slow');
                    $("#findLocationSearchField.ui.search").data("selectedLocation",result.city)

                    var tag = document.createElement("script");
                    tag.src = "javascripts/searchBranches.js";
                    document.getElementsByTagName("head")[0].appendChild(tag);
                }
            });
