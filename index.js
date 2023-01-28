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
    const co2Value = getCO2ISVvalue(car);
    isv += co2Value;

    return isv;
}

function getDisplacementISVvalue(car) {
    let baseValue = 0;

    const engineDisplacement = car.displacement;
    if (engineDisplacement < 1000) {
        baseValue = (engineDisplacement * 1.04) - 808.60;
    }
    else if (engineDisplacement < 1250) {
        baseValue = (engineDisplacement * 1.12) - 810.18;
    }
    else {
        baseValue = (engineDisplacement * 5.34) - 5899.89;
    }
    console.log("Displacement Value: " + baseValue);

    baseValue = applyYearsDiscountDisplacement(baseValue, car);

    console.log("Displacement Value: " + baseValue);

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

function getCO2ISVvalue(car) {
    let baseValue = 0;

    // Get Base Value
    if (car.fuel.includes("Gasoline")) {
        baseValue = getCO2ISVvalueGasoline(baseValue, car);
    }
    else if (car.fuel.includes("Diesel")) {
        baseValue = getCO2ISVvalueDiesel(baseValue, car);
    }
    console.log("C02 Value: " + baseValue);

    baseValue = applyYearsDiscountCO2(baseValue, car);

    console.log("C02 Value after year discount: " + baseValue);

    return baseValue;
}

function getCO2ISVvalueGasoline(baseValue, car) {
    if (car.isWltp) {
        if (car.emissions <= 110)
            baseValue = (car.emissions * 0.42) - 40.97;
        else if (car.emissions <= 115)
            baseValue = (car.emissions * 1.05) - 110.29;
        else if (car.emissions <= 120)
            baseValue = (car.emissions * 1.31) - 140.75;
        else if (car.emissions <= 130)
            baseValue = (car.emissions * 5.02) - 589.69;
        else if (car.emissions <= 145)
            baseValue = (car.emissions * 6.08) - 726.41;
        else if (car.emissions <= 175)
            baseValue = (car.emissions * 39.56) - 5542.44;
        else if (car.emissions <= 195)
            baseValue = (car.emissions * 48.93) - 6902.28;
        else if (car.emissions <= 235)
            baseValue = (car.emissions * 183.82) - 32562.40;
        else
            baseValue = (car.emissions * 222.68) - 39915.20;
    } else {
        if (car.emissions <= 99)
            baseValue = (car.emissions * 4.40) - 406.67;
        else if (car.emissions <= 115)
            baseValue = (car.emissions * 7.70) - 715.23;
        else if (car.emissions <= 145)
            baseValue = (car.emissions * 50.06) - 5622.80;
        else if (car.emissions <= 175)
            baseValue = (car.emissions * 58.32) - 6800.16;
        else if (car.emissions <= 195)
            baseValue = (car.emissions * 148.54) - 22502.16;
        else
            baseValue = (car.emissions * 195.86) - 31800.11;
    }
    return baseValue;
}

function getCO2ISVvalueDiesel(baseValue, car) {
    if (car.isWltp) {
        if (car.emissions <= 110)
            baseValue = (car.emissions * 1.56) - 10.43;
        else if (car.emissions <= 120)
            baseValue = (car.emissions * 17.20) - 1728.32;
        else if (car.emissions <= 140)
            baseValue = (car.emissions * 58.97) - 6673.96;
        else if (car.emissions <= 150)
            baseValue = (car.emissions * 115.50) - 14580.00;
        else if (car.emissions <= 160)
            baseValue = (car.emissions * 145.80) - 19200.00;
        else if (car.emissions <= 170)
            baseValue = (car.emissions * 201.00) - 26500.00;
        else if (car.emissions <= 190)
            baseValue = (car.emissions * 248.50) - 33536.42;
        else
            baseValue = (car.emissions * 256.00) - 34700.00;
    }
    else {
        if (car.emissions <= 79)
            baseValue = (car.emissions * 5.24) - 398.07;
        else if (car.emissions <= 95)
            baseValue = (car.emissions * 21.26) - 1676.08;
        else if (car.emissions <= 120)
            baseValue = (car.emissions * 71.83) - 6524.16;
        else if (car.emissions <= 140)
            baseValue = (car.emissions * 159.33) - 17158.92;
        else if (car.emissions <= 160)
            baseValue = (car.emissions * 177.19) - 19694.01;
        else
            baseValue = (car.emissions * 243.38) - 30326.67;
    }
    return baseValue;
}

function applyYearsDiscountDisplacement(baseValue, car) {
    const years = getYearsOld(car.month, car.year)
    console.log("YEARS: " + years);
    // Every car for autoscout24 is from Europe, so no need to add complexity here
    if (years < 1) {
        return baseValue * (1 - 0.10);
    } else if (years < 2) {
        return baseValue * (1 - 0.20);
    } else if (years < 3) {
        return baseValue * (1 - 0.28);
    } else if (years < 4) {
        return baseValue * (1 - 0.35);
    } else if (years < 5) {
        return baseValue * (1 - 0.43);
    } else if (years < 6) {
        return baseValue * (1 - 0.52);
    } else if (years < 7) {
        return baseValue * (1 - 0.60);
    } else if (years < 8) {
        return baseValue * (1 - 0.65);
    } else if (years < 9) {
        return baseValue * (1 - 0.70);
    } else if (years < 10) {
        return baseValue * (1 - 0.75);
    } else {
        return baseValue * (1 - 0.8);
    }
}

function applyYearsDiscountCO2(baseValue, car) {
    const years = getYearsOld(car.month, car.year)
    const negativeValue = baseValue >= 0 ? false : true
    // Every car for autoscout24 is from Europe, so no need to add complexity here
    if (negativeValue) {
        if (years < 2) {
            return baseValue * (1 + 0.10);
        } else if (years < 4) {
            return baseValue * (1 + 0.20);
        } else if (years < 6) {
            return baseValue * (1 + 0.28);
        } else if (years < 7) {
            return baseValue * (1 + 0.35);
        } else if (years < 9) {
            return baseValue * (1 + 0.43);
        } else if (years < 10) {
            return baseValue * (1 + 0.52);
        } else if (years < 12) {
            return baseValue * (1 + 0.60);
        } else if (years < 13) {
            return baseValue * (1 + 0.65);
        } else if (years < 14) {
            return baseValue * (1 + 0.70);
        } else if (years < 15) {
            return baseValue * (1 + 0.75);
        } else {
            return baseValue * (1 + 0.8);
        }
    } else {
        if (years < 2) {
            return baseValue * (1 - 0.10);
        } else if (years < 4) {
            return baseValue * (1 - 0.20);
        } else if (years < 6) {
            return baseValue * (1 - 0.28);
        } else if (years < 7) {
            return baseValue * (1 - 0.35);
        } else if (years < 9) {
            return baseValue * (1 - 0.43);
        } else if (years < 10) {
            return baseValue * (1 - 0.52);
        } else if (years < 12) {
            return baseValue * (1 - 0.60);
        } else if (years < 13) {
            return baseValue * (1 - 0.65);
        } else if (years < 14) {
            return baseValue * (1 - 0.70);
        } else if (years < 15) {
            return baseValue * (1 - 0.75);
        } else {
            return baseValue * (1 - 0.8);
        }
    }
}
