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

export function calculateISV(car) {
    let isv = 0;
    const displacementValue = getDisplacementISVvalue(car);
    isv += displacementValue;

    return isv;
}

function getDisplacementISVvalue(car) {
    let baseValue = 0;

    const engineDisplacement = car.displacement;
    if (engineDisplacement < 1000) {
        baseValue = (engineDisplacement * 0.99) - 769.80;
    }
    else if (engineDisplacement < 1250) {
        baseValue = (engineDisplacement * 1.07) - 771.31;
    }
    else {
        baseValue = (engineDisplacement * 5.08) - 5616.80;
    }

    const years = getYearsOld(car.month, car.year);
    console.log(years);
    switch (years) {
        case years < 1:
            baseValue * (1 - 0.10);
        case years < 2:
            baseValue * (1 - 0.20);
        case years < 3:
            baseValue * (1 - 0.28);
        case years < 4:
            baseValue * (1 - 0.35);
        case years < 5:
            baseValue * (1 - 0.43);
        case years < 6:
            baseValue * (1 - 0.52);
        case years < 7:
            baseValue * (1 - 0.60);
        case years < 8:
            baseValue * (1 - 0.65);
        case years < 9:
            baseValue * (1 - 0.70);
        case years < 10:
            baseValue * (1 - 0.75);
        // Mais de 10 anos
        default:
            baseValue * (1 - 0.8);
    };
    return baseValue;
}

function getYearsOld(month, year) {
    // We assume it's day 1 because we have no way of getting this information
    const carDate = new Date(month + '/01/' + year);
    const todayDate = new Date();
    const difference = todayDate.getTime() - carDate.getTime();
    const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
    const years = (totalDays / 365.25);
    return years;
}
