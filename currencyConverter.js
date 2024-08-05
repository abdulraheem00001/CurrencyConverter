let URL = "https://v6.exchangerate-api.com/v6/fedddc60fb3713f61c13ee28/latest/USD";

let exchangeRates = {};

let fromDropDown = document.querySelector("#fromCurrency");
let toDropDown = document.querySelector("#toCurrency");
let fromFlagImg = document.querySelector(".fromImg");
let toFlagImg = document.querySelector(".toImg");
let convertBtn = document.querySelector("#convertBtn");

const getExchangeRates = async () => {
    try {
        let response = await fetch(URL);
        let data = await response.json();
        exchangeRates = data.conversion_rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
};

import { currencyObject } from './currencyObject.js';
import { countryCodeList } from './countryCodeObject.js';

for (let countryCurrency in currencyObject) {
    // Create and append option to fromDropDown
    let fromOption = document.createElement("option");
    fromOption.innerText = currencyObject[countryCurrency];
    fromOption.value = countryCurrency;
    fromDropDown.append(fromOption);

    // Create and append option to toDropDown
    let toOption = document.createElement("option");
    toOption.innerText = currencyObject[countryCurrency];
    toOption.value = countryCurrency;
    toDropDown.append(toOption);
}

// Calculate conversion rate
function calUSDToOtherCurrency(fromRate, toRate) {
    return (1 / fromRate) * toRate;
}

// Convert currency
function convertCurrency() {
    const amount = parseFloat(document.querySelector("#amount").value);
    const fromCurrency = fromDropDown.value;
    const toCurrency = toDropDown.value;
    const resultDiv = document.querySelector("#result");
    
    updateFlags();

    let convertedAmount;
    
    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerText = "Please enter a valid amount.";
        return;
    }

    if (fromCurrency === "USD") {
        convertedAmount = amount * exchangeRates[toCurrency];
    } else if (toCurrency === "USD") {
        convertedAmount = amount * calUSDToOtherCurrency(exchangeRates[fromCurrency], 1);
    } else {
        convertedAmount = amount * calUSDToOtherCurrency(exchangeRates[fromCurrency], exchangeRates[toCurrency]);
    }
    
    resultDiv.innerText = `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// Update flag image based on selected option
function updateFlags() {
    const fromCurrency = fromDropDown.value;
    const toCurrency = toDropDown.value;
    
    if (countryCodeList[fromCurrency]) {
        fromFlagImg.src = `https://flagsapi.com/${countryCodeList[fromCurrency]}/flat/64.png`;
    }
    
    if (countryCodeList[toCurrency]) {
        toFlagImg.src = `https://flagsapi.com/${countryCodeList[toCurrency]}/flat/64.png`;
    }
}

convertBtn.addEventListener("click", convertCurrency);

window.addEventListener("load", () => {
    getExchangeRates().then(() => {
        updateFlags(); // Ensure flags are updated when the page loads
    });
});
