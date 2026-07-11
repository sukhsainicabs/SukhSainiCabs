// SukhSainiCabs — booking.js
// ─────────────────────────────────────────────────────────────────────
// HOW IT WORKS (Customer side — zero hassle):
//   1. Customer fills form and clicks Submit
//   2. Form is validated
//   3. Email sent AUTOMATICALLY to owner via EmailJS (no action needed)
//   4. Customer sees a clean success screen
//   5. Customer does NOT need to open WhatsApp or do anything else
//
// HOW IT WORKS (Owner side):
//   - Booking email arrives in Sukhsainicabs@gmail.com instantly
//   - Open owner-approval.html to send approval to customer on WhatsApp/SMS
//
// ── SETUP REQUIRED (one-time, free) ────────────────────────────────
//   EmailJS lets you send emails from a static website for FREE.
//   Steps:
//   1. Go to https://www.emailjs.com — Sign up (free)
//   2. Add Email Service → connect your Gmail (Sukhsainicabs@gmail.com)
//   3. Create Email Template — use variables: {{name}}, {{phone}}, {{from}},
//      {{to}}, {{date}}, {{time}}, {{vehicle}}, {{triptype}}, {{passengers}}, {{notes}}
//   4. Copy your: PUBLIC KEY, SERVICE ID, TEMPLATE ID
//   5. Paste them in the three constants below — done!
//
//   Until you set up EmailJS, the form will open a WhatsApp message instead.
// ─────────────────────────────────────────────────────────────────────

// ── PASTE YOUR EMAILJS DETAILS HERE ──────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // from EmailJS dashboard
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
// ─────────────────────────────────────────────────────────────────────

// Owner WhatsApp (used as backup if EmailJS not set up yet)
const OWNER_WA = '918728021605';

// Check if EmailJS is configured
const EMAILJS_READY = (
  EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY' &&
  EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
);

document.addEventListener('DOMContentLoaded', () => {

  // Load EmailJS library dynamically (only if configured)
  if (EMAILJS_READY) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
    document.head.appendChild(script);
  }

  const form = document.getElementById('bookingForm');
  const btn  = document.getElementById('submitBtn');
  const succ = document.getElementById('bookingSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = g('b_name'),   phone = g('b_phone');
    const from  = g('b_from'),   to    = g('b_to');
    const date  = g('b_date'),   time  = g('b_time') || 'Not specified';
    const veh   = g('b_vehicle'), trip = g('b_triptype') || 'Not specified';
    const pax   = g('b_pax')    || 'Not specified';
    const notes = g('b_notes')  || 'None';

    if (!name || !phone || !from || !to || !date || !veh) {
      showError('Please fill all required fields (marked with *).'); return;
    }

    const fDate = fmtDate(date);

    // Disable button
    btn.disabled = true;
    btn.textContent = '⏳ Sending your request...';

    if (EMAILJS_READY) {
      // ── AUTOMATIC EMAIL via EmailJS ──────────────────────────────
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          name, phone, from, to,
          date: fDate, time, vehicle: veh,
          triptype: trip, passengers: pax, notes,
          owner_email: 'Sukhsainicabs@gmail.com'
        });
        showSuccess(phone);
      } catch (err) {
        console.error('EmailJS error:', err);
        // Fallback to WhatsApp if email fails
        openWhatsApp({ name, phone, from, to, fDate, time, veh, trip, pax, notes });
        showSuccess(phone);
      }

    } else {
      // ── FALLBACK: WhatsApp (until EmailJS is set up) ─────────────
      // This opens WhatsApp with the message pre-filled.
      // Customer needs to tap Send once in WhatsApp.
      // After EmailJS setup, this will no longer be needed.
      setTimeout(() => openWhatsApp({ name, phone, from, to, fDate, time, veh, trip, pax, notes }), 300);
      setTimeout(() => showSuccess(phone), 700);
    }
  });

  function openWhatsApp(d) {
    const msg =
`🚕 *NEW BOOKING — SukhSainiCabs*

👤 *Name:* ${d.name}
📱 *WhatsApp:* ${d.phone}
🗺️ *From:* ${d.from}
📍 *To:* ${d.to}
📅 *Date:* ${d.fDate}
🕐 *Time:* ${d.time}
🚗 *Vehicle:* ${d.veh}
🔄 *Trip Type:* ${d.trip}
👥 *Passengers:* ${d.pax}
📝 *Notes:* ${d.notes}

─────────────────────────
_Open owner-approval.html to confirm._`;
    window.open(`https://wa.me/${OWNER_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function showSuccess(phone) {
    form.style.display = 'none';
    succ.style.display = 'block';
    const sp = document.getElementById('succ_phone');
    if (sp) sp.textContent = phone;
    succ.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showError(msg) {
    btn.disabled = false; btn.textContent = '📩 Send Booking Request';
    alert(msg);
  }

  function g(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function fmtDate(s) {
    if (!s) return 'Not specified';
    const d = new Date(s);
    const D = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${D[d.getDay()]}, ${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
  }
});
