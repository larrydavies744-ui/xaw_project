const endpoint = process.argv[2];
if (!endpoint) throw new Error('WebSocket debugger endpoint is required.');

const socket = new WebSocket(endpoint);
const timeout = setTimeout(() => {
  console.error('Timed out waiting for the customer app renderer.');
  process.exit(1);
}, 15000);

socket.addEventListener('open', () => {
  const expression = `(async () => {
    const results = [];
    const buttons = [...document.querySelectorAll('.horizontal-nav-tabs button')]
      .filter((button) => button.id !== 'xpressive-service-library-tab');
    for (const button of buttons.slice(0, 8)) {
      const label = button.innerText.trim();
      const started = performance.now();
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 200));
      results.push({
        label,
        active: document.querySelector('.view-stage')?.dataset.activePage || '',
        elapsedMs: Math.round(performance.now() - started)
      });
    }
    return results;
  })()`;
  socket.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression, awaitPromise: true, returnByValue: true }
  }));
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id !== 1) return;
  clearTimeout(timeout);
  if (message.result?.exceptionDetails) {
    console.error(JSON.stringify(message.result.exceptionDetails));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify(message.result?.result?.value || [], null, 2));
  }
  socket.close();
});

socket.addEventListener('error', (error) => {
  clearTimeout(timeout);
  console.error(error);
  process.exit(1);
});
