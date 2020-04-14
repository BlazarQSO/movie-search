import './style/style.scss';
import getRequest from './components/search/search';

window.addEventListener('load', () => {
    document.getElementById('search').addEventListener('click', getRequest);
});
