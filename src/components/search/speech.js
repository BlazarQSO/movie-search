import getRequest from './search';

export default class Speech {
    constructor(input, button, changeLang = 'selectLang') {
        this.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        this.initRecognition();
        this.input = input;
        this.button = button;
        this.changeLang = changeLang;
    }

    initRecognition() {
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
        this.recognition.lang = 'ru-RU';

        this.recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            this.input.value = text;
            getRequest();
        };
    }

    speech() {
        this.input.innerHTML = '';
        this.button.classList.add('clicked');
        this.recognition.onend = () => this.recognition.start();
        this.recognition.start();
    }

    restart() {
        this.input.innerHTML = '';
        if (this.recognition) {
            this.recognition.onend = null;
            this.recognition.stop();
            this.button.classList.remove('clicked');
        }
    }

    eventButtonSpeech() {
        if (this.recognition && !this.button.classList.contains('clicked')) {
            this.speech();
            this.button.classList.add('speech');
        } else {
            this.restart();
            this.button.classList.remove('speech');
        }
    }
}
