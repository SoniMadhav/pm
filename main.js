// Root main JS copied from js/main.js
// Single-page app JS: handle form, render ticket, QR, countdown
document.addEventListener('DOMContentLoaded', () => {
  const $ = (id)=>document.getElementById(id);
  const fromEl = $('from');
  const toEl = $('to');
  const amountEl = $('amount');
  const passengerEl = $('passenger');
  const validityEl = $('validity');
  const buyBtn = $('buyBtn');
  const btnAmount = $('btnAmount');
  const summaryRoute = $('summaryRoute');
  const summaryPax = $('summaryPax');
  const summaryAmount = $('summaryAmount');
  const purchaseView = $('purchaseView');
  const ticketView = $('ticketView');
  const qrcodeEl = $('qrcode');
  const routeLabel = $('route');
  const passengerCount = $('passengerCount');
  const orderIdEl = $('orderId');
  const txnIdEl = $('txnId');
  const countdownEl = $('countdown');
  const backBtn = $('back');

  function computeTotal(){
    const a = parseFloat(amountEl.value);
    const pax = parseInt(passengerEl.value)||1;
    const per = (!isNaN(a) && a>0)? a : 20;
    return Math.round(per * pax * 100)/100;
  }

  function updateSummary(){
    const total = computeTotal();
    btnAmount.textContent = total;
    summaryPax.textContent = passengerEl.value + ' Adult'+(parseInt(passengerEl.value)>1?'s':'');
    summaryAmount.textContent = '₹' + total;
    const routeText = (fromEl.value && toEl.value) ? `${fromEl.value} → ${toEl.value}` : '—';
    summaryRoute.textContent = routeText;
    buyBtn.disabled = !(fromEl.value.trim() && toEl.value.trim() && total>0);
  }

  [fromEl,toEl,amountEl,passengerEl,validityEl].forEach(el => el && el.addEventListener('input', updateSummary));
  updateSummary();

  function makeId(prefix='ORD'){
    return prefix + Date.now().toString().slice(-8) + Math.floor(Math.random()*900+100);
  }

  function renderTicket(ticket){
    // show ticket view
    purchaseView.style.display = 'none';
    ticketView.style.display = 'block';
    ticketView.setAttribute('aria-hidden','false');
    routeLabel.textContent = `${ticket.from} → ${ticket.to}`;
    passengerCount.textContent = ticket.passenger + ' Adult' + (ticket.passenger>1?'s':'');
    orderIdEl.textContent = ticket.orderId;
    txnIdEl.textContent = ticket.txnId;

    // populate additional details
    const fareEl = document.getElementById('fareDisplay');
    const issuedEl = document.getElementById('issuedAtSmall');
    const validityElDisp = document.getElementById('validityDisplay');
    const whenEl = document.getElementById('whenDisplay');
    const orderItemEl = document.getElementById('orderItemId');
    if(fareEl) fareEl.textContent = '₹' + (ticket.totalAmount || ticket.amount || '0');
    if(issuedEl) issuedEl.textContent = new Date(ticket.issuedAt).toLocaleString();
    if(validityElDisp) validityElDisp.textContent = (ticket.validityMinutes ? ticket.validityMinutes + ' min' : '120 min');
    if(whenEl) whenEl.textContent = ticket.when ? new Date(ticket.when).toLocaleString() : '-';
    if(orderItemEl) orderItemEl.textContent = ticket.orderItemId || '-';

    // QR: create UPI-style payload for demo
    qrcodeEl.innerHTML = '';
    const upi = `upi://pay?pa=merchant@paytm&pn=Paytm%20Ticket&am=${encodeURIComponent(ticket.totalAmount)}&cu=INR&tn=${encodeURIComponent('Order:'+ticket.orderId)}`;
    new QRCode(qrcodeEl, { text: upi, width: 260, height: 260 });

    // countdown
    const validityMinutes = ticket.validityMinutes || 120;
    const expiry = Date.now() + validityMinutes*60*1000;
    function fmt(ms){const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);const sec=s%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`}
    let timer = setInterval(()=>{
      const rem = expiry - Date.now();
      if(rem<=0){ countdownEl.textContent='00:00:00'; clearInterval(timer); document.getElementById('status').textContent='TICKET EXPIRED'; return; }
      countdownEl.textContent = fmt(rem);
    },1000);
  }

  buyBtn.addEventListener('click', ()=>{
    if(buyBtn.disabled) return;
    const ticket = {
      from: fromEl.value.trim(),
      to: toEl.value.trim(),
      passenger: parseInt(passengerEl.value)||1,
      when: document.getElementById('when').value || new Date().toISOString(),
      amount: amountEl.value || '20',
      totalAmount: String(computeTotal()),
      issuedAt: Date.now(),
      orderId: makeId('ORD'),
      orderItemId: makeId('ITEM'),
      txnId: makeId('TXN'),
      validityMinutes: parseInt(validityEl.value)||120
    };
    // render inline ticket (no navigation)
    renderTicket(ticket);
  });

  backBtn.addEventListener('click', ()=>{
    ticketView.style.display='none';
    ticketView.setAttribute('aria-hidden','true');
    purchaseView.style.display='grid';
  });
});