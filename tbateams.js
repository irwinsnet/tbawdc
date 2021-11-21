/**
 * @fileoverview Contents are specific to the TBA Teams Web Data Connector.
 * Requires JQuery and the Tableau Web Data Connector Javascript module.
 * 
 * 20 Nov 2021
 */

// Teams data schema
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

/**
 * Extracts parameters from WDC user interface
 */
tbaSchema.setConnectionData = function() {
    setConnectionParameter("comp_year", $('#comp_year').val().trim())
    setConnectionParameter("district_key", $('#district_key').val())
    tableau.log(JSON.stringify(tableau.connectionData))
};

tbaSchema.getData = function(table, doneCallback) {
    let teams = [];
    let cData = JSON.parse(tableau.connectionData);
    tableau.log(tableau.connectionData);
    let tbaBaseUrl = cData.tbaBaseUrl;
    let tbaUrl;
    let pageNum = 0;

    /**
     * Sends request to Blue Alliance API
     * @param {string} tbaUrl URL accepted by Blue Alliance Read API
     */
    function sendRequest(tbaUrl) {
        tableau.log(`URL: ${ tbaUrl }`);
        $.ajax({
            url: tbaUrl,
            dataType: "json", 
            async: true,
            headers: {
                "X-TBA-Auth-Key": tableau.password
            },
            cache: false,
            success: successCallback,
            error: errorCallback
        });
    }

    /**
     * Called aftter a successful TBA API call. Will call sendRequest
     * again if multiple HTTP requests required to download all data.
     * @param {Object} resp 
     * @param {string} status 
     * @param {*} xhr 
     */
    function successCallback(resp, status, xhr) {
        len = resp.length;
        tableau.log(`In successCallback: ${len} records`)
        for (let i = 0; i < len; i++) {
            let team = {};
            for (const col of tbaSchema.cols) {
                team[col.id] = resp[i][col.id];
            }
            teams.push(team);
        }
        if (len && !cData.district_key) {
            pageNum++;
            if (cData.comp_year) {
                tbaUrl = `${tbaBaseUrl}teams/${cData.comp_year}/${pageNum}`;
            } else {
                tbaUrl = `${tbaBaseUrl}teams/${pageNum}`;
            }
            sendRequest(tbaUrl)
        } else {
            tableau.log(`Request is done: ${teams.length}`)
            table.appendRows(teams);
            doneCallback();
        }
    }

    function errorCallback(xhr, status, err) {
        alert(status + ": " + err);
    }

    // Identify correct API call and send HTTP request.
    if (cData.district_key) {
        tbaUrl = `${tbaBaseUrl}district/${cData.district_key}/teams`;
        sendRequest(tbaUrl)
    } else {
        if (cData.comp_year) {
            tbaUrl = `${tbaBaseUrl}teams/${cData.comp_year}/${pageNum}`;
        } else {
            tbaUrl = `${tbaBaseUrl}teams/${pageNum}`;
        }
        sendRequest(tbaUrl)
    }
};