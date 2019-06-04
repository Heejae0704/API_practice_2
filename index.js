'use strict';

const apiKey = "uEXDEJWOGwxL2DFSUEJPbx9BNTYzygGCY6Xi7jyb"

const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function addressMerge(addressObj){
        const addressString = `Type: ${addressObj.type}
        line 1: ${addressObj.line1}
        Line 2: ${addressObj.line2}
        Line 3: ${addressObj.line3}
        City: ${addressObj.city}
        State: ${addressObj.stateCode}
        Postal Code: ${addressObj.postalCode}`
        return addressString;
    }

function addressArrMerge(addressArr){
    let addressTotalArr = []
    let addressHtml = ""
    for (let i = 0; i < addressArr.length; i++){
        let addressDetail = addressMerge(addressArr[i]);
        addressTotalArr.push(`Address ${i+1}`);
        addressTotalArr.push(addressDetail);
        addressTotalArr.push(`\n<br>`)
    }
    addressHtml = addressTotalArr.join("<br><br>")
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
      `<li><h3>${responseJson.data[i].title}</h3>
      <p>${addressArrMerge(responseJson.data[i].addresses)}</p>
      <p>${responseJson.articles[i].description}</p>
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
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
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