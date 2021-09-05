function request() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const car = urlParams.get('car');
    const urlmaster = "https://europe-west1-fire-functions-b6ad7.cloudfunctions.net/autoScout24?url="
    const requrl = urlmaster + car;

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requrl, false);
    xmlHttp.send();

    return JSON.parse(xmlHttp.responseText);
}
