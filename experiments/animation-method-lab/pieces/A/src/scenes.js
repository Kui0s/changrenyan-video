const STARCH={x:540,y:820,rx:180,ry:116};
const GLUCOSE={x:540,y:760,r:158};

function starchOutline(x=STARCH.x,y=STARCH.y,rx=STARCH.rx,ry=STARCH.ry){
  const P=[];
  for(let i=0;i<96;i++){
    const a=-Math.PI+i/96*TAU;
    const ripple=1+.10*Math.sin(a*5)+.045*Math.sin(a*9+.5);
    P.push([x+Math.cos(a)*rx*ripple,y+Math.sin(a)*ry*ripple]);
  }
  return P;
}
function glucoseOutline(x=GLUCOSE.x,y=GLUCOSE.y,r=GLUCOSE.r){
  const P=[];
  for(let side=0;side<6;side++){
    const a0=-Math.PI/2+side*TAU/6,a1=-Math.PI/2+(side+1)*TAU/6;
    for(let j=0;j<16;j++){
      const u=j/16,a=lerp(a0,a1,u);
      P.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);
    }
  }
  return P;
}
function bead(x,y,r,key,accent=false){
  const P=loopPts(x,y,r,r*.82,.05,0,32);
  if(accent)scribbleFill(P,SK.terra,{key:key+'f',gap:10,w:4,base:.25});
  else gfill(P,SK.paper,{key:key+'f',off:[0,0]});
  gpencil(P,{closed:true,key:key+'p',w:2.5,a:.65});
  gline(P,{closed:true,key,w:4.5});
}
function sceneStarch(){
  sketchPage({grid:'dots'});
  const points=[];
  for(let i=0;i<8;i++)points.push([160+i*110,860+Math.sin(i*.95)*105]);
  gpencil(points,{key:'chain-under',w:14,a:.30,amp:2});
  gline(points,{key:'chain',w:7,amp:1.1});
  points.forEach((p,i)=>bead(p[0],p[1],42,'bead'+i,i===3||i===4));
  const P=starchOutline();
  gpencil(P,{closed:true,key:'starch-focus-pencil',w:3,a:.78});
  gline(P,{closed:true,key:'starch-focus',w:6});
  for(let i=0;i<5;i++){
    const a=-1.25+i*.62;
    gpencil([[540+Math.cos(a)*230,820+Math.sin(a)*160],[540+Math.cos(a)*290,820+Math.sin(a)*205]],{key:'focus-tick'+i,w:3,a:.55,passes:1});
  }
  graphiteScribble(540,1260,690,95,'ground-note');
}
function sceneGlucose(){
  sketchPage({grid:'dots'});
  const P=glucoseOutline();
  scribbleFill(P,SK.terra,{key:'glucose-fill',gap:11,w:4.5,base:.25});
  gpencil(P,{closed:true,key:'glucose-pencil',w:3,a:.7});
  gline(P,{closed:true,key:'glucose',w:7});
  const oxy=[540,760-GLUCOSE.r];
  gline([[oxy[0],oxy[1]],[oxy[0]+70,oxy[1]-100]],{key:'oxygen-bond',w:5});
  bead(oxy[0]+92,oxy[1]-124,34,'oxygen',false);
  for(let i=0;i<7;i++){
    const a=i/7*TAU+TT*.18;
    sparkle(540+Math.cos(a)*275,760+Math.sin(a)*235,34,0.55,'spark'+i,SK.graph);
  }
  const trail=[];
  for(let i=0;i<12;i++)trail.push([130+i*75,1220+Math.sin(i*.72)*42]);
  ctx.save();ctx.setLineDash([18,14]);gpencil(trail,{key:'next-scene-route',w:4,a:.55,passes:1});ctx.restore();
}
