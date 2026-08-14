import { google } from 'googleapis';
const clean=(value,max=2000)=>String(value??'').replace(/[<>]/g,'').trim().slice(0,max);
const emailOk=(value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export default async function handler(req,res){
 const required=['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','GOOGLE_REFRESH_TOKEN','GOOGLE_EMAIL','CONTACT_EMAIL'];
 if(req.method==='GET') return res.status(200).json({ok:true,service:'ReparaFix contacto API',node:process.version,environment:Object.fromEntries(required.map(k=>[k,Boolean(process.env[k])]))});
 if(req.method!=='POST') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED'});
 try{
  const missing=required.filter(k=>!process.env[k]);
  if(missing.length){console.error('ReparaFix: faltan variables',missing);return res.status(500).json({ok:false,code:'MISSING_ENVIRONMENT_VARIABLES'});}
  const {nombre,telefono,email,modelo,mensaje,website}=req.body||{};
  if(website) return res.status(200).json({ok:true});
  const n=clean(nombre,80),t=clean(telefono,30),e=clean(email,120),mo=clean(modelo,120),msg=clean(mensaje,2000);
  if(!n||!t||!e||!msg||!emailOk(e)) return res.status(400).json({ok:false,code:'INVALID_FORM_DATA'});
  const auth=new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({refresh_token:process.env.GOOGLE_REFRESH_TOKEN});
  await auth.getAccessToken();
  const gmail=google.gmail({version:'v1',auth});
  const subject='Nueva consulta ReparaFix - pc112.com.es';
  const body=`<h2>Nueva consulta ReparaFix</h2><p><b>Web:</b> pc112.com.es</p><p><b>Nombre:</b> ${n}</p><p><b>Teléfono:</b> ${t}</p><p><b>Email:</b> ${e}</p><p><b>Equipo / modelo:</b> ${mo||'No indicado'}</p><p><b>Avería:</b><br>${msg.replace(/\n/g,'<br>')}</p>`;
  const raw=[`From: ReparaFix <${process.env.GOOGLE_EMAIL}>`,`To: ${process.env.CONTACT_EMAIL}`,`Reply-To: ${e}`,`Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,'MIME-Version: 1.0','Content-Type: text/html; charset=UTF-8','',body].join('\r\n');
  await gmail.users.messages.send({userId:'me',requestBody:{raw:Buffer.from(raw).toString('base64url')}});
  return res.status(200).json({ok:true,message:'Consulta enviada correctamente'});
 }catch(error){
  const responseError=error?.response?.data?.error;
  const message=String(error?.message||'');
  console.error('ReparaFix Gmail API:',{message,status:error?.response?.status,error:responseError});
  let code='EMAIL_SEND_FAILED';
  if(responseError==='invalid_grant'||message.includes('invalid_grant')) code='GOOGLE_OAUTH_INVALID_GRANT';
  else if(responseError==='invalid_client'||message.includes('invalid_client')) code='GOOGLE_OAUTH_INVALID_CLIENT';
  else if(error?.response?.status===403||message.toLowerCase().includes('insufficient permission')||message.toLowerCase().includes('insufficient authentication scopes')) code='GMAIL_PERMISSION_DENIED';
  return res.status(500).json({ok:false,code});
 }
}