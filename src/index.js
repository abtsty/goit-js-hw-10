import { fetchBreeds, fetchCatByBreed } from './cat-api';

import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import 'slim-select/dist/slimselect.css';

const errorText = document.querySelector('.error');
errorText.classList.add('visually-hidden');

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

const select = new SlimSelect({
  select: breedSelect,
  settings: {
    disabled: false,
    alwaysOpen: false,
    showSearch: true,
    searchPlaceholder: 'Search',
    searchText: 'No Results',
    searchingText: 'Searching...',
    searchHighlight: false,
    closeOnSelect: true,
    contentLocation: document.body,
    contentPosition: 'absolute',
    openPosition: 'auto',
    placeholderText: 'Select cat breed',
    allowDeselect: false,
    hideSelected: false,
    showOptionTooltips: false,
  },
  events: {
    afterChange: newValue => {
      const breedId = newValue[0].value;
      if (breedId.length > 0) {
        requestStart();
        removeChildren(catInfo);
        fetchCatByBreed(breedId)
          .then(cats => renderCats(cats))
          .catch(error => handleFetchError(error));
      } else {
        catInfo.classList.add('visually-hidden');
      }
    },
  },
});

document.addEventListener('DOMContentLoaded', () => {
  requestStart();
  fetchBreeds()
    .then(breeds => renderBreeds(breeds))
    .catch(error => handleFetchError(error));
});

const renderBreeds = cats => {
  const arrSelected = [
    { text: '', placeholder: true },
    ...cats.map(cat => ({ text: cat.name, value: cat.id })),
  ];
  select.setData(arrSelected);
  requestFinish();
};

const renderCats = cats => {
  if (cats.length > 0) {
    const markup = cats
      .map(
        cat => `<div class="card-container"><div class="img-container">
                <img class="cat-img" src="${cat.url}" /></div>
                <div class="text-container">
                <h1 class="cat-title">${cat.breeds[0].name}</h1>
                <p class="cat-desc-sub">${cat.breeds[0].temperament}</p>
                <p class="cat-desc">${cat.breeds[0].description}</p></div></div>`
      )
      .join('');

    catInfo.insertAdjacentHTML('afterbegin', markup);
  } else {
    Notiflix.Notify.failure(`${errorText.textContent}`);
  }
  requestFinish();
};

const handleFetchError = error => {
  error = Notiflix.Notify.failure.failure(`${errorText.textContent}`);
  requestWrong();
};

const removeChildren = container => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const requestStart = () => {
  loader.classList.remove('visually-hidden');
  breedSelect.classList.add('visually-hidden');
  catInfo.classList.add('visually-hidden');
};

const requestFinish = () => {
  loader.classList.add('visually-hidden');
  breedSelect.classList.remove('visually-hidden');
  catInfo.classList.remove('visually-hidden');
};

const requestWrong = () => {
  loader.classList.add('visually-hidden');
  breedSelect.classList.add('visually-hidden');
  catInfo.classList.add('visually-hidden');
};
