
(function () {

    var tbaConnector = tableau.makeConnector();

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
            tableau.log(status + ": " + err);
        }

        tba_data = JSON.parse(tableau.connectionData);
        year = tba_data.district_year;
        tableau.log(`Year from connectiondata: ${ year }`);
        tba_url = `https://www.thebluealliance.com/api/v3/districts/${ year }`;
        tableau.log(`URL: ${ tba_url }`);

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
    
            tableau.password = $("#auth_key").val()
            tba_data = {
                district_year: $("#district_year").val()
            };
            tableau.log(`Password: ${tableau.password}`)
            tableau.log(`Data: ${tba_data}`)
            tableau.connectionData = JSON.stringify(tba_data);
            tableau.submit();
        });    
    });

})();