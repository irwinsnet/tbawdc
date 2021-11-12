
(function () {
    var tbaConnector = tableau.makeConnector();

    tbaConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom

        // Hide the data selection controls if only authentication is needed
        if (tableau.phase == tableau.phaseEnum.authPhase) {
            $("#interactive").hide();
        } else {
            $("#interactive").show();
        }

        // Check browser storate for authorization key
        var locStore = localStorage;
        var auth_key = locStore.getItem("TBA_Auth_Key")
        if (auth_key) {
            $("#auth_key").val(auth_key)
        }

        initCallback()
    };

    tbaConnector.getSchema = function (schemaCallback) {
        schemaCallback([tbaDistrict.schema])
    };

    tbaConnector.getData = function (table, doneCallback) {
        if (table.tableInfo.id == "districts") {
            tbaDistrict.getData(table, doneCallback)
        }
    };

    tableau.registerConnector(tbaConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            // Authentication
            tableau.password = $("#auth_key").val().trim();
            tableau.log(`Password: ${tableau.password}`);

            // Store authorization key in browser
            if ($("#store_key").prop("checked")) {
                var msg
                msg = "Only store authentication keys on secure computers. " +
                      "Do you want to store the authentication key?";
                if (confirm(msg)) {
                    var locStore = localStorage
                    locStore.setItem("TBA_Auth_Key", tableau.password)
                }
            };

            // Save data from interactive phase
            if (tableau.phase == tableau.phaseEnum.interactivePhase) {
                tableau.connectionName = "The Blue Alliance Read API V3";
                tba_data = JSON.stringify({
                    district_year: $("#district_year").val()
                });
                tableau.connectionData = tba_data;
                tableau.log(`Data: ${tba_data}`)
            }

            tableau.submit();
        });    
    });

})();