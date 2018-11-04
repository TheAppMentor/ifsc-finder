$("#findBranchSearchField.ui.search")
    .search({
        apiSettings: {
            url: "/getBranchList/?bankName=" + $("#findBankSearchField.ui.search").data("selectedBank") + "&locationName=" + $("#findLocationSearchField.ui.search").data("selectedLocation") +  "&searchInput={query}"
        },
        selectFirstResult : true,
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


            $("#findBranchSearchField.ui.search").data("selectedBranch",result.branch)

            let bankName = $("#findBankSearchField.ui.search").data("selectedBank") 
            let locationName = $("#findLocationSearchField.ui.search").data("selectedLocation") 
            let branchName = $("#findBranchSearchField.ui.search").data("selectedBranch") 

            //Generate div for Results
            let results_div = getDivFinalResult(bankName,locationName,branchName)
            
            return response
        }
    });


function getDivFinalResult(bankName,locationName,branchName){

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            
            document.getElementById('showResultSegment').outerHTML = myObj.div_finaResults 
            
            $('html, body').animate({ scrollTop: $('#showResultSegment').offset().top }, 'slow');

            new ClipboardJS('#button-copy-ifsc');
        }                   
    }

    let finalPath = "/getDomForResults/?bankName=" + $("#findBankSearchField.ui.search").data("selectedBank") + "&locationName=" + $("#findLocationSearchField.ui.search").data("selectedLocation") + "&branchName=" +  $("#findBranchSearchField.ui.search").data("selectedBranch")

    console.log("Final Path is ... : " + finalPath)

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.send();

}
