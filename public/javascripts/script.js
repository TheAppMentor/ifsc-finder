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
                        console.log("We are now.. Find Branch" + JSON.stringify(text))
                        //window.location.href = '/?bankName=' + value
                        window.location.href += '&branchName=' + text 
                    }
                })
            //.api({
            //    url: '/branches/?bankName=' + {selectedValue}
            //}); 
    });
