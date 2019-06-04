'use strict';

const apiKey = "uEXDEJWOGwxL2DFSUEJPbx9BNTYzygGCY6Xi7jyb"

const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function addressMerge(addressObj){
        const addressString = `Type: ${addressObj.type}<br>
        line 1: ${addressObj.line1}<br>
        Line 2: ${addressObj.line2}<br>
        Line 3: ${addressObj.line3}<br>
        City: ${addressObj.city}<br>
        State: ${addressObj.stateCode}<br>
        Postal Code: ${addressObj.postalCode}<br>`
        return addressString;
    }

function addressArrMerge(addressArr){
    let addressTotalArr = []
    let addressHtml = ""
    for (let i = 0; i < addressArr.length; i++){
        addressTotalArr.push(`Address ${i+1}<br>`);
        addressTotalArr.push(addressMerge(addressArr[i]));
        addressTotalArr.push(`\n<br>`)
    }
    addressHtml = addressTotalArr.join("")
    return addressHtml;
}

function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length & i < maxResults ; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${addressArrMerge(responseJson.data[i].addresses)}</p>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
      </li>`
    )};
  //display the results section 
  $('#results').removeClass('hidden');
};

function getNews(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    fields: "addresses"
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString + '&api_key=' + apiKey;

  console.log(url);

// why this part is not working?? probably because the server does not support preflight CORS requests...? https://stackoverflow.com/questions/49967188/using-fetch-with-authorization-header-and-cors

//   const options = {
//     headers: new Headers({
//         "X-Api-Key": apiKey})
//   };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#js-error-message').empty();
    const searchTerm = $('#js-search-term').val().split(" ").join("");
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}

$(watchForm);