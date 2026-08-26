import nodemailer from 'nodemailer';

const clean = (value, max = 2000) => String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

let cachedTransporter = null;
function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const port = Number(process.env.SMTP_PORT || 465);
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: String(process.env.SMTP_SECURE ?? (port === 465 ? 'true' : 'false')) === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  });
  return cachedTransporter;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_EMAIL'];
    return res.status(200).json({
      ok: true,
      service: 'ReparaFix contacto API',
      environment: Object.fromEntries(keys.map(k => [k, Boolean(process.env[k])]))
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });

  try {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length) {
      console.error('ReparaFix: faltan variables', missing);
      return res.status(500).json({ ok: false, code: 'MISSING_SMTP_ENV' });
    }

    const { nombre, telefono, email, modelo, mensaje, website } = req.body || {};
    if (website) return res.status(200).json({ ok: true });

    const n = clean(nombre, 80), t = clean(telefono, 30), e = clean(email, 120), mo = clean(modelo, 120), msg = clean(mensaje, 2000);
    if (!n || !t || !e || !msg || !emailOk(e)) return res.status(400).json({ ok: false, code: 'INVALID_FORM_DATA' });

    const html = `<h2>Nueva consulta ReparaFix</h2><p><b>Web:</b> pc112.com.es</p><p><b>Nombre:</b> ${n}</p><p><b>Teléfono:</b> ${t}</p><p><b>Email:</b> ${e}</p><p><b>Equipo / modelo:</b> ${mo || 'No indicado'}</p><p><b>Avería:</b><br>${msg.replace(/\n/g, '<br>')}</p>`;

    const transporter = getTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"ReparaFix" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: e,
      subject: 'Nueva consulta ReparaFix - pc112.com.es',
      text: `Nueva consulta ReparaFix\n\nNombre: ${n}\nTeléfono: ${t}\nEmail: ${e}\nEquipo / modelo: ${mo || 'No indicado'}\n\nAvería:\n${msg}`,
      html
    });

    return res.status(200).json({ ok: true, message: 'Consulta enviada correctamente' });
  } catch (error) {
    console.error('ReparaFix SMTP:', error?.message);
    return res.status(500).json({ ok: false, code: 'SMTP_SEND_FAILED' });
  }
}
