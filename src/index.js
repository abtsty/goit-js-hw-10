import { fetchBreeds, fetchCatByBreed } from './cat-api';

import SlimSelect from 'slim-select';
import Notiflix, { Loading } from 'notiflix';
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
