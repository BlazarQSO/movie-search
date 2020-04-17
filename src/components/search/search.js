/* eslint-disable no-await-in-loop */
import Slider from '../slider/slider';
import imges from '../../img/default.png';

function showErrorMessage(text) {
    const errorMessage = document.getElementById('error');
    errorMessage.innerHTML = `No results for ${text}`;
    errorMessage.classList.add('show-error');
    setTimeout(() => errorMessage.classList.remove('show-error'), 3000);
}

function createButton(id) {
    const button = document.createElement('button');
    button.className = 'buttons__item';
    button.id = id;
    if (id === 'button0') {
        button.classList.add('buttons__item-check');
    }
    return button;
}

function showResults(films) {
    const slider = document.getElementById('containerSlides');
    const buttons = document.getElementById('buttons');
    slider.innerHTML = '';
    buttons.innerHTML = '';
    while (films.length < 5) films.push(films[0]);

    for (let i = 0, len = films.length; i < len; i += 1) {
        const slide = document.createElement('div');
        slide.className = 'slider__slides-item';
        const link = document.createElement('a');
        link.className = 'slider__slides-link';
        link.href = films[i].href;
        link.innerHTML = films[i].title;
        const img = document.createElement('img');
        img.src = (films[i].poster !== 'N/A') ? films[i].poster : imges;
        img.setAttribute('alt', '');

        const wrap = document.createElement('div');
        wrap.className = 'slider__slides-wrap';
        const year = document.createElement('span');
        year.className = 'slider__slides-year';
        year.innerHTML = films[i].year;
        const rating = document.createElement('span');
        rating.className = 'slider__slides-rating';
        rating.innerHTML = films[i].rank;

        wrap.append(year);
        wrap.append(rating);
        slide.append(link);
        slide.append(img);
        slide.append(wrap);
        slider.append(slide);
        buttons.append(createButton(`button${i}`));
    }
}

async function getRanking(imdbID) {
    try {
        const urlRank = `https://www.omdbapi.com/?i=${imdbID}&apikey=825f3e2`;
        const responseRank = await fetch(urlRank);
        if (responseRank.Response !== 'False') {
            const jsonRank = await responseRank.json();
            if (jsonRank.Response !== 'False') {
                return Promise.resolve(jsonRank.imdbRating);
            }
            return Promise.resolve('-');
        }
    } catch (error) {
        getRanking.error = error.message;
    }
    return Promise.reject(new Error('error'));
}

async function getTranslate() {
    try {
        const text = document.getElementById('input').value;
        const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200414T065147Z.a71577dc7e766811.2ac9a58088466495232d9a8fdb280040dbb99bd2&text=${text}&lang=ru-en`;
        const response = await fetch(urlTranslate);
        if (response.statusText !== 'Bad Request') {
            const json = await response.json();
            if (json) {
                return Promise.resolve(json.text[0]);
            }
        } else {
            showErrorMessage(text);
        }
        return Promise.reject(new Error('error'));
    } catch (error) {
        getTranslate.error = error.message;
    }
    return Promise.reject(new Error('error'));
}


// function buttonClick(e, slider) {
//     if (e.target.tagName === 'BUTTON') {
//         if (!e.target.classList.contains('buttons__item-check')) {
//             slider.buttonClick(+e.target.id.replace('button', ''));
//         }
//     }
// }

let slider;
function createInstanceSlider() {
    // const rightBtn = document.getElementById('right');
    // const leftBtn = document.getElementById('left');
    // slider = new Slider('containerSlides', 265, 'slider__slides-item', leftBtn, rightBtn);
    // rightBtn.onclick = slider.moveRight.bind(slider);
    // leftBtn.onclick = slider.moveLeft.bind(slider);
    // document.getElementById('buttons').onclick = (e) => buttonClick(e, slider);
    if (slider) slider.stopEvents();
    slider = null;
    slider = new Slider('containerSlides', 265, 'slider__slides-item', 'left', 'right');
    slider.initDraw();
}

export default async function getRequest(myRequest) {
    try {
        const translate = (myRequest === 'terminator') ? myRequest : await getTranslate();

        // getFilms()
        //     .then((res) => { translate = res; })
        //     .catch((err) => { this.getRequest.error = err; });

        const films = [];
        const urlSearch = `http://www.omdbapi.com/?s=${translate}&apikey=825f3e2`;
        const responseSearch = await fetch(urlSearch);
        if (responseSearch) {
            const jsonSearch = await responseSearch.json();
            if (jsonSearch.Response !== 'False') {
                const searchFilms = jsonSearch.Search;

                const MAX_SEARCH_ITEM = 10;
                for (let i = 0, len = searchFilms.length; i < len && i < MAX_SEARCH_ITEM; i += 1) {
                    const { imdbID } = searchFilms[i];
                    const ranking = await getRanking(imdbID);
                    // .then((res) => { ranking = res; })
                    // .catch((err) => { this.getRequest.error = err; });
                    films.push({
                        title: searchFilms[i].Title,
                        href: `https://imdb.com/title/${imdbID}/videogallery`,
                        year: searchFilms[i].Year,
                        poster: searchFilms[i].Poster,
                        rank: ranking,
                    });
                }
                showResults(films);
                createInstanceSlider();
            } else {
                showErrorMessage(translate);
            }
        }
    } catch (error) {
        getRequest.error = error.message;
    }
}
