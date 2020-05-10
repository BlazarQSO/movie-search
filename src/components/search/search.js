import Slider from '../slider/slider';
import imges from '../../img/default.png';
import { movies } from './moviesList';

function showErrorMessage(text, translate) {
    const errorMessage = document.getElementById('error');
    if (translate) {
        errorMessage.innerHTML = `Showing results for <span>"${text}"</span>`;
        errorMessage.classList.add('show-translate');
        errorMessage.classList.add('show-error');
    } else {
        if (text === 'Input text!' || text === 'Something went wrong!') {
            errorMessage.innerHTML = text;
        } else {
            errorMessage.innerHTML = `No results were found for <span>"${text}"</span>`;
        }
        errorMessage.classList.add('show-error');
    }
    document.getElementById('input').classList.remove('loading');
    setTimeout(() => {
        errorMessage.classList.remove('show-translate');
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

let slider;
function createInstanceSlider() {
    if (slider) slider.stopEvents();
    slider = null;
    const WIDTH_SLIDE = 265;
    slider = new Slider('containerSlides', WIDTH_SLIDE, 'slider__slides-item', 'left', 'right');
    slider.initDraw();
}

function onloadImg(loadImg, index) {
    const img = document.createElement('img');
    img.onerror = () => {
        const src = '../../img/default.png';
        slider.slider[index] = slider.slider[index].replace(img.src, src);
        if (index < slider.visibleMaxSlides * 2) {
            document.getElementById('containerSlides')
                .children[index + slider.visibleSlides].children[1].src = src;
            if (slider.visibleMaxSlides >= slider.length) {
                document.getElementById('containerSlides')
                    .children[index].children[1].src = src;
                document.getElementById('containerSlides')
                    .children[index + 2 * slider.length].children[1].src = src;
            }
        }
    };
    img.src = (loadImg !== 'N/A') ? loadImg : imges;
    img.setAttribute('alt', 'image not found');
    return img;
}

function showResults(films) {
    const createSlider = document.getElementById('containerSlides');
    createSlider.classList.remove('load');
    const buttons = document.getElementById('buttons');
    createSlider.innerHTML = '';
    buttons.innerHTML = '';
    const MAX_BUTTONS = 10;
    for (let i = 0; i < films.length && i < MAX_BUTTONS; i += 1) {
        buttons.append(createButton(`button${i}`));
    }

    for (let i = 0, len = films.length; i < len; i += 1) {
        const slide = document.createElement('div');
        slide.className = 'slider__slides-item';
        const link = document.createElement('a');
        link.className = 'slider__slides-link';
        link.href = films[i].href;
        link.innerHTML = films[i].title;
        link.setAttribute('target', '_blank');
        const img = onloadImg(films[i].poster, i);

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
        createSlider.append(slide);
    }

    setTimeout(() => {
        document.getElementById('input').classList.remove('loading');
        createSlider.classList.add('load');
    }, 1000);
}

async function getRankingAll(ranks) {
    try {
        const urls = [];
        ranks.forEach((item) => {
            urls.push(`https://www.omdbapi.com/?i=${item}&apikey=3167cb24`);
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
        getFilmsFromPages.error = error.message;
    }
    return Promise.reject(new Error('error'));
}

async function getTranslate(value) {
    try {
        if (value !== '' && !value.match(/^-{0,1}\d+$/)) {
            const MAX_LENGTH = 80;
            const text = (value.length > MAX_LENGTH) ? value.slice(0, MAX_LENGTH) : value;
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
            if (value === '') showErrorMessage('Input text!');
            return Promise.resolve(value);
        }
        return Promise.reject(new Error('error'));
    } catch (error) {
        getTranslate.error = error.message;
    }
    return Promise.reject(new Error('error'));
}

async function getListFilms(jsonSearch, translate) {
    let searchFilms = jsonSearch.Search;

    const MAX_PAGES = 10;
    const pages = Math.ceil(jsonSearch.totalResults / MAX_PAGES);
    const urlPages = [];
    for (let i = 2; i <= pages && i <= MAX_PAGES; i += 1) {
        urlPages.push(`http://www.omdbapi.com/?s=${translate}&page=${i}&apikey=3167cb24`);
    }
    if (urlPages.length > 0) {
        const filmsFromPages = await getFilmsFromPages(urlPages);
        searchFilms = searchFilms.concat(...filmsFromPages.map((item) => item.Search));
    }
    return Promise.resolve(searchFilms);
}

function createFilmsList(searchFilms) {
    const films = [];
    const ranks = [];
    const MAX_SEARCH = 100;

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
    return [ranks, films];
}

export default async function getRequest(myRequest) {
    try {
        document.getElementById('input').classList.add('loading');
        const text = document.getElementById('input').value.trim();
        const translate = (myRequest === 'terminator') ? myRequest : await getTranslate(text);

        const urlSearch = `http://www.omdbapi.com/?s=${translate}&apikey=3167cb24`;
        const responseSearch = await fetch(urlSearch);

        if (responseSearch) {
            const jsonSearch = await responseSearch.json();
            if (jsonSearch.Response !== 'False') {
                const searchFilms = await getListFilms(jsonSearch, translate);

                const [ranks, films] = createFilmsList(searchFilms);
                const allRanks = await getRankingAll(ranks);
                allRanks.forEach((item, index) => { films[index].rank = (item) ? item.imdbRating : '--'; });

                showResults(films);
                if (text !== translate && myRequest !== 'terminator') {
                    showErrorMessage(translate, true);
                }
                createInstanceSlider();
            } else if (jsonSearch.Error === 'Request limit reached!') {
                showResults(movies);
                createInstanceSlider();
                showErrorMessage(jsonSearch.Error, false);
            } else if (text !== '') {
                if (jsonSearch.Error && jsonSearch.Error !== 'Movie not found!') {
                    showErrorMessage(jsonSearch.Error, false);
                } else {
                    showErrorMessage(translate, false);
                }
            }
        }
    } catch (error) {
        getRequest.error = error.message;
    }
}
