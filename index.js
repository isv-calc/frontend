function request(car) {
    showResult();
    const urlmaster = "https://europe-west1-fire-functions-b6ad7.cloudfunctions.net/autoScout24?url="
    const requrl = urlmaster + car;

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requrl, false);
    xmlHttp.send();

    return JSON.parse(xmlHttp.responseText);
}

function showResult() {
    var x = document.getElementById("results-section");
    if (x.style.display === "none") {
        x.style.display = "grid";
    } else {
        x.style.display = "none";
    }
}

function fillCarDetails(car) {
    const carName = document.getElementById("car-name");
    carName.textContent = car.brand + " " + car.model;
    const price = document.getElementById("price-car-text");
    price.textContent = car.price;
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const car = urlParams.get('car');
if (car === "" || car === null) {
    console.log("Car not found...");
} else {
    let carResult = request(car);
    console.log(carResult);
    showResult();
    fillCarDetails(carResult);
}
