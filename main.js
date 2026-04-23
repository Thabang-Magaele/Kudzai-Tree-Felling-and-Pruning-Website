

(function () {
  'use strict';

  /* ─── WhatsApp number ─────────────────────────────────── */
  const WA_NUMBER = '27769383950';

  /* ─── Helpers ─────────────────────────────────────────── */

  /**
   * Zero-pad a number to 2 digits.
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Return a human-readable timestamp: e.g. "Thursday, 24 April 2026 at 09:15"
   * @returns {string}
   */
  function timestamp() {
    const d = new Date();
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return (
      days[d.getDay()] + ', ' +
      d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() +
      ' at ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
    );
  }

  /**
   * Generate a short reference number: KTF-YYYYMMDD-XXXX
   * @returns {string}
   */
  function refNumber() {
    const d = new Date();
    const datePart =
      String(d.getFullYear()) +
      pad(d.getMonth() + 1) +
      pad(d.getDate());
    const rand = Math.floor(1000 + Math.random() * 9000);
    return 'KTF-' + datePart + '-' + rand;
  }

  /**
   * Build the full WhatsApp message body from form data.
   * @param {Object} fields
   * @param {string} fields.name
   * @param {string} fields.phone
   * @param {string} [fields.email]
   * @param {string} [fields.service]
   * @param {string} [fields.area]
   * @param {string} fields.message
   * @returns {string}
   */
  function buildReceipt(fields) {
    const ref = refNumber();
    const ts  = timestamp();

    const divider = '━━━━━━━━━━━━━━━━━━━━━━━━';

    let lines = [];

    lines.push('🌿 *KUDZAI TREE FELLING & PRUNING*');
    lines.push('_Quote Request Receipt_');
    lines.push(divider);

    lines.push('');
    lines.push('📋 *Reference:* ' + ref);
    lines.push('🕐 *Submitted:* ' + ts);

    lines.push('');
    lines.push(divider);
    lines.push('👤 *CONTACT DETAILS*');
    lines.push(divider);

    lines.push('*Name:* ' + fields.name);
    lines.push('*Phone:* ' + fields.phone);
    if (fields.email && fields.email.trim()) {
      lines.push('*Email:* ' + fields.email.trim());
    }
    if (fields.area && fields.area.trim()) {
      lines.push('*Area:* ' + fields.area.trim());
    }

    lines.push('');
    lines.push(divider);
    lines.push('🪓 *JOB DETAILS*');
    lines.push(divider);

    if (fields.service && fields.service.trim()) {
      lines.push('*Service Required:* ' + fields.service.trim());
    } else {
      lines.push('*Service Required:* Not specified');
    }

    lines.push('');
    lines.push('*Description:*');
    lines.push(fields.message.trim());

    lines.push('');
    lines.push(divider);
    lines.push('✅ We will get back to you within *1 working day*.');
    lines.push('📞 076 938 3950  |  📍 White River, Mpumalanga');
    lines.push(divider);

    return lines.join('\n');
  }

  /**
   * Open WhatsApp with the pre-filled message.
   * @param {Object} fields
   */
  function sendToWhatsApp(fields) {
    const text = buildReceipt(fields);
    const url  = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ─── Field reader ────────────────────────────────────── */

  /**
   * Safely get the trimmed value of an element by ID.
   * Returns empty string if the element doesn't exist.
   * @param {string} id
   * @returns {string}
   */
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ─── Form registrations ──────────────────────────────── */

  /**
   * Register a submit handler on a form if it exists on the current page.
   * @param {string} formId        — the <form> id
   * @param {Function} fieldReader — returns an object with the field values
   */
  function registerForm(formId, fieldReader) {
    const form = document.getElementById(formId);
    if (!form) return; // form not present on this page

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const fields = fieldReader();
      // Basic guard — name and phone are always required
      if (!fields.name || !fields.phone || !fields.message) return;
      sendToWhatsApp(fields);
    });
  }

  /* ── Home page form  (index.html) ──────────────────────── */
  registerForm('quote-form-home', function () {
    return {
      name:    val('h-name'),
      phone:   val('h-phone'),
      service: val('h-service'),
      message: val('h-message'),
    };
  });

  /* ── About page form  (about.html) ─────────────────────── */
  registerForm('quote-form-about', function () {
    return {
      name:    val('a-name'),
      phone:   val('a-phone'),
      service: val('a-service'),
      message: val('a-message'),
    };
  });

  /* ── Services page form  (services.html) ───────────────── */
  registerForm('quote-form-services', function () {
    return {
      name:    val('s-name'),
      phone:   val('s-phone'),
      service: val('s-service'),
      message: val('s-message'),
    };
  });

  /* ── Contact page form  (contact.html) ─────────────────── */
  registerForm('quote-form-contact', function () {
    return {
      name:    val('c-name'),
      phone:   val('c-phone'),
      service: val('c-service'),
      area:    val('c-area'),
      message: val('c-message'),
    };
  });

})();