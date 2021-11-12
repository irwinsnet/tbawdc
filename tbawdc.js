
(function () {
    var tbaConnector = tableau.makeConnector();

    tbaConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom

        if (tableau.phase == tableau.phaseEnum.authPhase) {
            $("#interactive").hide();
        } else {
            $("#interactive").show();
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
            tableau.password = $("#auth_key").val()
            tableau.log(`Password: ${tableau.password}`)

            // Interactive
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