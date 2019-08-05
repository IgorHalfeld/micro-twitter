(() => {
  'use strict';

  const $ = element => document.querySelector(element);

  const loadComponent = async component => {
    const res = await fetch(`/components/${component}.html`);
    return await res.text();
  };

  const attachTweetToDom = tweetComponent => {
    const content = $('#content');
    const div = document.createElement('div');
    div.innerHTML = tweetComponent;
    content.insertBefore(div, content.childNodes[2]);
  };

  const parseDate = dateString => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString()}`
  };

  const cleanUpTweetInput = () => {
    const tweetText = $('#tweetText');
    tweetText.value = '';
    tweetText.blur();
  };

  const getValues = () => ({
    tweet: $('#tweetText').value,
  });

  const toggleDisableButton = () => {
    const { tweet } = getValues();
    (tweet && tweet.length)
      ? $('#tweetButton').disabled = ''
      : $('#tweetButton').disabled = 'disabled';
  };

  const publishTweet = async () => {
    const {
      tweet,
      publishAt = new Date().toISOString(),
    } = getValues();
    const widget = await loadComponent('widget');
    const tweetComponent = widget
      .replace('{{text}}', tweet)
      .replace('{{date}}', parseDate(publishAt));
    
    attachTweetToDom(tweetComponent);
    cleanUpTweetInput();
  };

  const addEventListeners = () => {
    const tweetText = $('#tweetText');
    const tweetButton = $('#tweetButton');

    tweetText.addEventListener('keyup', toggleDisableButton);
    tweetButton.addEventListener('click', publishTweet);

    tweetText.focus();
  };
  
  addEventListeners();
  toggleDisableButton();
})();