const ERA_BG=[SK.paper,SK.paper];
function pieceCam(era,t){
  if(era===0)return push(t,1.35,1.85,{z:1.32,p:[540,820],to:[540,820]});
  return camMix(camOf({z:1.25,p:[540,760],to:[540,780]}),CAM0,EZ.io(seg(t,3.15,4.55)));
}
const BRIDGES=[{
  tc:2.5,d:.72,m:.25,
  A:()=>({P:starchOutline(),c:SK.terra}),
  B:()=>({P:glucoseOutline(),c:SK.terra})
}];
