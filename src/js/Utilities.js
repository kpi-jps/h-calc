const Utilities = Object.freeze({
    /**
     * Object containing methods to mask input data 
     */
    inputMasks: Object.freeze({
        /**
         * Mask for positive integers
         * @param {Event} event DOM event
         */
        posIntMask(event) {
            const inputValue = event.target.value
            const lastCharCode = inputValue.charCodeAt(inputValue.length - 1)
            if (lastCharCode < 48 || lastCharCode > 57)
                event.target.value = inputValue.slice(0, inputValue.length - 1)
        },

        /**
         * Mask for positive integers with interval
         * @param {Event} event DOM event
         * @param {Number} max Maximum interval value
         */
        posIntMaskWithInterval(event, max) {
            const inputValue = event.target.value
            const lastCharCode = inputValue.charCodeAt(inputValue.length - 1)
            if (lastCharCode < 48 || lastCharCode > 57)
                event.target.value = inputValue.slice(0, inputValue.length - 1)
            if (Number(inputValue) < 0 || Number(inputValue) > max)
                event.target.value = inputValue.slice(0, inputValue.length - 1)
        },

        /**
         * Mask for real number 
         * @param {Event} event DOM event
         * @param {Number} decimalSeparator Decimal separator for the number
         */
        realNumberMask(event, decimalSeparator) {
            const inputValue = event.target.value
            const index = inputValue.length === 0 ? 0 : inputValue.length - 1
            decimalSeparator ? "." : ","
            const minus = "-"
            const allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            let alreadyHasOne = false
            let count = 0
            if (index === 0) allowedChars.push(minus)
            if (index > 1) for (let char of inputValue) if (char === decimalSeparator) count++
            if (count >= 2) alreadyHasOne = true
            if (!alreadyHasOne) allowedChars.push(decimalSeparator)
            for (let char of allowedChars)
                if (char === inputValue[index]) return
            event.target.value = inputValue.slice(0, index)
        },

         /**
         * Mask for positive number
         * @param {Event} event DOM event
         * @param {Number} decimalSeparator Decimal separator for the number
         */
        posNumberMask(event, decimalSeparator) {
            const inputValue = event.target.value
            const index = inputValue.length === 0 ? 0 : inputValue.length - 1
            decimalSeparator ? "." : ","
            const allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            let alreadyHasOne = false
            let count = 0
            if (index > 1) for (let char of inputValue) if (char === decimalSeparator) count++
            if (count >= 2) alreadyHasOne = true
            if (!alreadyHasOne) allowedChars.push(decimalSeparator)
            for (let char of allowedChars)
                if (char === inputValue[index]) return
            event.target.value = inputValue.slice(0, index)
        },

         /**
         * Mask for positive number with interval
         * @param {Event} event DOM event
         * @param {Number} decimalSeparator Decimal separator for real number
         * @param {Number} max Maximum interval value
         */
        posNumberMaskWithInterval(event, decimalSeparator, max) {
            const inputValue = event.target.value
            const index = inputValue.length === 0 ? 0 : inputValue.length - 1
            decimalSeparator ? "." : ","
            const allowedChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            let alreadyHasOne = false
            let count = 0
            if (index > 1) for (let char of inputValue) if (char === decimalSeparator) count++
            if (count >= 2) alreadyHasOne = true
            if (!alreadyHasOne) allowedChars.push(decimalSeparator)
            for (let char of allowedChars)
                if (char === inputValue[index] &&
                    Number(inputValue.replace(decimalSeparator, ".")) > 0 &&
                    Number(inputValue.replace(decimalSeparator, ".")) <= max) return
            event.target.value = inputValue.slice(0, index)
        }
    }),

    /**
     * Object containing methods to validate data
     */
    validator: Object.freeze(
        {
            /**
             * Check if a variable is a string
             * @param {any} variable The variable
             * @returns {boolean}
             */
            isString(variable) {
                return typeof variable === "string"
            },

            /**
             * Check if a variable is a integer
             * @param {any} variable The variable
             * @returns {boolean}
             */
            isInteger(variable) {
                return Number.isInteger(variable)
            },

            /**
             * Check if a string is empty 
             * @param {String} str The string
             * @returns {boolean}
             */
            isEmptyString(str) {
                return str === ""
            },

            /**
             * Check if a variable is a number
             * @param {any} variable The variable
             * @returns {boolean} 
             */
            isNumber(variable) {
                return typeof variable === "number" && !Number.isNaN(variable)
            },

            /**
             * Checks if a variable is a number as string
             * @param {any} variable The variable
             * @param {*} commaAsdecimalSepartor Flag to indicate comma as decimal separator
             * @returns {boolean}
             */
            isNumberAsString(variable, commaAsdecimalSepartor) {
                if (!this.isString(variable)) return false
                if (commaAsdecimalSepartor && variable.indexOf("," !== -1)) {
                    return this.isNumber(Number(variable.replace(",", ".")))
                }
                return this.isNumber(Number(variable))
            },

            /**
             * Check if a variable is an array
             * @param {any} variable The variable
             * @returns {boolean} 
             */
            isArray(variable) {
                return variable instanceof Array
            },

            /**
             * Check if a variable is an array of string
             * @param {any} variable The variable
             * @returns {boolean} 
             */
            isAnArrayOfStrings(arr) {
                if (!this.isArray()) return false
                for (let i of arr)
                    if (!typeof i === "string") return false
                return true
            },

            /**
             * Check if a variable is null
             * @param {any} variable The variable
             * @returns {boolean} 
             */
            isNull(variable) {
                return variable === null
            },

            /**
             * Check if a variable is undefined
             * @param {any} variable The variable
             * @returns {boolean} 
             */
            isUndefined(variable) {
                return variable === undefined
            }
        }
    ),

    /**
     * Object cotaining methods for create html elements dinamically
     */
    HTMLFactory: Object.freeze({    
        /**
         * Creates html paragraphys
         * @param {String | null} id The p element's id
         * @param {Array<String>} classes The p element's class(es)
         * @param {Array<String | Node>} content The content to fill the html p element
         * @returns {HTMLParagraphElement}
         */
        createHTMLPElement(id, classes, content) {
            const el = document.createElement("p")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates h1 html readings
         * @param {String | null} id The h1 element's id
         * @param {Array<String>} classes The h1 element's class(es)
         * @param {Array<String | Node>} content The content to fill the html h1 element
         * @returns {HTMLHeadingElement}
         */
        createHTMLH1Element(id, classes ,content) {
            const el = document.createElement("h1")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates h2 html readings
         * @param {String | null} id The h2 element's id
         * @param {Array<String>} classes The h2 element's class(es)
         * @param {Array<String | Node>} content The content to fill the html h2 element
         * @returns {HTMLHeadingElement}
         */
        createHTMLH2Element(id, classes, content) {
            const el = document.createElement("h2")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates h3 html readings
         * @param {String | null} id The h3 element's id
         * @param {Array<String>} classes The h3 element's class(es)
         * @param {Array<String | Node>} content The content to fill the html h3 element
         * @returns {HTMLHeadingElement}
         */
        createHTMLH3Element(id, classes, content) {
            const el = document.createElement("h3")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates h4 html readings
         * @param {String | null} id The h4 element's id
         * @param {Array<String>} classes The h4 element's class(es)
         * @param {Array<String | Node>} content The content to fill the html h4 element
         * @returns {HTMLHeadingElement}
         */
        createHTMLH4Element(id, classes, content) {
            const el = document.createElement("h4")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates html divs
         * @param {String | null} id The div element's id
         * @param {Array<String>} classes The div element's class(es)
         * @param {Array<String | Node>} content The content to fill the html div element
         * @returns {HTMLDivElement}
         */
        createHTMLDivElement(id, classes, content) {
            const el = document.createElement("div")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates html fieldsets
         * @param {String | null} id The fieldset element's id
         * @param {Array<String>} classes The fieldset element's class(es)
         * @param {Array<String | Node>} content The content to fill the html fieldset element
         * @returns {HTMLFieldSetElement}
         */
        createHTMLFieldsetElement(id, classes, content) {
            const el = document.createElement("fieldset")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates html buttons
         * @param {String | null} id The button element's id
         * @param {Array<String>} classes The button element's class(es)
         * @param {String} text The text to fill the html button element
         * @param {Function} onClick The callback function triggered on button click
         * @returns {HTMLButtonElement}
         */
        createHTMLButtonElement(id, classes, text, onClick) {
            const el = document.createElement("button")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.innerText = text
            if(typeof onClick  === "function")el.addEventListener("click", onClick)
            return el
        },

        /**
         * Creates html labels
         * @param {String | null} id The label element's id
         * @param {Array<String>} classes The label element's class(es)
         * @param {Array<String | Node>} content The content to fill the html label element
         * @returns {HTMLLabelElement}
         */
        createHTMLLabelElement(id, classes, content) {
            const el = document.createElement("fieldset")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            return el
        },

        /**
         * Creates html forms
         * @param {String | null} id The form element's id
         * @param {Array<String>} classes The form element's class(es)
         * @param {Function} onClick The callback function triggered on form submit
         * @param {Array<Node>} content The content to fill the html form element
         * @returns {HTMLFormElement}
         */
        createHTMLFormElement(id, classes, content, onSubmit) {
            const el = document.createElement("button")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            el.append(...content)
            if(typeof onSubmit  === "function")el.addEventListener("submit", onSubmit)
            return el
        },
        
        /**
         * Creates html input type text
         * @param {String | null} id The text input element's id
         * @param {Array<String>} classes The text input element's class(es)
         * @param {Function} onChange The callback function triggered when the element input value changes
         * @param {Function} onInput The callback function triggered when data is inputed in the element
         * @returns {HTMLInputElement}
         */
        createHTMLInputTypeTextElement(id, classes, value, onChange, onInput) {
            const el = document.createElement("button")
            if(id) el.id = id
            if(classes) el.classList.add(...classes)
            if(typeof onChange  === "function")el.addEventListener("change", onChange)
            if(typeof onInput  === "function")el.addEventListener("input", onInput)
            return el
        },

        /**
         * Creates html tables
         * @param {Array<Array<String>>} data A matrix of data to fill the table
         * @returns {HTMLTableElement}
         */
        createHTMLTableElement(data) {
            const table = document.createElement("table")
            const thead = document.createElement("thead")
            const tbody = document.createElement("tbody")
            let rowContainer,tag
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement("tr")
                for (const rowEl of data[i]) {
                    if( i === 0) {
                        rowContainer = thead
                        const th = document.createElement("th")
                        th.append(rowEl)
                        tr.append(th)
                        continue
                    }
                    rowContainer = tbody
                        const td = document.createElement("td")
                        td.append(rowEl)
                        tr.append(td)
                }
                rowContainer.append(tr)
                table.append(rowContainer) 
            }
            return table
        },

        /**
         * Creates html select elements
         * @param {Array<{text: String, value: String}>} data Data to fill the html select element 
         * @returns {HTMLSelectElement}
         */
        createHTMLSelectElement(data) {
            const selectEl = document.createElement("select")
            for (const item of data) {
                const optionEl = document.createElement("option")
                optionEl.innerText = item.text
                optionEl.value = item.value
                data.append(optionEl)
            }
            return selectEl
        },
    })
})