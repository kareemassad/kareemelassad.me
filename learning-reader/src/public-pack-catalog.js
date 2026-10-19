import {PackCatalog} from './pack-catalog.js';
import {validateClockPathPack} from './clock-path-package-v1.js';
import {canonical} from './pack-schema.js';
// Local files may supply data for this shipped, bounded model. They cannot
// register code or authorize another model family. PDF anchors are checked by
// forBook before any lesson is displayed. Review authorship is not authenticated.
export class PublicPackCatalog extends PackCatalog{
 constructor(library,options){super(library,{...options,fetcher:options.fetcher||((url)=>fetch(String(url).split('?')[0]))});this.localModelHashes=options.configuration.localModelAssetsHashes||[];}
 localClock(pack){return pack?.format==='clock-path-explanations'&&this.localModelHashes?.includes(pack.validation?.workflow?.codeHash)&&pack.validation.workflow.status==='accepted';}
 compatible(pack){return this.localClock(pack)||super.compatible(pack);}
 preflight(packs){return packs.flatMap(pack=>{if(pack?.format!=='clock-path-explanations')return super.preflight([pack]);const checked=validateClockPathPack(pack);if(checked.validation.workflow.status!=='accepted')throw Error('This local reading plan is not accepted.');if(!this.localClock(checked))throw Error('This local reading plan needs a different clock model version.');const old=this.packs.get(checked.source.sha256+':'+checked.id);if(old?.version>checked.version)throw Error('An older local reading plan cannot replace a newer version.');if(old?.version===checked.version&&canonical(old)!==canonical(checked))throw Error('A changed local reading plan needs a new version.');return [checked];});}
}
