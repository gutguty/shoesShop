import {showErrorMessageForm} from "./utils.js";

class Form {
    selectors = {
        root: '[data-js-form]',
        steps: ['[data-js-step1]', '[data-js-step2]',
        '[data-js-step3]','[data-js-step4]'],
        nextButton: '[data-js-next-button]',
        submitButton: '[data-js-submit-button]',
        phoneContent: '[data-js-phone-content]',
        mail: '[data-js-email]'
    }

    constructor() {
        this.root = document.querySelector(this.selectors.root);
        this.stepsElement = this.selectors.steps.map(selector => this.root.querySelector(selector));
        this.nextButtonElement = Array.from(this.root.querySelectorAll(this.selectors.nextButton));
        this.submitButtonElement = this.root.querySelector(this.selectors.submitButton);
        this.phoneContentElement = this.root.querySelector(this.selectors.phoneContent);
        this.currentStep = 0;
        this.addEventListeners();
        this.showCurrentStep();
    }

    addEventListeners() {
        this.nextButtonElement.forEach(button => {
            button.addEventListener('click',this.nextClick.bind(this));
        });

        if (this.submitButtonElement) {
            this.submitButtonElement.addEventListener('click',this.onSubmit.bind(this));
        }
    }

    nextClick(event) {
        event.preventDefault();

        if(!this.checkCurrentStep()) {
            showErrorMessageForm("Please continue the form",this.currentStep);
            return;
        }

        this.currentStep++;
        this.showCurrentStep();
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.checkCurrentStep()) {
            showErrorMessageForm("Please continue the form",this.currentStep);
            return;
        }
        if(this.submitButtonElement) {
            this.submitButtonElement.disabled = true;
            this.submitButtonElement.classList.add('disabled');
        }
        if (this.phoneContentElement) {
            this.phoneContentElement.style.display = 'block';

            setTimeout(() => {
                this.phoneContentElement.classList.add('show');
            },10);
        }
        console.log('Форма отправлена!');
    }

    checkCurrentStep()  {
        const currentStepElement = this.stepsElement[this.currentStep];

        switch(this.currentStep) {
            case 0:
            case 1:
                return currentStepElement.querySelectorAll('input[type="checkbox"]:checked').length > 0;
            case 2:
                return currentStepElement.querySelector('textarea').value.trim() !== '';
            case 3:
                const emailElement = currentStepElement.querySelector(this.selectors.mail).value.trim();
                return emailElement !== '' && emailElement.includes('@');
            default:
                return true;
        }
    }
    showCurrentStep() {
        this.stepsElement.forEach((step,index) => {
           step.classList.toggle('active',index === this.currentStep);
        });
    }

}

export default Form;