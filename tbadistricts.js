tbaDistrict = {}
tbaDistrict.cols = [
    {
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

tbaDistrict.schema = {
    id: "districts",
    alias: "FRC Districts",
    columns: tbaDistrict.cols
};

tbaDistrict.getData = function (table, doneCallback) {
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
    tba_url = `${ tbaUtil.baseURL }districts/${ year }`;
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
};
