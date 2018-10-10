//<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.0/mustache.min.js"></script>

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

        $('#findBank.ui.dropdown')
            .dropdown(
                {
                    //action: 'hide',
                    onChange: function(value, text, $selectedItem) {
                        // custom action
                        console.log("We are now.. Find Bank" + JSON.stringify(text))
                        window.location.href = '/?bankName=' + text 
                    }
                })
        //.api({
        //    url: '/branches/?bankName=' + {selectedValue}
        //}); 

        $('#findCity.ui.dropdown')
            .dropdown(
                {
                    //action: 'hide',
                    onChange: function(value, text, $selectedItem) {
                        // custom action
                        console.log("We are now.. Find City " + JSON.stringify(text))
                        //window.location.href = '/?bankName=' + value
                        window.location.href += '&cityName=' + text 
                    }
                })
        //.api({
        //    url: '/branches/?bankName=' + {selectedValue}
        //}); 

        $('#findBranch.ui.dropdown')
            .dropdown(
                {
                    //action: 'hide',
                    onChange: function(value, text, $selectedItem) {
                        // custom action
                        console.log("We are now.. Find Branch  >>>>>>>>>>>>>>>>>>>>>>>>>> New Boy" + JSON.stringify(text))
                        //window.location.href = '/?bankName=' + value
                        //window.location.href += '&branchName=' + text 
                        //var newURL = window.location.href += '&branchName=' + text  

                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var myObj = JSON.parse(this.responseText);
                                console.log(">>>>>>>>>>>>>>>> Resonpse boy...... " + JSON.stringify(myObj))
                                var respObj = JSON.stringify(myObj)

                               //Generate Statistics talkg
                                document.getElementById('findBranch').innerHTML
                                document.getElementById('steps-div').innerHTML = myObj.div_steps
                                document.getElementById('statistics-row').innerHTML = myObj.div_stats
                                
                                $('.ui.modal')
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
    });
