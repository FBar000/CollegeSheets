"""
Code to generate JS functions for a google sheets extensions project. These are interfaces with a college data API.


Assumes helper functions are already written.

2022
"""




def makeFunction(functionName: str, APIField: str) -> str:
    """
    Write the JS code for a Google sheets function that returns data from College Scorecard API
    
    Arg:
    functionName: The name of the function
    APIField: The key associatted with the desired value from the API
    
    Return:
    function: The JS code for the desired function
    """
    function = r"""
/**
* @param {string} college The name of the college.
* @return The """+functionName+"""
*/
function """+ functionName + r"""(college) {
    if (college == null) {throw `Error: Expected a college name (string)`;}
    var api_key = getAPIkey()
    let fields = ['""" +APIField+r"""'];
    let response = makeCall(college, fields, api_key);
    let search_results = toJSON(response);
    validateJSON(search_results)
    let mat = getMatch(college, search_results);
    if (mat==-1) {throw ERRORM1;}
    return mat[fields[0]];
}
    """
    return function
