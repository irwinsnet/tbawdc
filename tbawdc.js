
(function () {
    let tbaConnector = tableau.makeConnector();

    tbaConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;
        initCallback();
    };

    tbaConnector.getSchema = function (schemaCallback) {
        schemaCallback([tbaSchema.schema]);
    };

    tbaConnector.getData = function (table, doneCallback) {
        let cData = {tbaBaseUrl: 'https://www.thebluealliance.com/api/v3/'};
        tableau.connectionData = JSON.stringify(cData);
        tbaSchema.getData(table, doneCallback);
    };

    tableau.registerConnector(tbaConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            // Authentication
            tableau.password = $("#auth_key").val().trim();
            tableau.log(`Password: ${tableau.password}`);
            tableau.submit();
        });    
    });

})();