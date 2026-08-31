REPARAFIX — SERVICIO TÉCNICO ORDENADORES Y SMARTWATCH (MADRID)

REVISIÓN ADICIONAL (a petición del cliente):
- BUG REAL — "no tiene para agendar citas": no existía ninguna sección
  de Cal.com. Añadida en index.html, entre la sección "proof" (Google
  Business/YouTube) y "Ubicación": "Reserva una cita de 30 minutos"
  con el iframe compartido de la familia
  (https://cal.com/kelatos/30min?embed=true&theme=light), 720px de
  alto en escritorio y 760px en móvil. Añadido enlace "Pedir cita" al
  menú en las 49 páginas que tienen nav completo (todas menos
  aviso-legal.html y politica-privacidad.html, que solo tienen un
  enlace "← Volver").
- BUG REAL — festivos: el horario decía "Sábados y domingos: cerrado",
  sin mencionar festivos. Corregido a "Sábados, domingos y días
  festivos estamos cerrados".
- Revisado el enlace de política de privacidad del formulario:
  enlazaba a la página legal local (/politica-privacidad.html) en vez
  del enlace estándar de la familia. Corregido a
  https://kelatos.com/privacy-policy/, resaltado en azul. De paso, esa
  página local (/politica-privacidad.html, que se mantiene enlazada
  desde el footer) tenía una afirmación desactualizada — "El
  formulario se procesa mediante... Google Workspace" — que ya no es
  cierta desde que este mismo README documenta el cambio a SMTP +
  nodemailer; corregida.
- BUG REAL, PERO NO DE CÓDIGO — "no funciona el formulario":
  diagnosticado en directo contra https://pc112.com.es/api/contacto,
  que devuelve una página 404 de WordPress (con cabeceras Yoast SEO),
  es decir, el dominio actualmente NO apunta a este despliegue de
  Vercel, sino a otra instalación distinta. El código en sí está
  correcto (script.js llama a /api/contacto, que coincide con
  api/contacto.js; mismo patrón SMTP ya documentado abajo). Hay que
  revisar en Vercel (Project Settings → Domains) o en el proveedor del
  dominio que pc112.com.es esté correctamente apuntado a este
  proyecto.
- PENDIENTE DE ACLARAR — "reducir texto de Banner": revisado todo el
  sitio (cabecera, hero, franjas de aviso, banner de cookies, footer)
  y no se ha identificado con certeza a qué banner se refiere el
  cliente; ninguno de los textos visibles destaca por ser
  especialmente largo salvo el banner de cookies, que usa el mismo
  texto estándar que el resto de la familia (no se ha tocado, para no
  desviarse del estándar sin confirmación). Pendiente de que el
  cliente indique de qué banner se trata, idealmente con una captura.

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
