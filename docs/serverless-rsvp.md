# Serverless RSVP Integration Guide

This guide provides ready-to-deploy examples for connecting the engagement invitation RSVP form to a serverless backend.

The RSVP client sends a JSON `POST` request with the following schema:

```json
{
  "fullName": "Zayd & Hira Tariq",
  "guestCount": 3,
  "eventAttendance": {
    "dholki": true,
    "mangni": true,
    "dinner": false
  },
  "duaNote": "Heartiest congratulations and warmest prayers!",
  "honeypot": "",
  "submittedAt": "2026-10-23T18:00:00.000Z"
}
```

---

## Option 1: Cloudflare Worker

Deploy as a free Cloudflare Worker. You can store RSVPs into Cloudflare D1 (SQL), KV, or forward directly to an email / Telegram / WhatsApp bot.

```javascript
export default {
  async fetch(request, env) {
    // Enable CORS for your invitation domain
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();

      // 1. Check honeypot for spam protection
      if (data.honeypot && data.honeypot.trim().length > 0) {
        return new Response(JSON.stringify({ error: 'Spam detected' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 2. Validate required full name
      if (!data.fullName || data.fullName.trim().length < 2) {
        return new Response(JSON.stringify({ error: 'Valid name required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 3. Save to KV or D1 (Example with KV)
      if (env.RSVP_KV) {
        const id = `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await env.RSVP_KV.put(id, JSON.stringify(data));
      }

      return new Response(JSON.stringify({ success: true, message: 'RSVP recorded' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
```

---

## Option 2: Google Apps Script -> Google Sheet

This sends responses straight into a private Google Sheet.

1. Open a new Google Sheet (columns: `Timestamp`, `Full Name`, `Guests`, `Events`, `Dua / Note`).
2. Click **Extensions > Apps Script**.
3. Paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Spam' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Format events
    var eventsSummary = Object.keys(data.eventAttendance || {})
      .map(function(k) { return k + ': ' + (data.eventAttendance[k] ? 'Yes' : 'No'); })
      .join(', ');

    sheet.appendRow([
      new Date(),
      data.fullName,
      data.guestCount,
      eventsSummary,
      data.duaNote || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
4. Click **Deploy > New Deployment**.
5. Select type **Web App**, set **Execute as: Me**, and **Who has access: Anyone**.
6. Copy the Web App URL and set it in `src/config.ts` under `rsvp.apiEndpoint`.
