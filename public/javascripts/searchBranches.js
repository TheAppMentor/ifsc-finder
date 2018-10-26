$("#findBranchSearchField.ui.search")
    .search({
        apiSettings: {
            url: "/getBranchList/?bankName=" + $("#findBankSearchField.ui.search").data("selectedBank") + "&locationName=" + $("#findLocationSearchField.ui.search").data("selectedLocation") +  "&searchInput={query}"
        },
        minCharacters : 0,
        onResponse : function(theresponse) {
            console.log("The Response is " + theresponse)
            return theresponse
        },
        fields: {
            description     : 'address', // result description
            //image           : 'image',       // result image
            //price           : 'price',       // result price
            results         : 'results',     // array of results (standard)
            title           : 'branch',       // result title
            action          : 'action',      // "view more" object name
            //actionText      : 'text',        // "view more" text
            //actionURL       : 'url'          // "view more" url
        },
        onSelect(result, response) {
            console.log("Find Branch Result is : " + JSON.stringify(result))
            console.log("Find Response is : " + JSON.stringify(response))
            //findLocationsForBank(result)

            //$("#findLocationSearchField.ui.search").data("selectedLocation",result.title)

            //var tag = document.createElement("script");
            //tag.src = "javascripts/searchBranches.js";
            //document.getElementsByTagName("head")[0].appendChild(tag);
            
            
            return response
        }
    });
