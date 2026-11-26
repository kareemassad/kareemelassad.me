// Confirmed league identities. Match accounts by Sleeper owner ID, never by roster slot.
export const PEOPLE=[
  {id:'stefan',name:'Stefan',owners:['861351467095818240']},
  {id:'logan',name:'Logan',owners:['1118897063636475904']},
  {id:'kareem',name:'Kareem',owners:['1127632411111677952']},
  {id:'michael',name:'Michael',owners:['1130351937666486272']},
  {id:'russell',name:'Russell',owners:['1130352140301582336']},
  {id:'evan',name:'Evan',owners:['1391154402940702720']},
  {id:'george',name:'George',owners:['1133411183182237696']},
  {id:'alois',name:'Alois',owners:['1389764612433403904']},
  {id:'mason',name:'Mason',owners:['1263637565672525824']},
  {id:'rory',name:'Rory',owners:['559638524775043072']},
  {id:'omar-sakr',name:'Omar Sakr',owners:['819366190228041728']},
  {id:'ahmed-allam',name:'Ahmed Allam',owners:['1135728168629141504']},
  {id:'alfredo',name:'Alfredo',owners:['1131687501669969920']},
];
const owners=new Map(PEOPLE.flatMap(person=>person.owners.map(id=>[id,person])));
export const personForOwner=id=>owners.get(String(id));
