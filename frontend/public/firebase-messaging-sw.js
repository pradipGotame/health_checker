// No importScripts needed!
self.addEventListener("push", function (event) {
  console.log("Push event received:", event);
  const data = event.data?.json() || {};
  const title = data.notification?.title || "New Notification";
  const options = {
    body: data.notification?.body || "You have a new message!",
    icon: data.notification?.icon || "/logo192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
