/**
 * General Web Data Connector File. Works with different schemas. 
 * Schemas are specified by importing different schema Javascript files
 * in Web Data Connector HTML file.
 */
(function () {
    /**
     * Helper function for saving key-value pairs
     * @param {string} key 
     * @param {string} value 
     */
    globalThis.setConnectionParameter = function(key, value) {
        let cdata;
        if (tableau.connectionData) {
            cdata = JSON.parse(tableau.connectionData);
        } else {
            cdata = {};
        }
        cdata[key] = value;
        tableau.connectionData = JSON.stringify(cdata);
    };

    let tbaConnector = tableau.makeConnector();

    /**
     * Initialization function required for authentication
     * @param {*} initCallback 
     */
    tbaConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;
        if (tableau.phase == tableau.phaseEnum.authPhase) {
            // Only authorization inputs visible during authorization.
            $('#authorization').show();
            $('#parameters').hide();
            $('#submit').show();
            $('#instructions').hide();
        } else if (tableau.phase == tableau.phaseEnum.interactivePhase) {
            // All inputs visible
            $('#authorization').show();
            $('#parameters').show();
            $('#submit').show();
            $('#instructions').show();
        }
        initCallback();
    };

    tbaConnector.getSchema = function (schemaCallback) {
        schemaCallback([tbaSchema.schema]);
    };

    tbaConnector.getData = function (table, doneCallback) {
        setConnectionParameter('tbaBaseUrl', 'https://www.thebluealliance.com/api/v3/')
        tbaSchema.getData(table, doneCallback);
    };

    tableau.registerConnector(tbaConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            // Authentication
            tableau.password = $("#auth_key").val().trim();
            tableau.log(`Password: ${tableau.password}`);

            // Connection Data
            tbaSchema.setConnectionData()
            tableau.submit();
        });    
    });



})();