(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
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

    myConnector.getData = function (table, doneCallback) {
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
            console.log(status + ": " + err)
        }

        // function completeCallback(xhr, status) {
        //     console.log("In complete callback!!")
        // }

        $.ajax({
            url: "https://www.thebluealliance.com/api/v3/districts/2019",
            dataType: "json", 
            headers: {
                "X-TBA-Auth-Key": tableau.password
            },
            cache: false,
            success: successCallback,
            error: errorCallback
            });

    };

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "The Blue Alliance Read API V3";
            tableau.password = $("#auth_key").val()
            console.log(tableau.password)
            tableau.submit();
        });
    });
})();