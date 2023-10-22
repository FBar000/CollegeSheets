// Error codes

// -1 : The named college is not in the database
const ERRORM1 = 'The referenced college is not in the database'
// -2 : An error from the API 


// Helper functions

/*
* Get API key from spreadsheet stored in cell A2
*
* @return The API key
*/
function getAPIkey() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(1,2).getValues()[0][0];
}

/*
* Request data about a college from the U.S. Board of Education College Scoresheet API
*
* @param {string} college The name of the college
* @param {string[]} field An array of fields to request
* @param {string} api_key The API key
*
* @return {UrlFetchApp.HTTPResponse} apiResponse The API response
*/
function makeCall(college, fields, api_key) {
  let sFields = fields.join()
  var url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${api_key}`
      + `&school.name=${encodeURIComponent(college)}`
      + `&fields=school.name,${sFields}`;
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  return response;
}


/*
* Get JSON data from API Response
*
* @param {UrlFetchApp.HTTPResponse} apiResponse The API response
* @return {json} data The associated JSON data
*/
function toJSON(apiResponse) {
  var json = apiResponse.getContentText();
  var data = JSON.parse(json);
  return data;
}

/*
* Validate data
* @param {json} data The json data from a API call
*
* @return {string} value An error message
*/
function validateJSON(data) {
  if ("error" in data) {throw data["error"]["message"];}
  if (data['metadata']['total']==0) {throw ERRORM1;}
}


/*
* Return entry with matching school name.
*
* @param {string} school_name The name of the school.
* @param {json} search_results A json of result of the API query
*
* @return {json} school The college entry with the name matching school_name.
*/ 
function getMatch(school_name, search_results) {
    let results = search_results['results'];
    for (let i=0; i<results.length; i++) {
        let current = results[i]['school.name'];
        if (school_name === current) {return results[i];}
    }
  return -1;
}



