export class Form {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;
        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^(?!.*\.\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: "lastName",
                    id: "last-name",
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                }
            );
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateFields.call(that, item, this);
            }
        })

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

        if (this.page === 'signup') {
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
        }
    }

    validateFields(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }


    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }


    async processForm() {
        if (this.validateForm()) {
            if (this.page === 'signup') {
                const result = await fetch('http://localhost:3003/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.fields.find(item => item.name === 'name').element.value
                    })
                })
            } else {

            }


            let paramString = '';
            this.fields.forEach(item => {
                paramString += (!paramString ? '?' : '&') + item.name + '=' + item.element.value;
            })

            location.href = '#/choice' + paramString;
        }
    }
}

