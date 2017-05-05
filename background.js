/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      outerBounds: {
        maxWidth: 400, 
        maxHeight: 200
      },
      innerBounds: {
        minWidth: 200,
        minHeight: 120
      }
    }
  );
  
});