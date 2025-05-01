const color_digit = 'gray';
const color_digit_pressed = 'lightgray';
const color_operator = 'darkorange';
const color_operator_pressed = 'orange';
const color_equals = 'darkorange';
const color_equals_pressed = 'orange';
const color_other = 'rgb(73, 73, 73)';
const color_other_pressed = 'gray';
const max_decimals = 10;


function Calculator () {

    this.var1;
    this.var2;
    this.operator;
    this.display = document.querySelector(".display");
    this.resultShown = false;
    
    this.operators = {
        "+": (a, b) => +a + +b,
        "-": (a, b) => a - b,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b
    };

    this.handleClick = function(e) {
        console.log("clicked");
        console.log(e);

        switch (e.target.className) {
            case ("digit"):
                e.target.style.backgroundColor = color_digit;
                let digit = e.target.textContent;
                // If the operator is undefined, then the user is submitting the first operand.  Otherwise the second operand.
                if (this.operator == undefined) {
                    if (this.resultShown) {  // If a calculation was just completed and a digit is pressed, start a new number.
                        this.var1 = digit;
                    } else {            // Otherwise add the digit to the current number, unless the current number is 0.
                        this.var1 = (this.var1 == 0) ? digit : (this.var1 || "") + digit;
                    }
                    this.display.textContent = this.var1;
                } else {
                    this.var2 = (this.var2 == 0) ? digit : (this.var2 || "") + digit;
                    this.display.textContent = this.var2;
                }
                this.resultShown = false;                
                console.table(this.var1, this.var2, this.operator, this.resultShown);
                break;

            case ("operator"):
                e.target.style.backgroundColor = color_operator;
                // If user presses different operator buttons in a row, we use the last one pressed.
                if (this.var2 != undefined)
                    this.applyOperator();
                this.operator = e.target.textContent;
                console.table(this.var1, this.var2, this.operator, this.resultShown);
                break;

            case ("equals"):        
                e.target.style.backgroundColor = color_equals;
                if (this.var1 != undefined && this.operator != undefined) {
                    if (this.var2 == undefined)
                        this.var2 = this.var1;
                    this.applyOperator();
                }
                console.table(this.var1, this.var2, this.operator, this.resultShown);               
                break;

            case ("clear"):
                e.target.style.backgroundColor = color_other;
                this.var1 = 0;
                this.var2 = undefined;
                this.operator = undefined;
                this.result = false;
                this.display.textContent = "0";
                console.table(this.var1, this.var2, this.operator, this.resultShown);
                break;
                
            case ("decimal"):
                e.target.style.backgroundColor = color_digit;
                if (this.var1 == undefined || this.var1 == 0 || this.operator == undefined && this.resultShown) {                    
                    this.var1 = "0.";
                    this.display.textContent = "0.";
                    this.resultShown = false;
                } else if (this.operator != undefined && this.resultShown) {
                    this.var2 = "0.";
                    this.display.textContent = "0.";
                    this.resultShown = false;
                } else if (this.operator == undefined && !this.resultShown && (!this.var1 || !this.var1.includes("."))) {
                    this.var1 += ".";
                    this.display.textContent += ".";
                } else if (this.operator != undefined && !this.resultShown && (!this.var2 || !this.var2.includes("."))) {              
                    this.var2 += ".";
                    this.display.textContent += ".";
                }
                console.table(this.var1, this.var2, this.operator, this.resultShown);   
                break;
            
            case ("plusminus"):
                e.target.style.backgroundColor = color_digit;
                break;

            case ("percent"):
                if (this.operator == undefined) {
                    this.var1 = this.var1 * .01;
                    this.display.textContent = this.var1;
                } else {
                    this.var2 /= 100;
                    this.display.textContent = this.var2;
                }
                break;

            case ("backspace"):
                e.target.style.backgroundColor = color_other;
                console.table(this.var1, this.var2, this.operator, this.resultShown);

            default:
                break;
        }
        return;
    }    

    this.applyOperator = function() {
        let result = this.operators[this.operator](this.var1, this.var2);
        let decimals = result.toString().split(".")[1];
        if (decimals != null) {
            result = result.toFixed(Math.min(decimals.length, max_decimals));
        }
        result = parseFloat(result);
        this.display.textContent = result;
        // Take the result and make it the first operand so they can do additional operations with it.
        this.var1 = result;
        this.var2 = undefined;
        this.operator = undefined;
        this.resultShown = true;
    }

    this.handleMousedown = function(e) {
        console.log(e.className);
        switch (e.target.className) {
            case ("digit"):
            case ("decimal"):
            case ("plusminus"):                
                e.target.style.backgroundColor = color_digit_pressed;
                break;
            case ("operator"):
                e.target.style.backgroundColor = color_operator_pressed;
                break;
            case ("equals"):
                e.target.style.backgroundColor = color_equals_pressed;
                break;
            case ("clear"):
            case ("percent"):
            case ("backspace"):
                e.target.style.backgroundColor = color_other_pressed;
                break;
            default:
                break;
        }
        return;
    }



    this.handleMouseleave = function(e) {
        switch (e.target.className) {
            case ("digit"):
            case ("decimal"):
            case ("plusminus"):
                e.target.style.backgroundColor = color_digit;
                break;
            case ("operator"):
                e.target.style.backgroundColor = color_operator;
                break;
            case ("equals"):
                e.target.style.backgroundColor = color_equals;
                break;    
            case ("clear"):
            case ("percent"):
            case ("backspace"):
                e.target.style.backgroundColor = color_other;
                break;                               
            default:
                break;
        }
        return;
    }

    this.operate = function (operator, operand1, operand2) {
        if (!this.operators[operator] || isNaN(operand1) || isNaN(operand2)) {
            return NaN;
        }
        return this.operators[operator](+operand1, +operand2);
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMouseleave = this.handleMouseleave.bind(this);

    this.buttons = document.querySelectorAll('button');
    this.buttons.forEach((button) => {
        button.addEventListener("click", this.handleClick);
        button.addEventListener("mousedown", this.handleMousedown);
        button.addEventListener("mouseleave", this.handleMouseleave);       
    });

}
c = new Calculator();

