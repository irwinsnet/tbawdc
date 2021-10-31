
(function () {

    var tbaConnector = tableau.makeConnector();

    /**
     * Initialization function for controlling TBA authentication
     * 
     * Tableau calls this function at the beginning of each phase.
     *   1. In the interactive phase, hides authentication widgets.
     *   2. In the gather data phase, checks if password is defined
     *      and if not, aborts to authentication phase
     *   3. In authentication phase, shows authentication widgets.
     * 
     * See the .click event callback for the #authButton for the
     * rest of the authentication logic.
     */
    tbaConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;

        if (tableau.phase == tableau.phaseEnum.interactivePhase) {
            $("#authorization").hide();
            $("#interactive").show();
        } else if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
            if (!tableau.password) {
                tableau.abortForAuth("No password");
            }
        } else if (tableau.phase == tableau.phaseEnum.authPhase) {
            $("#authorization").show();
            $("#interactive").hide();
        }
        initCallback();
    };

    tbaConnector.getSchema = function (schemaCallback) {
        var district_cols = [{
            id: "abbreviation",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "display_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "key",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "year",
            dataType: tableau.dataTypeEnum.int
        }];

        var districtSchema = {
            id: "districts",
            alias: "FRC Districts",
            columns: district_cols
        };

        schemaCallback([districtSchema])
    };

    tbaConnector.getData = function (table, doneCallback) {
        function successCallback(resp, status, xhr) {
            districts = []
            
            len = resp.length
            for (var i = 0; i < len; i++) {
                districts.push({
                    "abbreviation": resp[i].abbreviation,
                    "display_name": resp[i].display_name,
                    "key": resp[i].key,
                    "year": resp[i].year
                });
            }

            table.appendRows(districts);
            doneCallback();
        }

        function errorCallback(xhr, status, err) {
            console.log(status + ": " + err);
        }

        tba_data = JSON.parse(tableau.connectionData);
        year = tba_data.district_year;
        console.log(`Year from connectiondata: ${ year }`);
        tba_url = `https://www.thebluealliance.com/api/v3/districts/${ year }`;
        console.log(`URL: ${ tba_url }`);

        var httpRequest = $.ajax({
            url: tba_url,
            dataType: "json", 
            headers: {
                "X-TBA-Auth-Key": tableau.password
            },
            cache: false,
            success: successCallback,
            error: errorCallback
            });
    }

    tableau.registerConnector(tbaConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "The Blue Alliance Read API V3";
    
            tba_data = {
                district_year: $("#district_year").val()
            };
            tableau.connectionData = JSON.stringify(tba_data);
            tableau.submit();
        });
    
        $("#authButton").click(function () {
            tableau.password = $("#auth_key").val()
            console.log(`Password: ${tableau.password}`)
            tableau.submit()
        });
    
    });

})();