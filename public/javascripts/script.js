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

        
        /*
        $('#findBranch.ui.dropdown')
            .dropdown(
                {
                    //action: 'hide',
                    onChange: function(value, text, $selectedItem) {
                        // custom action
                        
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var myObj = JSON.parse(this.responseText);

                               //Generate Statistics talkg
                                document.getElementById('findBranch').innerHTML
                                document.getElementById('steps-div').innerHTML = myObj.div_steps
                                document.getElementById('statistics-row').innerHTML = myObj.div_stats
                                console.log("The Div Stats fellow is :  \n" + myObj.div_stats)

                                // Final results modal
                                document.getElementById('modal-finalResult').innerHTML = myObj.div_modal 
                        
                                new ClipboardJS('#button-copy-ifsc');
                                
                                $('html, body').animate({ scrollTop: $('#statistics-segment').offset().top }, 'slow');

                                $('.ui.modal').modal({
                                // Set Properites of the modal here.
                                    //blurring: true 
                                    //inverted: true
                                })
                                  .modal('show')
                                ;
                            }
                        };

                        let fullPath = window.location.search.substring(1); 
                        let finalPath = "/branches/?" + fullPath + '&branchName=' + text
                        console.log("WE will now query path... " + finalPath);

                        xmlhttp.open("GET", finalPath, true);
                        xmlhttp.send();

                    }
                })
        //.api({
        //    url: '/branches/?bankName=' + {selectedValue}
*/

        $('.ui.dropdown')
            .dropdown(
                {
                    action: 'hide',
                    placeholder : 'Fetching Bank Details',
                    onChange: function(value, text, $selectedItem) {
                        
                        // custom action
                        if (this.id == "findBank"){
                            processFindBankDiv(text)
                        }
                        if (this.id == "findCity"){
                            alert("We are dealing with a Find CITY")
                        }
                    }                    
                })

    });


function processFindBankDiv(selectedBankName){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);

            console.log("Resonpse getLocations : " + myObj.div_dropdown)

            //Generate Statistics talkg
            document.getElementById('steps-div').outerHTML = myObj.div_steps
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats
            document.getElementById('menuboy').outerHTML = myObj.div_dropdown  
            document.getElementById('findBank').id = "findCity"
            
            
            $('.ui.dropdown').dropdown()
            $('.ui.dropdown').dropdown('setting','onChange',
                    function(value, text, $selectedItem) {
                        console.log("Responding to city slection.. ")
                        if (this.id == "findCity"){
                            processFindCityDiv(xmlhttp.getResponseHeader("bankName"),text)
                        }
                    }                    
            ); 
        }                   
    }

    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getLocations/?" + fullPath + '&bankName=' + selectedBankName //TODO Modify this to fetch bank name from the request header.
    console.log("We will now query path... " + finalPath);

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.setRequestHeader("bankName", selectedBankName)
    xmlhttp.send();
}

function processFindCityDiv(selectedBankName,selectedCity){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);

            console.log("Resonpse getLocations : " + myObj.div_dropdown)

            //Generate Statistics talkg
            document.getElementById('steps-div').outerHTML = myObj.div_steps
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats
            $('.ui.dropdown').replaceWith(myObj.div_dropdown)
            //$('.ui.dropdown').outerHMTL  = myObj.div_dropdown  
            //document.getElementById('findCity').id = "findBranch"

            //$('.ui.dropdown').dropdown()

/*
            $('#findBranch').dropdown('setting','onChange',
                    function(value, text, $selectedItem) {
                        console.log("Responding to BRANCH slection.. ")
                            let selectedBranch = text
                            let selectedBankName = xmlhttp.getResponseHeader("bankName")
                            let selectedLocationName = xmlhttp.getResponseHeader("cityName")
                            processFindBranchDiv(selectedBank,selectedLocationName,selectedBranch)
                    }                    
            ); 
*/
            //$('.ui.dropdown').dropdown('refresh')
            $('.ui.dropdown').dropdown({
                    onChange: function(value, text, $selectedItem) {
                            alert("We are dealing with a Find Branch")
                            let selectedBranch = text
                            let selectedBankName = xmlhttp.getResponseHeader("bankName")
                            let selectedLocationName = xmlhttp.getResponseHeader("cityName")
                            processFindBranchDiv(selectedBankName,selectedLocationName,selectedBranch)
                    }                    
            }); 
        }                   
    }

    let fullPath = window.location.search.substring(1); 
    let finalPath = "/getBranches/?" + fullPath + '&bankName=' + selectedBankName + '&cityName=' + selectedCity
    console.log("WE will now query path... " + finalPath);

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
            //document.getElementById('steps-div').outerHTML = myObj.div_steps
            //document.getElementById('statistics-segment').innerHTML = myObj.div_stats
            //document.getElementById('menuboy').outerHTML = myObj.div_dropdown  



                               //Generate Statistics talkg
                                document.getElementById('steps-div').innerHTML = myObj.div_steps
                                //document.getElementById('statistics-row').innerHTML = myObj.div_stats
            document.getElementById('statistics-segment').innerHTML = myObj.div_stats
                                console.log("The Div Stats fellow is :  \n" + myObj.div_stats)

                                // Final results modal
                                document.getElementById('modal-finalResult').innerHTML = myObj.div_modal 
                        
                                new ClipboardJS('#button-copy-ifsc');
                                
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
    console.log("WE will now query path... " + finalPath);

    xmlhttp.open("GET", finalPath, true);
    xmlhttp.setRequestHeader("bankName", selectedBank)
    xmlhttp.setRequestHeader("cityName", selectedCity)
    xmlhttp.setRequestHeader("branchName", selectedBranch)
    
    xmlhttp.send();
}
