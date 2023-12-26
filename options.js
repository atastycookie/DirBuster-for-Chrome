const pathsInput = document.getElementById('paths');
const maxWaitInput = document.getElementById('maxWait');
const useSleepInput = document.getElementById('useSleep');

const defaultPaths = ['/.git/config', '/server-status', '/adminer.php', '/admin'];
const defaultMaxWait = 1000;
const defaultUseSleep = true;

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const paths = pathsInput.value.split('\n').map((path) => path.trim()).filter((path) => path !== '');
  const maxWait = Number(maxWaitInput.value);
  const useSleep = useSleepInput.checked;

  if (isNaN(maxWait) || maxWait < 1 || maxWait > 5000) {
    alert('Max wait time must be a number between 1 and 5000');
    return;
  }

  chrome.storage.sync.set({ paths, maxWait, useSleep }, () => {
    alert('Settings saved');
  });
});

chrome.storage.sync.get(['paths', 'useSleep', 'maxWait'], (result) => {
  pathsInput.value = result.paths ? result.paths.join('\n') : defaultPaths.join('\n');
  maxWaitInput.value = result.maxWait || defaultMaxWait;
  useSleepInput.checked = result.useSleep || defaultUseSleep;
});
