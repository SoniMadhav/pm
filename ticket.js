// Root ticket JS copied from js/ticket.js
document.addEventListener('DOMContentLoaded', ()=>{
  const dataStr = sessionStorage.getItem('ticketData');
  if(!dataStr){ location.href = 'index.html'; return; }
  const ticket = JSON.parse(dataStr);

  const qrcodeEl = document.getElementById('qrcode');
  qrcodeEl.innerHTML = '';
  const size = window.innerWidth < 420 ? 240 : 320;
  const payload = `ORDER:${ticket.orderId}|AMT:${ticket.totalAmount||ticket.amount}|FROM:${ticket.from}|TO:${ticket.to}`;
  new QRCode(qrcodeEl, { text: payload, width: size, height: size });

  document.getElementById('route').textContent = `${ticket.from} → ${ticket.to}`;
  document.getElementById('passengerCount').textContent = `${ticket.passenger} Adult${ticket.passenger>1?'s':''}`;
  document.getElementById('orderId').textContent = ticket.orderId || '-';
  document.getElementById('txnId').textContent = ticket.txnId || '-';
  document.getElementById('issuedAt').textContent = new Date(ticket.issuedAt).toLocaleString();

  const validity = ticket.validityMinutes && Number(ticket.validityMinutes) ? Number(ticket.validityMinutes) : 120;
  const expiry = Number(ticket.issuedAt) + validity * 60 * 1000;

  function fmt(ms){
    const s = Math.max(0, Math.floor(ms/1000));
    const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); const sec = s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  const cd = document.getElementById('countdown');
  function tick(){
    const now = Date.now();
    if(now>=expiry){ cd.textContent='00:00:00'; clearInterval(timer); return; }
    cd.textContent = fmt(expiry-now);
  }
  tick();
  const timer = setInterval(tick,1000);
});

// Additional ticket rendering code omitted for brevity
