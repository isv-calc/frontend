/*
Ficheiro com as funções para o cálculo do ISV e/ou IVA

!! Work in Progress !!
*/

function getCarData(adUrl)
{
    const baseAPIUrl = 'https://europe-west1-fire-functions-b6ad7.cloudfunctions.net/autoScout24?url=';

    fetch(baseAPIUrl + adUrl)
    .then(data => {
    return data.json()});
}