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
    });


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
