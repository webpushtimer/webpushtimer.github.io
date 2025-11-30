// --- PUSH NOTIFICATION LOGIC ---
self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch(e) {
            data = { title: 'Notification', body: event.data.text() };
        }
    }

    const title = data.title || 'PushTime Reminder';
    const options = {
        body: data.body || 'Your scheduled notification has arrived.',
        icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
        vibrate: [100, 50, 100]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Optional: Open the app when notification is clicked
    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// --- PWA INSTALLABILITY REQUIREMENT ---
// A fetch handler is required for PWA install prompts to trigger.
// This is a simple network-first strategy.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // Optional: return offline page here
            return new Response("Offline - Connect to internet to use PushTime");
        })
    );
});
