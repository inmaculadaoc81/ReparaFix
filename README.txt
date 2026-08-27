REPARAFIX — SERVICIO TÉCNICO ORDENADORES Y SMARTWATCH (MADRID)

Sitio multipágina grande: home + aviso legal + política de privacidad +
23 páginas de servicio (/servicios/, ordenadores y smartwatch) + 24
páginas de modelo/marca (/modelos/) = 51 páginas en total. NO se ha
convertido a one-page, así que no se ha añadido middleware de
redirección — todas las páginas siguen existiendo y funcionando.

Dominio:
https://pc112.com.es/
(coherente en canonical, og:url, robots.txt y sitemap.xml; no colisiona
con ningún otro dominio revisado en esta sesión)

REVISIÓN (fixes aplicados):
- Ya tenía menú móvil funcional (.menu-toggle + .nav.open) y schema.org
  completo (LocalBusiness/ProfessionalService + Service); no se ha
  tocado ninguno de los dos.
- Chat: no había colisión de selector [class*="chat-window"] (nombres
  de clase exactos, no selectores "contiene"), pero faltaba el borde
  blanco estándar del botón del chat. Añadido border:1px solid
  #fff!important a .chat-window-toggle.
- No se ha añadido una sección SEO adicional en la home: el sitio ya
  tiene 23 páginas de servicio y 24 páginas de modelo/marca con
  contenido propio (estructura .seo-page/.seo-layout ya existente),
  más completo que la plantilla one-page.
- Banner de cookies: no existía en ninguna página. Añadido (Aceptar /
  Rechazar / Política de privacidad → https://kelatos.com/privacy-policy/)
  en las 51 páginas del sitio, con diseño apilado a ancho completo en
  móvil.
- Google Analytics: no existía. Añadido G-NZYVR6D6LV en las 51 páginas.
- H1 de portada reescrito, corto y directo (estilo Isra Bravo, sin
  nombrar una marca concreta porque el sitio cubre ordenadores y
  smartwatch de múltiples fabricantes). Tamaño del H1 aumentado:
  clamp(44-72px) → clamp(50-80px) en escritorio, 39px → 44px en móvil.
  Iterado en varios commits posteriores (afirmativo, sin
  interrogación, sin condicionales, sin "Descubre") hasta el texto
  final actual: "Ordenador o smartwatch averiado. Aquí lo reparamos
  sin complicaciones."

CAMBIO IMPORTANTE — formulario de contacto:
api/contacto.js usaba la API de Gmail vía OAuth2 (paquete "googleapis",
variables GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_REFRESH_TOKEN/
GOOGLE_EMAIL), distinto al resto de la familia. Sustituido por el mismo
patrón SMTP + nodemailer que usan todas las demás webs (sintaxis ESM,
ya que el proyecto usa "type":"module"), mismo endpoint /api/contacto y
mismos campos. Actualizado también el mapa de códigos de error en
script.js (los códigos GOOGLE_OAUTH_*/GMAIL_PERMISSION_DENIED ya no
existen; ahora usa MISSING_SMTP_ENV/SMTP_SEND_FAILED).

Variables SMTP a configurar en Vercel (sustituyen a las de Google):
SMTP_HOST=cp7124.webempresa.eu
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=soporte@kelatos.com
SMTP_PASS=[configurada únicamente en Vercel]
CONTACT_EMAIL=soporte@kelatos.com

Las variables antiguas (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
GOOGLE_REFRESH_TOKEN, GOOGLE_EMAIL) ya no se usan y pueden eliminarse de
Vercel. package.json actualizado: quitada la dependencia "googleapis",
añadida "nodemailer".

REVISIÓN ADICIONAL (esta pasada — auditoría completa):
- H1, schema.org (teléfono de la caja de información, correcto), og:*,
  canonical (https), GA y banner de cookies en las 51 páginas
  (verificado por conteo), borde del chat y package.json ya estaban
  todos correctos. Solo se ha actualizado este README, que documentaba
  una versión anterior y ya superada del H1. No se ha tocado ningún
  archivo del sitio.
