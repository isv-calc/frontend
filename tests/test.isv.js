import { calculateISV } from "../index.js";
var expect = chai.expect;
// var assert = chai.assert;
describe('Test ISV Calculations', () => {
    it('#1 Test', () => {
        let isv = 100;
        let car = {
            brand: 'Ford',
            displacement: 998,
            emissions: 94,
            fuel: 'Electric/Gasoline',
            isWltp: true,
            mileage: 5000,
            model: 'Fiesta',
            month: 3,
            particulateFilter: false,
            price: 18690,
            year: 2022
        };
        let myIsv = calculateISV(car);
        expect(myIsv).to.equal(isv);
        // assert.deepEqual(isv, myIsv);

    })
});
