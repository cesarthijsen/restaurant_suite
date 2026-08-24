# Restaurant POS demo PWA

This PWA is intentionally **demo-only**. Saved orders remain in the tablet browser and do not create ERPNext invoices, stock movements, loyalty entries, or bank charges.

## Required Nginx route

The service worker must be served from the site root so it can control Desk routes. Add this exact location inside the HTTPS server block for the restaurant domain, before the general `location /` block:

```nginx
location = /restaurant-pos-sw.js {
    proxy_pass http://127.0.0.1:8080/assets/restaurant_suite/js/restaurant_pos_sw.js;
    proxy_set_header Host $host;
    add_header Service-Worker-Allowed "/desk/" always;
    add_header Cache-Control "no-cache" always;
}
```

Validate and reload Nginx after editing:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Prepare the tablet

1. Open `https://haagendazs.ttsaua.com/desk/restaurant-pos?mode=demo` while online.
2. Unlock the POS once so the menu and required assets are cached.
3. On iPad Safari, tap **Share → Add to Home Screen**.
4. Launch the new Restaurant POS icon.
5. Test airplane mode only after the initial online preparation.

## Demo safeguards

- Cash demo orders can be saved online or offline.
- ATM/Card demo orders are blocked while offline.
- Every completion dialog clearly states that it is not a real transaction.
- **Reset Demo** deletes locally saved demo orders and clears the cart.
- The kiosk class hides the Desk side navigation only while the POS page is open.

## Current offline boundary

An already prepared tablet can reopen the cached POS and use its cached menu. Employee authentication and other server APIs still require connectivity unless the cashier session remains available. Production offline synchronization will be connected to the real checkout API in a later phase.
