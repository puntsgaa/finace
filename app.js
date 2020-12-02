var uiController = (function () {
    console.log("uiController");
})();


var financeController = (function () {
    console.log("Finance controller");
})();

var appController = (function (uiController, financeController) {
    document.querySelector(".add__btn").addEventListener('click', function () {
        ctrlAddItem();
    });

    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

    function ctrlAddItem() {
        var amount = document.querySelector(".add__value").value;
        console.log(amount);
    }

})(uiController, financeController);