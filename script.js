// Color constants
const color_digit = 'gray';
const color_digit_pressed = 'lightgray';
const color_operator = 'darkorange';
const color_operator_pressed = 'orange';
const color_equals = 'darkorange';
const color_equals_pressed = 'orange';
const color_other = 'rgb(73, 73, 73)';
const color_other_pressed = 'gray';

// Max decimal values shown
const max_decimals = 8;

// States
STATE_VAR1 = 1;         // User is inputting the first operand
STATE_VAR2 = 2;         // User inputed the first operand and operator, and is inputting the second operand
STATE_RESULT = 3;       // User pressed equal and the result is displayed.

// If user is in STATE_RESULT and then presses an operator, the result shown becomes VAR1 and they go to STATE_VAR2.

// If user is in STATE_VAR2 and then presses an operator, the initial result is shown, the result becomes VAR1,
// the new operator is set and they go to STATE_VAR2.

// If ths user is in STATE_RESULT and then presses a digit or decimal key, they go to STATE_VAR1 and start 
// a new VAR1 number.


function Calculator () {

    this.operator;
    this.result;
    this.state = STATE_VAR1;
    this.var1 = "0";
    this.var2 = undefined;
    this.display = document.querySelector(".display");
    
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
                switch (this.state) {
                    case (STATE_VAR1):
                        this.var1 = (this.var1 == "0") ? digit : this.var1+digit;
                        this.display.textContent = this.var1;
                        break;
                    case (STATE_VAR2):
                        this.var2 = (this.var2 == undefined || this.var2 == "0") ? digit : this.var2+digit;
                        this.display.textContent = this.var2; 
                        break;
                    case (STATE_RESULT):
                        this.var1 = digit;
                        this.state = STATE_VAR1;
                        this.display.textContent = this.var1;
                        break;
                }
                console.table(this.var1, this.var2, this.operator, this.state);
                break;

            case ("operator"):
                e.target.style.backgroundColor = color_operator;

                switch (this.state) {
                    // User entered the first operand and this is the first press of an operator key
                    case (STATE_VAR1):
                        this.operator = e.target.textContent;
                        this.state = STATE_VAR2;
                        break;

                     // User entered the first operand and another operator previously
                    case (STATE_VAR2):
                        // If user entered the second operand, execute the current operation.
                        if (this.var2 != undefined)
                            this.applyOperator();
                        // Update the operator and state to be ready for second operand to next operation.
                        this.operator = e.target.textContent;
                        this.state = STATE_VAR2;
                        break;

                    // User sees the result of previous operation and pressed another operator key
                    case (STATE_RESULT):
                        this.var1 = this.display.textContent;
                        this.operator = e.target.textContent;
                        this.state = STATE_VAR2;
                        break;
                }
                console.table(this.var1, this.var2, this.operator, this.state);
                break;

            case ("equals"):        
                e.target.style.backgroundColor = color_equals;
                if (this.state == STATE_VAR2) {
                    // If user hasn't defined second operand and then presses equal, assume same as first operand.
                    if (this.var2 == undefined) {
                        this.var2 = this.display.textContent;
                    }
                    this.applyOperator();
                }
                console.table(this.var1, this.var2, this.operator, this.state);               
                break;

            case ("clear"):
                e.target.style.backgroundColor = color_other;
                this.state = STATE_VAR1;
                this.var1 = "0";
                this.var2 = undefined;
                this.operator = undefined;
                this.display.textContent = "0";
                console.table(this.var1, this.var2, this.operator, this.state);
                break;
                
            case ("decimal"):
                e.target.style.backgroundColor = color_digit;
                switch (this.state) {
                    case (STATE_VAR1):
                        if (!this.var1.includes(".")) {
                            this.var1 += ".";
                        }
                        this.display.textContent = this.var1;
                        break;
                    case (STATE_VAR2):
                        if (this.var2 == undefined)
                            this.var2 = "0.";
                        else if (!this.var2.includes(".")) {
                            this.var2 += ".";
                        }
                        this.display.textContent = this.var2;
                        break;
                    case (STATE_RESULT):
                        this.var1 = "0.";
                        this.display.textContent = this.var1;
                        this.state = STATE_VAR1;
                        break;
                    default:
                        break;
                }
                console.table(this.var1, this.var2, this.operator, this.state);   
                break;
            
            case ("plusminus"):
                e.target.style.backgroundColor = color_digit;
                switch (this.state) {
                    case (STATE_VAR1):
                        this.var1 = (-parseFloat(this.var1)).toString();
                        this.display.textContent = this.var1;
                        break;
                    case (STATE_VAR2):
                        this.var2 = (-parseFloat(((this.var2==undefined) ? this.var1 : this.var2))).toString();
                        this.display.textContent = this.var2;
                        break;
                    case (STATE_RESULT):
                        this.var1 = (-parseFloat(this.display.textContent)).toString();
                        this.display.textContent = this.var1;
                        this.state = STATE_VAR1;
                        break;
                    default:
                        break;
                }
                console.table(this.var1, this.var2, this.operator, this.state); 
                break;
 
            case ("percent"):
                if (this.operator == undefined) {
                    this.var1 = "" + this.var1 * .01;
                    this.display.textContent = this.var1;
                } else {
                    this.var2 = "" + this.var2 *.01;
                    this.display.textContent = this.var2;
                }
                break;

            case ("backspace"):
                e.target.style.backgroundColor = color_other;
                switch (this.state) {
                    case (STATE_VAR1):
                        this.var1 = this.var1.slice(0,length-1);
                        this.display.textContent = this.var1;
                        break;
                    case (STATE_VAR2):
                        this.var2 = this.var2.slice(0,length-1);
                        this.display.textContent = this.var2;
                        break;
                    case (STATE_RESULT):
                        this.var1 = this.display.textContent.slice(0,length-1);
                        this.display.textContent = this.var1;
                        this.state = STATE_VAR1;
                        break;
                }
                console.table(this.var1, this.var2, this.operator, this.state);
                break;

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
        this.state = STATE_RESULT;
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

