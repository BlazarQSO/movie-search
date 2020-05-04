import Slider from '../slider/slider';
import imges from '../../img/default.png';

function showErrorMessage(text, translate) {
    const errorMessage = document.getElementById('error');
    if (translate) {
        errorMessage.innerHTML = `Showing results for ${text}`;
        errorMessage.classList.add('show-tranlate');
        errorMessage.classList.add('show-error');
    } else {
        if (text === 'Input text!') {
            errorMessage.innerHTML = text;
        } else {
            errorMessage.innerHTML = `No results for ${text}`;
        }
        errorMessage.classList.add('show-error');
    }
    setTimeout(() => {
        errorMessage.classList.remove('show-tranlate');
        errorMessage.classList.remove('show-error');
    }, 5000);
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
    slider.classList.remove('load');
    const buttons = document.getElementById('buttons');
    slider.innerHTML = '';
    buttons.innerHTML = '';
    const MAX_BUTTONS = 10;
    for (let i = 0; i < films.length && i < MAX_BUTTONS; i += 1) {
        buttons.append(createButton(`button${i}`));
    }
    while (films.length < 5) films.push(films[0]);

    for (let i = 0, len = films.length; i < len; i += 1) {
        const slide = document.createElement('div');
        slide.className = 'slider__slides-item';
        const link = document.createElement('a');
        link.className = 'slider__slides-link';
        link.href = films[i].href;
        link.innerHTML = films[i].title;
        link.setAttribute('target', '_blank');
        const img = document.createElement('img');
        img.src = (films[i].poster !== 'N/A') ? films[i].poster : imges;
        img.setAttribute('alt', '');

        const wrap = document.createElement('div');
        wrap.className = 'slider__slides-wrap';
        const year = document.createElement('span');
        year.className = 'slider__slides-year';
        year.innerHTML = (films[i].year !== 'N/A') ? films[i].year : '--';
        const rating = document.createElement('span');
        rating.className = 'slider__slides-rating';
        rating.innerHTML = (films[i].rank !== 'N/A') ? films[i].rank : '--';

        wrap.append(year);
        wrap.append(rating);
        slide.append(link);
        slide.append(img);
        slide.append(wrap);
        slider.append(slide);
    }
    setTimeout(() => slider.classList.add('load'), 500);
}

async function getRankingAll(ranks) {
    try {
        const urls = [];
        ranks.forEach((item) => {
            urls.push(`https://www.omdbapi.com/?i=${item}&apikey=825f3e2`);
        });

        const request = urls.map((url) => fetch(url));
        const promises = await Promise.all(request);
        const jsons = await Promise.all(promises.map((response) => response.json()));
        return Promise.resolve(jsons);
    } catch (error) {
        getRankingAll.error = error.message;
    }
    return Promise.reject(new Error('error'));
}


async function getFilmsFromPages(urlPages) {
    try {
        const request = urlPages.map((url) => fetch(url));
        const promises = await Promise.all(request);
        const jsons = await Promise.all(promises.map((response) => response.json()));
        return Promise.resolve(jsons);
    } catch (error) {
        getRankingAll.error = error.message;
    }
    return Promise.reject(new Error('error'));
}


async function getTranslate(value) {
    try {
        if (value !== '') {
            const text = (value.length > 80) ? value.slice(0, 80) : value;
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
        } else {
            showErrorMessage('Input text!');
        }
        return Promise.reject(new Error('error'));
    } catch (error) {
        getTranslate.error = error.message;
    }
    return Promise.reject(new Error('error'));
}

let slider;
function createInstanceSlider() {
    if (slider) slider.stopEvents();
    slider = null;
    slider = new Slider('containerSlides', 265, 'slider__slides-item', 'left', 'right');
    slider.initDraw();
}

export default async function getRequest(myRequest) {
    try {
        const text = document.getElementById('input').value;
        const translate = (myRequest === 'terminator') ? myRequest : await getTranslate(text);

        const films = [];
        const urlSearch = `http://www.omdbapi.com/?s=${translate}&apikey=825f3e2`;
        const responseSearch = await fetch(urlSearch);
        if (responseSearch) {
            const jsonSearch = await responseSearch.json();
            if (jsonSearch.Response !== 'False') {
                let searchFilms = jsonSearch.Search;


                const pages = Math.ceil(jsonSearch.totalResults / 10);
                const MAX_PAGES = 10;
                const urlPages = [];
                for (let i = 2; i <= pages && i <= MAX_PAGES; i += 1) {
                    urlPages.push(`http://www.omdbapi.com/?s=${translate}&page=${i}&apikey=825f3e2`);
                }
                if (urlPages.length > 0) {
                    const filmsFromPages = await getFilmsFromPages(urlPages);
                    searchFilms = searchFilms.concat(...filmsFromPages.map((item) => item.Search));
                }

                const MAX_SEARCH = 100;
                const ranks = [];

                for (let i = 0, len = searchFilms.length; i < len && i < MAX_SEARCH; i += 1) {
                    if (searchFilms[i].Type === 'movie' || searchFilms[i].Type === 'series') {
                        ranks.push(searchFilms[i].imdbID);
                        films.push({
                            title: searchFilms[i].Title,
                            href: `https://imdb.com/title/${searchFilms[i].imdbID}/videogallery`,
                            year: searchFilms[i].Year,
                            poster: searchFilms[i].Poster,
                            rank: '--',
                        });
                    }
                }
                const allRanks = await getRankingAll(ranks);
                allRanks.forEach((item, index) => { films[index].rank = (item) ? item.imdbRating : '--'; });

                showResults(films);
                if (text !== translate && myRequest !== 'terminator') {
                    showErrorMessage(translate, true);
                }
                createInstanceSlider();
            } else {
                showErrorMessage(translate, false);
            }
        }
    } catch (error) {
        getRequest.error = error.message;
    }
}
