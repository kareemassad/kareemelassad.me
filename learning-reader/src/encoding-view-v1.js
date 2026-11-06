import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';import {taggedModel,schemaResolutionModel,roundtripModel} from './encoding-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
const box=(x,y,w,h,title)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fffdf7" stroke="#a6b39d"/>`+text(x+12,y+25,title);
const field=(x,y,label,active=false)=>`<rect x="${x}" y="${y}" width="240" height="36" rx="5" fill="${active?'#e1ecd9':'#eee9dd'}"/>`+text(x+10,y+23,label);
export function encodingFrame(kind,p,t){let svg='',result='';const a=smooth(t/2.5);
 if(kind==='tagged'){
  const m=taggedModel({writer:+p.writer,reader:+p.reader,change:+p.change});svg=text(20,30,'A tag keeps its meaning across versions','scene-title')+box(25,75,310,240,'Writer: '+(+p.writer?'new':'old'))+box(405,75,310,240,'Reader: '+(+p.reader?'new':'old'));
  m.fields.forEach((f,i)=>{const y=135+i*65;svg+=field(48,y,`tag ${f.tag} · ${f.value}`)+`<circle cx="${300+100*a}" cy="${y+18}" r="6" fill="#4e806c"/>`;const name=m.schema[f.tag];svg+=field(428,y,t<2.5?'Decoding…':name?`${name}: ${f.value}`:'Unknown tag → skip',!!name);});
  svg+=text(20,370,t<2.5?'Follow each tag from writer to reader':m.missing?'Required city is missing':m.misread?'The bytes parse, but the meaning is wrong':'The reader can interpret this record','equation');
  result=t<2.5?'The reader uses its own schema to give each tag a meaning. Watch where the same tag lands.':m.misread?'Reusing tag 1 changes a name into a city, or a city into a name. A successful parse does not prove semantic compatibility.':m.missing?'An old writer did not emit the newly required field. The new reader must reject this record.':'A renamed field keeps tag 1. An old reader skips the new optional tag 2; a new reader can still read tag 1 from an old record.';
 }else if(kind==='schemas'){
  const m=schemaResolutionModel({writer:+p.writer,reader:+p.reader,defaults:+p.defaults,reorder:+p.reorder});svg=text(20,30,'Resolve writer and reader schemas','scene-title')+box(25,75,310,250,'Writer schema and data')+box(405,75,310,250,'Reader schema');
  m.source.forEach((f,i)=>svg+=field(48,135+i*60,f.name+': '+f.value));m.resolved.forEach((f,i)=>{const j=m.source.findIndex(s=>s.name===f.name),y=135+i*60;svg+=field(428,y,f.name+': '+(t<2.5?'…':f.value??'ERROR'),f.origin==='writer');if(j>=0){svg+=`<path d="M288 ${153+j*60} L428 ${y+18}" stroke="#6f8c68" stroke-dasharray="5 4"/>`;if(t<2.5)svg+=`<circle cx="${288+140*a}" cy="${153+j*60+(y+18-153-j*60)*a}" r="6" fill="#4e806c"/>`;}else svg+=text(430,y+53,f.origin,'tick');});
  svg+=text(20,385,t<2.5?'Follow the names across the schema boundary':m.ok?'Fields match by name, not position':'No writer value and no reader default','equation');result=t<2.5?'Each writer value follows its field name. An absent field must come from a declared reader default.':'Reorder the writer fields and compare the same result. Name-based resolution preserves field meaning even when their positions change. This model omits aliases, unions, and type promotion.';
 }else{
  const m=roundtripModel({preserve:+p.preserve}),read=smooth((t-.5)/1.5),write=smooth((t-3)/1.5);
  svg=text(20,30,'Trace the field through read, edit, and write','scene-title');
  for(const [i,label]of ['New writer','Old application','Saved record'].entries())svg+=box(20+i*245,100,225,220,label);
  svg+=text(32,165,'name: Ari')+text(32,230,'city: Oslo');
  svg+=`<path d="M32 180 H700 M32 245 H700" stroke="#dddccf" stroke-dasharray="3 6"/>`;
  if(t<2){svg+=text(32+245*read,185,'name: Ari');if(+p.preserve)svg+=text(32+245*read,250,'city: Oslo');}
  else svg+=text(277,165,t<2.6?'name: Ari':'name: Ari updated');
  if(t>=2)svg+=text(277,230,+p.preserve?'city: Oslo':'city: not retained');
  if(+p.preserve)svg+=text(277,270,'Opaque field; not edited','tick');
  if(t>=3&&t<4.5){svg+=text(277+245*write,185,'name: Ari updated');if(+p.preserve)svg+=text(277+245*write,250,'city: Oslo');}
  if(t>=4.5)Object.entries(m.saved).forEach(([key,value],i)=>svg+=text(522,165+i*65,key+': '+value));
  svg+=text(20,358,t<2?'Read known fields; decide whether to retain unknown data':t<3?'Edit name; the application does not understand city':t<4.5?'Serialize the application’s retained data':m.lost?'The saved record no longer contains city':'Both fields remain in the saved record');
  svg+=text(20,410,t<4.5?'A successful read does not prove a safe write-back':m.lost?'city was lost during the write-back':'The unknown city field survives','equation');
  result=t<4.5?'Follow name and city separately. A successful read is only the first step; inspect what the old application sends back.':m.lost?'Reading succeeded. The application rebuilt the record using only known fields, so its write erased city. Compatibility must include the read-modify-write path.':'Preserve the unknown field while applying the known edit. This is a deliberate application policy in the model, not a promise made by every serializer.';

 }return {svg,result};
}
export const encodingDemos=[
 ['tagged','Field tags and compatibility',{writer:'1',reader:'0',change:'0'},[select('writer','Writer version',['Old','New']),select('reader','Reader version',['Old','New']),select('change','Schema change',['Rename + optional city','Require the new city','Reuse tag 1 for city'])],'Conceptual tagged fields with string values. Illustrates field identity, unknown tags, and required-field validation. Not a Protocol Buffers or Thrift byte encoder.'],
 ['schemas','Writer and reader schemas',{writer:'0',reader:'1',defaults:'1',reorder:'0'},[select('writer','Writer',['Name only','Name and city']),select('reader','Reader',['Name only','Name and city']),select('defaults','Reader default',['Absent','City = Unknown']),select('reorder','Writer field order',['Original','Reversed'])],'Two synthetic string fields. Avro-style name resolution and reader defaults. No aliases, unions, nested values, actual encoding, or schema registry.'],
 ['roundtrip','The read-modify-write trap',{preserve:'0'},[select('preserve','Old application writes',['Known fields only','Preserve unknown fields'])],'One record and one edit, with no concurrency. The old application knows only name. Preservation is an explicit policy, not a serializer default.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-encoding-'+kind,title,params,controls,limits,draw:(p,t)=>encodingFrame(kind,p,t)}));
