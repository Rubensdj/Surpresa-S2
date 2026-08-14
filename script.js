document.addEventListener('DOMContentLoaded', function(){
  const canvas = document.getElementById('signature');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  canvas.addEventListener('mousedown', (e)=>{ drawing = true; ctx.moveTo(e.offsetX, e.offsetY); });
  canvas.addEventListener('mousemove', (e)=>{ if(drawing){ ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }});
  canvas.addEventListener('mouseup',()=>{ drawing = false; });
  canvas.addEventListener('mouseleave',()=>{ drawing = false; });
  document.getElementById('clear').addEventListener('click',()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); });
});