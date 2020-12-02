var uiController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputAddValue: ".add__value",
        btnAdd: ".add__btn"
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                amount: document.querySelector(DOMstrings.inputAddValue).value,
                description: document.querySelector(DOMstrings.inputDesc).value
            };
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        addList: function (item, type) {
            var html;
            if (type === 'inc') {
                list = '.income__list';
                html = '<div class="item clearfix" id="%id%">' +
                    '<div class="item__description" >%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">+ %amount%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else {
                list = '.expenses__list';
                html = '<div class="item clearfix" id="%id%">' +
                    '<div class="item__description">%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">- %amount%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            html = html.replace('%id%', item.id);
            html = html.replace('%desc%', item.description);
            html = html.replace('%amount%', item.value);
            document.querySelector(list).insertAdjacentHTML('afterbegin', html);
        }
    };
})();


var financeController = (function () {
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var data = {
        allItem: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }

    return {
        addItem: function (type, desc, value) {
            var obj, id;
            if (data.allItem[type].length === 0) {
                id = 1;
            }
            else {
                var id = data.allItem[type][data.allItem[type].length - 1].id + 1;
            }
            if (type === 'inc') {
                obj = new Income(id, desc, value);
            }
            else {
                obj = new Expense(id, desc, value);
            }
            data.allItem[type].push(obj);
            console.log(data.allItem)
            return obj;
        }
    }
})();

var appController = (function (uiController, financeController) {
    var ctrlAddItem = function () {
        var input = uiController.getInput();
        var addItem = financeController.addItem(input.type, input.description, input.amount);
        var addHtml = uiController.addList(addItem, input.type);
    }

    var setupEventListeners = function () {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.btnAdd).addEventListener('click', function () {
            ctrlAddItem();
        });

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(uiController, financeController);


appController.init();