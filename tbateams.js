tbaSchema= {}
tbaSchema.cols = [
    {
        id: "key",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "team_number",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "nickname",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "city",
        dataType: tableau.dataTypeEnum.string,
        geoRole: tableau.geographicRoleEnum.city
    }, {
        id: "state_prov",
        dataType: tableau.dataTypeEnum.string,
        geoRole: tableau.geographicRoleEnum.state_province
    }, {
        id: "postal_code",
        dataType: tableau.dataTypeEnum.string,
        geoRole: tableau.geographicRoleEnum.zip_code_postcode
    }, {
        id: "country",
        dataType: tableau.dataTypeEnum.string,
        geoRole: tableau.geographicRoleEnum.country
    }, {
        id: "name",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "school_name",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "rookie_year",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "website",
        dataType: tableau.dataTypeEnum.string
    }];

tbaSchema.schema = {
    id: "teams",
    alias: "FRC Teams",
    columns: tbaSchema.cols
};

tbaSchema.getData = function(table, doneCallback) {
    var teams = []; 
    function successCallback(resp, status, xhr) {
        len = resp.length;
        for (let i = 0; i < len; i++) {
            let team = {};
            for (const col of tbaSchema.cols) {
                team[col.id] = resp[i][col.id];
            }
            teams.push(team);
        }
    }

    function errorCallback(xhr, status, err) {
        tableau.log(status + ": " + err);
    }

    let tbaBaseUrl = JSON.parse(tableau.connectionData).tbaBaseUrl;
    let pageNum = 0;
    numTeams = teams.length;
    while (true) {
        pageNum++;
        let tbaUrl = `${tbaBaseUrl}teams/${pageNum}`;
        tableau.log(`URL: ${ tbaUrl }`);
        $.ajax({
            url: tbaUrl,
            dataType: "json", 
            async: false,
            headers: {
                "X-TBA-Auth-Key": tableau.password
            },
            cache: false,
            success: successCallback,
            error: errorCallback
        });
        if (teams.length == numTeams) break;
        numTeams = teams.length;
    }

    table.appendRows(teams);
    doneCallback();
};