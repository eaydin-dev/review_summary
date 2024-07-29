function getLanguage() {
  let language = chrome.i18n.getUILanguage();
  if (language === 'en' || language.includes('en-')) {
    return 'en';
  } else if (language === 'tr') {
    return 'tr';
  } else {
    return 'en';
  }
}