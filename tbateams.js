tbaTeam= {}
tbaTeam.cols = [
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

tbaTeam.schema = {
    id: "teams",
    alias: "FRC Teams",
    columns: tbaTeam.cols
};