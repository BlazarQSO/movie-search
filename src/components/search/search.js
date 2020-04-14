/* eslint-disable no-await-in-loop */

function showErrorMessage(text) {
    const errorMessage = document.getElementById('error');
    errorMessage.innerHTML = `Search Error: ${text}`;
    errorMessage.classList.add('show-error');
    setTimeout(() => errorMessage.classList.remove('show-error'), 4000);
}

function showResults(films) {
    const slider = document.getElementById('containerSlides');
    slider.innerHTML = '';
    for (let i = 0, len = films.length; i < len; i += 1) {
        const slide = document.createElement('div');
        slide.className = 'slider__slides-item';
        slide.id = `slide${i}`;
        const link = document.createElement('a');
        link.className = 'slider__slides-link';
        link.id = `link${i}`;
        link.innerHTML = films[i].title;
        const img = document.createElement('img');
        img.id = `img${i}`;
        img.src = films[i].poster;

        const wrap = document.createElement('div');
        wrap.className = 'slider__slides-wrap';
        const year = document.createElement('span');
        year.className = 'slider__slides-year';
        year.id = `year${i}`;
        year.innerHTML = films[i].year;
        const rating = document.createElement('span');
        rating.className = 'slider__slides-rating';
        rating.id = `rank${i}`;
        rating.innerHTML = films[i].rank;

        wrap.append(year);
        wrap.append(rating);
        slide.append(link);
        slide.append(img);
        slide.append(wrap);
        slider.append(slide);
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
        this.errorGetRanking = error.message;
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
        this.errorgetTranslate = error.message;
    }
    return Promise.reject(new Error('error'));
}

export default async function getRequest() {
    try {
        const translate = await getTranslate();

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
                        year: searchFilms[i].Year,
                        poster: searchFilms[i].Poster,
                        rank: ranking,
                    });
                }
                showResults(films);
            } else {
                showErrorMessage(translate);
            }
        }
        document.getElementById('rating').innerHTML = `${films[0].rank} ${films[0].year}`;
    } catch (error) {
        this.errorGetRequest = error.message;
    }
}
