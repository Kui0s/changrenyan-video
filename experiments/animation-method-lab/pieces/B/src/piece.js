const ease=(u)=>{u=clamp(u);return u*u*(3-2*u)};
const mix=(a,b,u)=>a+(b-a)*u;
const BONE='#d8c7a4',BLOOD='#a84d43',MUSCLE='#d97757',CELL='#d69b7f';

function cameraForB(t){
  if(t<=0)return{z:1,x:540,y:920,phase:'adult'};
  if(t<4.5){const u=ease(t/4.5);return{z:mix(1,3.4,u),x:mix(540,463,u),y:mix(920,1280,u),phase:t<2.2?'adult-to-thigh':'thigh'}}
  if(t<6.2)return{z:3.4,x:463,y:1280,phase:'thigh-cutaway'};
  if(t<8.5){const u=ease((t-6.2)/2.3);return{z:mix(3.4,1,u),x:mix(463,540,u),y:mix(1280,920,u),phase:'returning'}}
  return{z:1,x:540,y:920,phase:'adult-return'};
}
function lodForB(t){return(t<2.4||t>=7.8)?'adult':t<3.8?'thigh-location':'muscle-cutaway'}
function outline(P,key,w=6,col=SK.ink){gpencil(P,{key:key+'p',w:w*.48,a:.66,closed:false});gline(P,{key,w,col,amp:1.1,second:true,step:9})}
function closed(P,key,fill=SK.paper,w=6){gfill(P,fill,{key:key+'f',off:[0,0],a:.92});gpencil(P,{closed:true,key:key+'p',w:2.8,a:.65});gline(P,{closed:true,key,w})}

function drawAdult(t,detail=true){
  const sway=Math.sin(t*1.3)*4;
  const head=loopPts(540+sway,390,88,108,.04,0,44);closed(head,'adult-head',SK.paper,7);
  outline([[505+sway,488],[492,540],[420,590]],'neck-left',6);outline([[575+sway,488],[588,540],[660,590]],'neck-right',6);
  const torso=[[420,590],[385,720],[405,900],[455,1010],[540,1045],[625,1010],[675,900],[695,720],[660,590]];
  closed(torso,'adult-torso',SK.paper,7);
  const shirt=[[420,590],[385,720],[405,900],[455,1010],[540,1045],[625,1010],[675,900],[695,720],[660,590],[610,650],[470,650]];
  ctx.save();gclip(shirt);ghatch(360,560,720,1070,{ang:-.7,gap:18,col:SK.graph,w:2.4,a:.33,key:'shirt-hatch'});ctx.restore();
  outline([[420,610],[335,740],[300,965],[340,1130]],'arm-left',7);outline([[660,610],[745,740],[780,965],[740,1130]],'arm-right',7);
  closed(loopPts(340,1160,38,55,.02,0,28),'hand-left',SK.paper,5);closed(loopPts(740,1160,38,55,.02,0,28),'hand-right',SK.paper,5);
  const pelvis=[[455,1010],[432,1080],[445,1150],[540,1190],[635,1150],[648,1080],[625,1010]];closed(pelvis,'pelvis',SK.paper,7);
  const leftLeg=[[452,1130],[415,1325],[400,1540],[425,1710],[485,1710],[505,1530],[515,1320],[525,1165]];
  const rightLeg=[[555,1165],[575,1320],[585,1530],[605,1710],[665,1710],[680,1540],[665,1325],[628,1130]];
  closed(leftLeg,'left-leg',SK.paper,8);closed(rightLeg,'right-leg',SK.paper,8);
  closed([[397,1700],[492,1700],[520,1752],[468,1778],[382,1770]],'left-shoe',SK.paper,7);
  closed([[592,1700],[680,1700],[720,1755],[670,1780],[580,1770]],'right-shoe',SK.paper,7);
  outline([[442,1320],[468,1530]],'left-leg-axis',2.5,SK.graphL);outline([[638,1320],[625,1530]],'right-leg-axis',2.5,SK.graphL);
  if(detail){
    const thigh=loopPts(463,1280,72,160,.02,0,44);
    scribbleFill(thigh,SK.terra,{key:'thigh-location',gap:14,w:3.8,base:.10,a:.45});
    gline(thigh,{closed:true,key:'thigh-location-outline',w:4,col:SK.terraD});
  }
  gline(arcPts(540+sway,455,34,.2*Math.PI,.8*Math.PI,10),{key:'adult-mouth',w:4,second:false});
  ctx.fillStyle=SK.ink;ctx.beginPath();ctx.arc(510+sway,390,7,0,TAU);ctx.arc(570+sway,390,7,0,TAU);ctx.fill();
}

function drawMuscleCutaway(alpha){
  if(alpha<=0)return;ctx.save();ctx.globalAlpha*=alpha;
  const outer=loopPts(463,1280,75,164,.03,0,48);gfill(outer,SK.paper,{key:'cut-paper',off:[0,0]});gline(outer,{closed:true,key:'cut-rim',w:6});
  for(let i=-2;i<=2;i++){
    const y=1280+i*48;
    const fibre=[[412,y-18],[438,y-28],[493,y-20],[515,y],[493,y+20],[438,y+28],[412,y+18]];
    scribbleFill(fibre,i===0?SK.terra:SK.graphL,{key:'fibre'+i,gap:9,w:3,base:.14,a:i===0?.9:.42});
    gline(fibre,{closed:true,key:'fibre-o'+i,w:3.5,col:i===0?SK.terraD:SK.graph});
  }
  const vessel=[[424,1160],[442,1195],[438,1240],[447,1285],[440,1335],[450,1390]];
  gline(vessel,{key:'thigh-vessel-a',w:13,col:BLOOD,second:false});gline(vessel,{key:'thigh-vessel-b',w:3,col:SK.paper,second:false});
  ctx.restore();
}

