/* eslint no-param-reassign: ["error", { "props": false }] */
import store from './store';


// DOI (ISO 263242) regex
export const DOI_NUMBER_REGEX = /(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)\b/g;

// ISBN (ISO 2108) regex https://regex101.com/r/6GTPsX/1
export const ISBN_NUMBER_REGEX = /(ISBN[-]?(?:1[03])?[ ]*(?::)?[ ]*)((?:[0-9Xx][- ]?){10,13})/g;


RegExp.fromString = function(string) {
  return RegExp(string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
};

function doesNodeHrefMatch(node, regex) {
  if (typeof node.href === 'string') {
    if (node.href.match(regex) !== null) {
      return true
    }
  }
  return false
}

function formatTransformedDoi() {
  if (store.getters.isHighlighted) {
    document.getElementsByClassName('do-i-access-extension').forEach(element => {
      element.style.backgroundColor = store.getters.highlightColor
      element.style.color = store.getters.fontColor
    })
  }
}

function getDoiCount() {
  store.dispatch('setDoiCountByTabId', {
    tab_id: store.getters.currentTabId,
    doi_count: document.body.getElementsByClassName('do-i-access-extension').length
  });
}

function replaceElementContent(element, linkAlreadyCreated = false) {
  element.childNodes.forEach(node => {
    switch (node.nodeType) {
      case Node.DOCUMENT_NODE: {
        replaceElementContent(node);
      }
      case Node.ELEMENT_NODE: {
        if (node.localName !== 'script') {
          replaceElementContent(node);
        }
        return;
      }
      case Node.TEXT_NODE: {
        if (node.textContent.match(DOI_NUMBER_REGEX) !== null) {
          if (!doesNodeHrefMatch(node.parentElement, RegExp.fromString(store.getters.baseUrlByIdType['doi']))) {
            node.parentElement.innerHTML = node.parentElement.innerHTML.replace(
              DOI_NUMBER_REGEX,
              `<a target="_blank" class="do-i-access-extension" rel="noopener noreferrer" href="${store.getters.baseUrlByIdType['doi']}/$1">$1</a>`
            );
          }
        }
        // ISBN Regex
        // if (node.textContent.match(ISBN_NUMBER_REGEX) !== null) {
        //   if (!doesNodeHrefMatch(node.parentElement, RegExp.fromString(store.getters.baseUrlByIdType['isbn']))) {
        //     node.parentElement.innerHTML = node.parentElement.innerHTML.replace(
        //       ISBN_NUMBER_REGEX,
        //       `$1<a target="_blank" class="do-i-access-extension" rel="noopener noreferrer" href="${store.getters.baseUrlByIdType['isbn']}/search.php?req=$2&open=0&res=25&view=simple&phrase=1&column=identifier">$2</a>`
        //     );
        //   }
        // }
      }
    }
  });
}

store.watch(
  (state, getters) => getters.isVuexLoaded,
  () => {
    replaceElementContent(document.body, store.getters.baseUrl);
    formatTransformedDoi()
    getDoiCount()
    setTimeout(() => {
      replaceElementContent(document.body, store.getters.baseUrl);
      formatTransformedDoi()
      getDoiCount()
      setTimeout(() => {
        replaceElementContent(document.body, store.getters.baseUrl);
        formatTransformedDoi()
        getDoiCount()
        setTimeout(() => {
          replaceElementContent(document.body, store.getters.baseUrl);
          formatTransformedDoi()
          getDoiCount()
        }, 3000)
      }, 1000)
    }, 1000)
  }
);
