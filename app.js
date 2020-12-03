var uiController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputAddValue: ".add__value",
        btnAdd: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        tusuv: ".budget__value",
        totalInc: ".budget__income--value",
        totalExp: ".budget__expenses--value",
        percent: ".budget__expenses--percentage",
        exp_percentage: ".item__percentage"
    };

    var formatNumber = function (number) {
        number = '' + number;
        var too = number.split("").reverse().join("");
        var count = 1;
        var y = "";
        for (var i = 0; i < too.length; i++) {
            y += too[i];
            if (count % 3 === 0) {
                y += ',';
            }
            count++;
        }
        var z = y.split("").reverse().join("");
        if (z[0] === ',') {
            z = z.substr(1, z.length - 1);
        }
        return z;
    };

    var nodeListForeach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                amount: parseInt(document.querySelector(DOMstrings.inputAddValue).value),
                description: document.querySelector(DOMstrings.inputDesc).value
            };
        },

        updatePercentage: function (allPercentages) {
            var elements = document.querySelectorAll(DOMstrings.exp_percentage);
            nodeListForeach(elements, function (el, index) {
                el.textContent = allPercentages[index] + "%";
            });
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        clearFields: function () {
            var fields = document.querySelectorAll(DOMstrings.inputDesc + ',' + DOMstrings.inputAddValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (el, index, array) {
                el.value = "";
            });
            fieldsArr[0].focus();
        },
        addList: function (item, type) {
            var html;
            if (type === 'inc') {
                list = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%">' +
                    '<div class="item__description" >%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value" id="incamount-%amid%">+ %amount%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%">' +
                    '<div class="item__description">%desc%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value" id="expamount-%amid%">- %amount%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            html = html.replace('%id%', item.id);
            html = html.replace('%amid%', item.id);
            html = html.replace('%desc%', item.description);
            html = html.replace('%amount%', formatNumber(item.value));
            document.querySelector(list).insertAdjacentHTML('afterbegin', html);
        },
        removeHtml: function (id, amountDivId) {
            var item_value = document.getElementById(amountDivId).innerHTML;
            var amount = parseInt(item_value.split(" ")[1]);
            document.getElementById(id).remove();
            return amount;
        },
        showTusuv: function (tusuv) {
            document.querySelector(DOMstrings.tusuv).textContent = formatNumber(tusuv.tusuv);
            document.querySelector(DOMstrings.totalInc).textContent = '+ ' + formatNumber(tusuv.totalInc);
            document.querySelector(DOMstrings.totalExp).textContent = '- ' + formatNumber(tusuv.totalExp);
            if (tusuv.huvi !== 0) {
                document.querySelector(DOMstrings.percent).textContent = tusuv.huvi + "%";
            }
            else {
                document.querySelector(DOMstrings.percent).textContent = tusuv.huvi;
            }
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
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value * 100) / totalInc);
        }
        else {
            this.percentage = 0;
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var data = {
        allItem: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,
        huvi: 0
    }

    return {
        calcPercentages: function () {
            data.allItem.exp.forEach(function (el) {
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPercentages = data.allItem.exp.map(function (el) {
                return el.getPercentage();
            });
            return allPercentages;
        },
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
            //console.log(data.allItem)
            return obj;
        },
        horogduulah: function (type, amount) {
            data.totals[type] -= amount;
            data.tusuv = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.huvi = Math.round((data.totals.exp * 100) / data.totals.inc);
            }
            else {
                data.huvi = 0;
            }
        },
        addTotal: function (amount, type) {
            data.totals[type] += amount;
            data.tusuv = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.huvi = Math.round((data.totals.exp * 100) / data.totals.inc);
            }
            else {
                data.huvi = 0;
            }
        },
        getTusuv: function () {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        remove: function (id, type) {
            var ids = data.allItem[type].map(function (el, index, array) {
                return el.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.allItem[type].splice(index, 1);
            }
        }
    }
})();

var appController = (function (uiController, financeController) {
    var ctrlAddItem = function () {
        var input = uiController.getInput();
        if (input.description !== "" && input.amount !== "" && isNaN(input.amount) !== true) {
            var addItem = financeController.addItem(input.type, input.description, input.amount);
            uiController.addList(addItem, input.type);
            uiController.clearFields();
            financeController.addTotal(input.amount, input.type);
            var tusuv = financeController.getTusuv();
            uiController.showTusuv(tusuv);
            financeController.calcPercentages();
            var allPercentages = financeController.getPercentages();
            uiController.updatePercentage(allPercentages);
        }
        else {
            alert("Тайлбар дүнгээ заавал оруулна уу.");
        }
    }

    var setupEventListeners = function () {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.btnAdd).addEventListener('click', function () {
            ctrlAddItem();
        });
        uiController.showTusuv(financeController.getTusuv());
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(".container").addEventListener('click', function (event) {
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var type = id.split("-")[0];
                var itemId = parseInt(id.split("-")[1]);
                var amountDivId = type + "amount-" + itemId;
                financeController.remove(itemId, type);
                var amount = uiController.removeHtml(id, amountDivId);
                financeController.horogduulah(type, amount);
                var tusuv = financeController.getTusuv();
                uiController.showTusuv(tusuv);
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