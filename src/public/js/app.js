//Localizacion de la pagina
let href = window.location.origin + window.location.pathname;


const publicVapidKey = "BIYDfW00wVkR0mxUrB2Cbl-utNcxsvbu-w9p10hoCkUfTeU3ArWTv43IwaKgZc8u2GUWkkp1qplDFfkZzKd5IrU";

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register(href + "sw.js",{
    scope: '/'
});
  console.log("Service Worker Registered...");

  if ('Notification' in window) {
    var button = document.getElementById("notifications");
    button.addEventListener('click', sendSubscriptionToBackEnd);

    async function sendSubscriptionToBackEnd() {

       // google tutorial
      const sw = await navigator.serviceWorker.ready;
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      await fetch('save_subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
      console.log("Push Registered...");

      if (Notification.permission == 'granted') {
        console.log('estoy por defecto');
        button.classList.remove('available');
      }else{
        button.classList.add('available');
      }
    }
  }
  
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}