const CUES=[
  {id:'c1',text:'葡萄糖先离开毛细血管。',start_s:.6,end_s:4.7,highlighted_event_t:2.3,speaker:'Microsoft Huihui Desktop',source:'local Windows SAPI technical test voice'},
  {id:'c2',text:'它经过组织间隙。',start_s:4.8,end_s:8.5,highlighted_event_t:6.3,speaker:'Microsoft Huihui Desktop',source:'local Windows SAPI technical test voice'},
  {id:'c3',text:'再跨过肌细胞膜进入细胞。',start_s:8.6,end_s:13.3,highlighted_event_t:10.8,speaker:'Microsoft Huihui Desktop',source:'local Windows SAPI technical test voice'}
];
const ease=(u)=>{u=clamp(u);return u*u*(3-2*u)},mix=(a,b,u)=>a+(b-a)*u;
function activeCue(t){return CUES.find(c=>t>=c.start_s&&t<c.end_s)||null}
function subtitleBoxes(t){const c=activeCue(t);return c?[{id:c.id,text:c.text,x0:24,y0:520,x1:336,y1:598}]:[]}
function membrane(x,key){const P=[];for(let i=0;i<=18;i++)P.push([x+Math.sin(i*.85)*2,140+i*17]);gline(P,{key:key+'a',w:3,col:SK.ink,second:false});gline(P.map(([xx,y])=>[xx+8,y]),{key:key+'b',w:2,col:SK.graph,second:false})}
function glucoseAt(t){
  if(t<2.3)return[80,325];if(t<4.2){const u=ease((t-2.3)/1.9);return[mix(80,150,u),mix(325,305,u)]}
  if(t<8.6)return[180,305];if(t<11.4){const u=ease((t-8.6)/2.8);return[mix(180,276,u),mix(305,325,u)]}
  return[305,325];
}
function drawTextBox(box){
  ctx.save();ctx.fillStyle='rgba(42,36,32,.88)';ctx.beginPath();ctx.roundRect(box.x0,box.y0,box.x1-box.x0,box.y1-box.y0,12);ctx.fill();
  ctx.font='bold 22px "Microsoft YaHei","DengXian",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fffdf6';ctx.fillText(box.text,(box.x0+box.x1)/2,(box.y0+box.y1)/2);ctx.restore();
}
function renderFrame(t,canvas){
  const cv=canvas||document.getElementById('c');ctx=cv.getContext('2d');F=((Math.round(t*FPS)%NFRAMES)+NFRAMES)%NFRAMES;B=Math.floor(F/2);TT=B*2/FPS;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.setLineDash([]);fillAll(SK.paper);sketchPage({grid:'dots'});
  handLetter('普通话音画同步验证',180,68,23,{align:'center',key:'title',jit:.25,stroke:.6});
  const cap=[[12,160],[104,150],[126,180],[126,430],[104,452],[12,442]];gfill(cap,'#f4d9d1',{key:'c-cap-fill',off:[0,0],a:.55});gline(cap,{closed:true,key:'c-cap',w:3.2,col:'#a84d43'});
  for(let i=0;i<3;i++){const P=loopPts(48+i*27,240+(i%2)*90,12,7,.02,0,22);gfill(P,'#d58c82',{key:'c-rbc'+i,off:[0,0]});gline(P,{closed:true,key:'c-rbco'+i,w:1.8})}
  membrane(126,'c-wall');membrane(234,'c-cell-membrane');
  const cell=[[242,170],[344,155],[356,190],[356,430],[336,455],[242,438]];gfill(cell,'#edd2c1',{key:'c-cell-fill',off:[0,0],a:.68});gline(cell,{closed:true,key:'c-cell',w:3.2,col:SK.terraD});
  handLetter('毛细血管',67,486,18,{align:'center',key:'c-l1',jit:.2});handLetter('组织间隙',180,486,18,{align:'center',key:'c-l2',jit:.2});handLetter('肌细胞',298,486,18,{align:'center',key:'c-l3',jit:.2});
  const[gx,gy]=glucoseAt(TT),dot=loopPts(gx,gy,11,11,.02,0,26);scribbleFill(dot,SK.terra,{key:'c-glucose-fill',gap:5,w:2,base:.2});gline(dot,{closed:true,key:'c-glucose',w:2.6});
  subtitleBoxes(TT).forEach(drawTextBox);STYLE.post();return 1;
}
window.renderFrame=renderFrame;window.render=(t)=>renderFrame(t);window.DUR=DURATION;window.TEXTS=(t)=>subtitleBoxes(t);window.CUES=CUES;window.READY=true;
