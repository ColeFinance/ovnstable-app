let accounting = require("accounting-js")
let moment = require("moment");

let accountingConfig = {
    symbol: "",
    precision: 6,
    thousand: " ",
}

let accountingSecondConfig = {
    symbol: "",
    precision: 2,
    thousand: " ",
}


let accountingZeroConfig = {
    symbol: "",
    precision: 2,
    thousand: " ",
}

export default {


    formatMoney(number = 0, count = 6) {

        if (!number)
            return 0;

        switch (count){
            case 6:
                return accounting.formatMoney(number, accountingConfig);
            case 2:
                return accounting.formatMoney(number, accountingSecondConfig);
            case 0:
                return accounting.formatMoney(number, accountingZeroConfig);

        }

    },

    formatDate(date, pattern){
        return moment(date, pattern, true)
    },


}
