# BRTS Ticketing - Simple Two-Page Clone

This is a minimal, static two-page demo that mimics a simple ticket-creation flow:

- `index.html` — form to enter From / To / When
- `ticket.html` — shows a QR code and a 15-minute countdown timer

How it works:

- Filling the form stores a ticket object in `sessionStorage` and navigates to `ticket.html`.
- `ticket.html` reads the data, generates a QR containing the ticket info, and starts a 15-minute timer.

UPI / Paytm QR info

- The QR generated on `ticket.html` now contains a UPI deep-link (UPI URI) compatible with Paytm and other UPI apps. The payload looks like:

  `upi://pay?pa=<merchantVpa>&pn=BRTS%20Ticket&am=<amount>&tn=<note>&cu=INR`

- You can optionally enter `Amount` and `Merchant VPA` (for example `merchant@paytm`) on the form. If `Merchant VPA` is not provided the QR will use the placeholder `merchant@paytm` — replace this with a real merchant VPA for real payments.

Run locally (recommended to use a simple HTTP server):

Powershell (Python 3 required):

```powershell
cd "C:\Users\lenovo\OneDrive\Desktop\New folder"
python -m http.server 8000
# then open http://localhost:8000/index.html in a browser
```

You can also open `index.html` directly in some browsers, but using a local server avoids cross-origin restrictions.
