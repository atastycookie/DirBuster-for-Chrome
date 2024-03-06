const checkBtn = document.getElementById('check-btn');
const settingsBtn = document.getElementById('settings-btn');
const resultsDiv = document.getElementById('results');
const pathToDirbInput = document.getElementById('path-to-dirbust');

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const url = new URL(tab.url);

  const protocol = url.protocol;
  const domain = url.hostname;

  const dirbPath = `${protocol}//${domain}`
  pathToDirbInput.value = dirbPath;

  checkBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['paths', 'maxWait', 'useSleep'], (result) => {
      const paths = result.paths || [];
      const maxWait = result.maxWait || 5000;
      const useSleep = result.useSleep || true;

      const urls = paths.map((path) => `${pathToDirbInput.value.replace(/\/+$/, '')}${path}`);
      const requests = urls.map((url) => new XMLHttpRequest());
      
      requests.forEach((request, index) => {
        const path = paths[index];
        const pageUrl = `${pathToDirbInput.value.replace(/\/+$/, '')}${path}`;
      
        request.onreadystatechange = function() {
          if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 0 || (request.status >= 200 && request.status < 400)) {
              resultsDiv.innerHTML += `- <a href="${pageUrl}" target="_blank">${pageUrl}</a> <font color="green"><b>exists</b></font><br>`;
            } else {
              resultsDiv.innerHTML += `- <a href="${pageUrl}" target="_blank">${pageUrl}</a> <font color="red">does not exist</font><br>`;
            }
          }
        };
      
        const timeoutId = setTimeout(() => {
          request.abort();
        }, maxWait);
        
        const delay = Math.floor(Math.random() * 4000) + 1000;
        setTimeout(() => {
          request.open('GET', pageUrl, true);
          request.send();
        }, delay);
      
        function cleanup() {
          setTimeout(timeoutId);
        }
      
        request.addEventListener('loadend', cleanup);
        request.addEventListener('error', cleanup);
      });
            
    });
  });

  settingsBtn.addEventListener('click', () => {
    window.open(chrome.runtime.getURL('options.html'));
  });

});
