// Bounded compatibility illustrations; these functions are not codecs.
const flag=v=>{if(![0,1].includes(v))throw Error('Invalid encoding flag');};
export function taggedModel({writer=1,reader=0,change=0}={}){
 flag(writer);flag(reader);if(![0,1,2].includes(change))throw Error('Invalid schema change');
 const old={1:'name'},next=change===2?{1:'city'}:{1:'displayName',2:'city'},schema=reader?next:old;
 const fields=writer?(change===2?[{tag:1,value:'Oslo'}]:[{tag:1,value:'Ari'},{tag:2,value:'Oslo'}]):[{tag:1,value:'Ari'}];
 const decoded=fields.filter(f=>schema[f.tag]).map(f=>({name:schema[f.tag],value:f.value})),unknown=fields.filter(f=>!schema[f.tag]);
 const missing=reader&&change===1&&!fields.some(f=>f.tag===2),misread=change===2&&writer!==reader;
 return {fields,schema,decoded,unknown,missing,misread,ok:!missing&&!misread};
}
export function schemaResolutionModel({writer=0,reader=1,defaults=1,reorder=0}={}){
 for(const n of [writer,reader,defaults,reorder])flag(n);
 const source=writer?[{name:'name',value:'Ari'},{name:'city',value:'Oslo'}]:[{name:'name',value:'Ari'}];if(reorder)source.reverse();
 const names=reader?['name','city']:['name'],resolved=names.map(name=>{const field=source.find(f=>f.name===name);return {name,value:field?.value??(defaults?'Unknown':null),origin:field?'writer':defaults?'reader default':'missing'};});
 return {source,resolved,skipped:source.filter(f=>!names.includes(f.name)),ok:resolved.every(f=>f.origin!=='missing')};
}
export function roundtripModel({preserve=0}={}){flag(preserve);const written={name:'Ari',city:'Oslo'},read={name:written.name},edited={name:'Ari updated'},saved=preserve?{...written,...edited}:edited;return {written,read,saved,lost:!Object.hasOwn(saved,'city')};}
