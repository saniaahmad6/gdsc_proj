const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        //when just begin-> USD as from and INR as To
        let selected;
        if (i == 0){
           selected = currency_code == "USD" ? "selected" : "";
 
        } 
        else if (i==1){
            selected=currency_code=="INR" ? "selected" : "";
        }  
        // create an HTML element with country code as a text and value -> now dynamic
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // insert this element as an adjacent element inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", function(event){
        console.log(event.target); //select tag
        loadFlag(event.target);
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // <select value="code"> </select>
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", function(){
    getExchangeRate();
});

getButton.addEventListener("click", function(e){
    e.preventDefault(); //don't submit it
    getExchangeRate(); // instead calculate exchange rate
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", function(){
    //swap
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    //change icons
    loadFlag(fromCurrency);
    loadFlag(toCurrency);

    //calc again
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let amountVal = amount.value;
    // handling unexpected cases
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    let url = `https://v6.exchangerate-api.com/v6/03529c564507221e9ff2dc85/latest/${fromCurrency.value}`;
    fetch(url).then(function(res){
        var curr=res.json();
        console.log(curr);
        return curr;
    }).then(function(result){ 
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        console.log(totalExRate);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(function(){
        exchangeRateTxt.innerHTML="Something went wrong ')";
    });
    
}