function label(text,x,y,size=46,align='center',col=SK.ink){handLetter(text,x,y,size,{key:'label-'+text,align,col,jit:.45,stroke:.8})}
function drawSpace(t){
  sketchPage({grid:'dots'});
  const cam=cameraForB(t),lod=lodForB(t);
  ctx.save();ctx.translate(W/2,H*.55);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
  drawAdult(t,true);
  drawMuscleCutaway(lod==='muscle-cutaway'?ease((t-3.5)/.8)*(1-ease((t-6.2)/1.2)):0);
  ctx.restore();
  if(t<2.2)label('同一位成年人',540,1760,52);
  if(t>=2.2&&t<3.8){label('左大腿',540,1640,58, 'center',SK.terraD);arrowPencil([[650,1585],[590,1500],[545,1390]],ease((t-2.2)/.7),{key:'thigh-arrow',col:SK.terraD,w:5});}
  if(t>=4&&t<6.4)label('大腿肌组织切面',540,1660,52);
  if(t>=7.5)label('返回同一个人',540,1760,52);
  postFrame();
}

function drawSmallAdultLocator(t){
  ctx.save();ctx.translate(-300,-100);ctx.scale(.46,.46);drawAdult(t,true);ctx.restore();
  label('同一左大腿',175,680,38);
  arrowPencil([[230,700],[330,760],[410,830]],1,{key:'same-thigh-link',col:SK.terraD,w:4});
}
function membrane(x,key,double=true){
  const wave=[];for(let i=0;i<=22;i++){const y=650+i*36;wave.push([x+Math.sin(i*.85)*7,y])}
  gline(wave,{key:key+'a',w:8,col:SK.ink,second:false});
  if(double)gline(wave.map(([xx,y])=>[xx+22,y]),{key:key+'b',w:5,col:SK.graph,second:false});
}
function glucoseDot(x,y,key,scale=1){
  const P=loopPts(x,y,25*scale,25*scale,.03,0,30);scribbleFill(P,SK.terra,{key:key+'f',gap:7,w:3,base:.28});gline(P,{closed:true,key,w:4});
}
function glucosePosition(t){
  if(t<11.8)return[300,1040];
  if(t<13.1){const u=ease((t-11.8)/1.3);return[mix(300,455,u),mix(1040,1000,u)]}
  if(t<15.2)return[565,1000];
  if(t<17.1){const u=ease((t-15.2)/1.9);return[mix(565,795,u),mix(1000,1040,u)]}
  return[895,1040];
}
function drawMechanism(t){
  sketchPage({grid:'dots'});drawSmallAdultLocator(t);
  label('生理原理与时间尺度示意',540,250,46);
  const cap=[[110,810],[390,780],[490,840],[500,1210],[390,1270],[110,1240]];
  gfill(cap,'#f4d9d1',{key:'cap-fill',off:[0,0],a:.55});gline(cap,{closed:true,key:'capillary',w:7,col:BLOOD});
  for(let i=0;i<4;i++)closed(loopPts(210+i*70,900+(i%2)*190,34,18,.02,0,26),'rbc'+i,'#d58c82',3);
  membrane(480,'cap-wall',true);
  const cell=[[760,760],[990,720],[1060,840],[1060,1240],[980,1340],[760,1300]];
  gfill(cell,'#edd2c1',{key:'cell-fill',off:[0,0],a:.55});scribbleFill(cell,CELL,{key:'cell-hatch',gap:20,w:3,base:.08,a:.32});
  membrane(760,'cell-membrane',true);gline(cell,{closed:true,key:'muscle-cell',w:6,col:SK.terraD});
  label('毛细血管',280,1390,42);label('组织间隙',625,1390,42);label('肌细胞',900,1390,42);
  label('血管壁',490,720,36);label('肌细胞膜',780,690,36);
  const [gx,gy]=glucosePosition(t);glucoseDot(gx,gy,'tracked-glucose',1.1);
  if(t>=11.8&&t<13.1)label('跨过第一道屏障',540,1560,48);
  else if(t>=13.1&&t<15.2)label('停在组织间隙',540,1560,48);
  else if(t>=15.2&&t<17.1)label('跨过第二道屏障',540,1560,48);
  else if(t>=17.1)label('进入肌细胞',540,1560,52);
  postFrame();
}
function postFrame(){STYLE.post()}
function renderFrame(t,canvas){
  const cv=canvas||document.getElementById('c');ctx=cv.getContext('2d');
  F=((Math.round(t*FPS)%NFRAMES)+NFRAMES)%NFRAMES;B=Math.floor(F/2);TT=B*2/FPS;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.setLineDash([]);fillAll(SK.paper);
  if(TT<9)drawSpace(TT);else drawMechanism(TT);
  return TT<9?1:2;
}
window.renderFrame=renderFrame;
