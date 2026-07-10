import{useState,useEffect,useRef,useCallback}from'react'
import{createClient}from'@supabase/supabase-js'
import html2canvas from'html2canvas'
const sb=createClient('https://ftfaporbookulrspamjn.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZmFwb3Jib29rdWxyc3BhbWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjY0MTQsImV4cCI6MjA5ODUwMjQxNH0.g8Vso3wfdYGwALUB9hFkzqX1gXMcLrz8yPGBGWOhXEw')
async function sget(k){const{data}=await sb.from('bingo_kv').select('value').eq('key',k).maybeSingle();return data?.value??null}
async function sset(k,v){const{error}=await sb.from('bingo_kv').upsert({key:k,value:v,updated_at:new Date().toISOString()});return!error}
async function slist(p){const{data}=await sb.from('bingo_kv').select('key').like('key',`${p}%`);return(data||[]).map(d=>d.key)}
const DP=['\u05de\u05d5\u05e8\u05df','\u05d3\u05d5\u05e8','\u05e9\u05e8\u05d9\u05ea','\u05d0\u05d1\u05d0\u05dc','\u05d0\u05d9\u05e0\u05d0\u05e1','\u05d0\u05dc\u05d9\u05d0\u05df','\u05d1\u05e8']
const C={bg:'#0E1B2E',panel:'#13253C',panel2:'#0B1626',board:'#F6F2E7',ink:'#16283C',sub:'#66788A',gold:'#C7A24A',goldSoft:'#E7D7A6',line:'#263B54',boardLine:'#E0D8C4',pendBg:'#F4E0DC',pendBd:'#E3B6AE',pend:'#B8433A',doneBg:'#DCEEDF',doneBd:'#A4D2AF',done:'#2E9E5B',white:'#FBF9F3'}
const uid=()=>Math.random().toString(36).slice(2,9)
const ts=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const kf=(b,d)=>`b:${b}:board:${d}`
const pk=b=>`b:${b}:pool`
const mk=b=>`b:${b}:meta`
const bp=b=>`b:${b}:board:`
const getBranch=()=>{const m=(typeof location!=='undefined'?location.pathname:'').match(/\/s\/([^/?#]+)/);return m?decodeURIComponent(m[1]):null}
const hd=s=>{try{const[y,m,d]=s.split('-');const dt=new Date(+y,+m-1,+d);const dn=['\u05e8\u05d0\u05e9\u05d5\u05df','\u05e9\u05e0\u05d9','\u05e9\u05dc\u05d9\u05e9\u05d9','\u05e8\u05d1\u05d9\u05e2\u05d9','\u05d7\u05de\u05d9\u05e9\u05d9','\u05e9\u05d9\u05e9\u05d9','\u05e9\u05d1\u05ea'];return`\u05d9\u05d5\u05dd ${dn[dt.getDay()]}, ${+d}.${+m}.${y}`}catch{return s}}

function EL({value,onSave,disabled,style}){
  const[ed,setEd]=useState(false);const[dr,setDr]=useState(value);const r=useRef()
  useEffect(()=>{setDr(value)},[value]);useEffect(()=>{if(ed)r.current?.select()},[ed])
  const cm=()=>{setEd(false);const v=dr.trim()||value;setDr(v);onSave(v)}
  if(ed)return<input ref={r} value={dr} onChange={e=>setDr(e.target.value)} onBlur={cm} onKeyDown={e=>{if(e.key==='Enter')cm();if(e.key==='Escape'){setDr(value);setEd(false)}}} style={{width:'100%',background:'#fff',color:C.ink,border:'2px solid '+C.gold,borderRadius:7,padding:'4px 6px',fontSize:12,fontWeight:700,textAlign:'center',fontFamily:'inherit',outline:'none'}}/>
  return<div onClick={()=>{if(!disabled){setDr(value);setEd(true)}}} title={disabled?undefined:'\u05dc\u05d7\u05e5 \u05dc\u05e2\u05e8\u05d9\u05db\u05d4'} style={{cursor:disabled?'default':'text',padding:'4px 3px',borderRadius:7,userSelect:'none',...style}} onMouseEnter={e=>{if(!disabled)e.currentTarget.style.background='rgba(199,162,74,.12)'}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>{value}</div>
}

function Landing({C,df,ff}){
  const[mode,setMode]=useState('home')
  const[num,setNum]=useState('');const[name,setName]=useState('');const[code,setCode]=useState('')
  const[err,setErr]=useState('');const[busy,setBusy]=useState(false)
  const wrap={minHeight:'100vh',background:C.bg,color:C.white,fontFamily:ff,display:'flex',alignItems:'center',justifyContent:'center',padding:20}
  const card={width:'100%',maxWidth:420,background:C.panel,border:`1px solid ${C.line}`,borderRadius:20,padding:24,boxSizing:'border-box'}
  const inp={width:'100%',boxSizing:'border-box',background:C.panel2,color:C.white,border:`1px solid ${C.line}`,borderRadius:12,padding:'13px 14px',fontFamily:ff,fontSize:15,outline:'none',marginTop:10,direction:'rtl'}
  const btn=p=>({width:'100%',background:p?C.gold:'transparent',color:p?C.panel2:C.goldSoft,border:`1.5px solid ${C.gold}`,borderRadius:12,padding:13,fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:ff,marginTop:12})
  const go=n=>{location.href='/s/'+encodeURIComponent(n)}
  async function create(){setErr('');const nn=num.replace(/\D/g,'');if(!nn){setErr('\u05d4\u05d6\u05df \u05de\u05e1\u05e4\u05e8 \u05e1\u05e0\u05d9\u05e3 (\u05e1\u05e4\u05e8\u05d5\u05ea)');return}if(!name.trim()){setErr('\u05d4\u05d6\u05df \u05e9\u05dd \u05e1\u05e0\u05d9\u05e3');return}if(code.length<3){setErr('\u05e7\u05d5\u05d3 \u05d0\u05d3\u05de\u05d9\u05df \u2014 \u05dc\u05e4\u05d7\u05d5\u05ea 3 \u05ea\u05d5\u05d5\u05d9\u05dd');return}setBusy(true);const ex=await sget(mk(nn));if(ex){setBusy(false);setErr(`\u05e1\u05e0\u05d9\u05e3 ${nn} \u05db\u05d1\u05e8 \u05ea\u05e4\u05d5\u05e1 \u2014 \u05d1\u05d7\u05e8 \u05de\u05e1\u05e4\u05e8 \u05d0\u05d7\u05e8`);return}const ok=await sset(mk(nn),{name:name.trim(),code,createdAt:new Date().toISOString()});setBusy(false);if(!ok){setErr('\u05e9\u05d2\u05d9\u05d0\u05ea \u05e9\u05de\u05d9\u05e8\u05d4, \u05e0\u05e1\u05d4 \u05e9\u05d5\u05d1');return}go(nn)}
  function enter(){const nn=num.replace(/\D/g,'');if(!nn){setErr('\u05d4\u05d6\u05df \u05de\u05e1\u05e4\u05e8 \u05e1\u05e0\u05d9\u05e3');return}go(nn)}
  return(<div style={wrap}><div style={card}>
    <div style={{fontFamily:df,fontWeight:800,fontSize:26,textAlign:'center'}}>{'\ud83c\udfaf \u05dc\u05d5\u05d7 \u05d4\u05d9\u05e2\u05d3\u05d9\u05dd'}</div>
    <div style={{color:C.sub,fontSize:13,textAlign:'center',marginTop:6,marginBottom:16}}>{'\u05dc\u05d5\u05d7 \u05d9\u05e2\u05d3\u05d9\u05dd \u05d9\u05d5\u05de\u05d9 \u05dc\u05e1\u05e0\u05d9\u05e3 \u00b7 \u05d1\u05d9\u05e0\u05d2\u05d5 \u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd'}</div>
    {mode==='home'&&<><button style={btn(true)} onClick={()=>{setErr('');setMode('create')}}>{'\u2795 \u05e6\u05d5\u05e8 \u05e1\u05e0\u05d9\u05e3 \u05d7\u05d3\u05e9'}</button><button style={btn(false)} onClick={()=>{setErr('');setMode('enter')}}>{'\ud83d\udd11 \u05db\u05e0\u05d9\u05e1\u05d4 \u05dc\u05e1\u05e0\u05d9\u05e3 \u05e7\u05d9\u05d9\u05dd'}</button></>}
    {mode==='create'&&<><input style={inp} value={num} onChange={e=>setNum(e.target.value)} inputMode="numeric" placeholder="\u05de\u05e1\u05e4\u05e8 \u05e1\u05e0\u05d9\u05e3 (\u05dc\u05de\u05e9\u05dc 4021)"/><input style={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="\u05e9\u05dd \u05d4\u05e1\u05e0\u05d9\u05e3 (\u05d9\u05d5\u05e4\u05d9\u05e2 \u05d1\u05db\u05d5\u05ea\u05e8\u05ea)"/><input style={inp} value={code} onChange={e=>setCode(e.target.value)} placeholder="\u05e7\u05d5\u05d3 \u05d0\u05d3\u05de\u05d9\u05df (\u05dc\u05e2\u05e8\u05d9\u05db\u05d4)"/>{err&&<div style={{color:'#F0A9A0',fontSize:13,marginTop:10,textAlign:'center'}}>{err}</div>}<button style={btn(true)} disabled={busy} onClick={create}>{busy?'\u05d9\u05d5\u05e6\u05e8\u2026':'\u05e6\u05d5\u05e8 \u05d5\u05d4\u05de\u05e9\u05da'}</button><button style={{...btn(false),marginTop:8}} onClick={()=>{setErr('');setMode('home')}}>{'\u05d7\u05d6\u05e8\u05d4'}</button></>}
    {mode==='enter'&&<><input style={inp} value={num} onChange={e=>setNum(e.target.value)} inputMode="numeric" placeholder="\u05de\u05e1\u05e4\u05e8 \u05e1\u05e0\u05d9\u05e3"/>{err&&<div style={{color:'#F0A9A0',fontSize:13,marginTop:10,textAlign:'center'}}>{err}</div>}<button style={btn(true)} onClick={enter}>{'\u05db\u05e0\u05d9\u05e1\u05d4'}</button><button style={{...btn(false),marginTop:8}} onClick={()=>{setErr('');setMode('home')}}>{'\u05d7\u05d6\u05e8\u05d4'}</button></>}
  </div></div>)
}

function NotFound({C,df,ff,branch}){
  return(<div style={{minHeight:'100vh',background:C.bg,color:C.white,fontFamily:ff,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
    <div style={{maxWidth:420,textAlign:'center'}}>
      <div style={{fontSize:44}}>{'\ud83d\uddfa\ufe0f'}</div>
      <div style={{fontFamily:df,fontWeight:800,fontSize:22,marginTop:8}}>{`\u05e1\u05e0\u05d9\u05e3 ${branch} \u05dc\u05d0 \u05e7\u05d9\u05d9\u05dd`}</div>
      <div style={{color:C.sub,fontSize:14,marginTop:8}}>{'\u05d4\u05e7\u05d9\u05e9\u05d5\u05e8 \u05d0\u05d9\u05e0\u05d5 \u05de\u05d7\u05d5\u05d1\u05e8 \u05dc\u05e1\u05e0\u05d9\u05e3 \u05e4\u05e2\u05d9\u05dc.'}</div>
      <button onClick={()=>location.href='/'} style={{marginTop:18,background:C.gold,color:C.panel2,border:'none',borderRadius:12,padding:'12px 20px',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:ff}}>{'\u05dc\u05d3\u05e3 \u05d4\u05e8\u05d0\u05e9\u05d9'}</button>
    </div>
  </div>)
}

export default function App(){
  const[date,setDate]=useState(ts());const[pool,setPool]=useState(DP);const[board,setBoard]=useState(null)
  const[loading,setLoading]=useState(true);const[saveErr,setSaveErr]=useState(false)
  const[admin,setAdmin]=useState(false);const[codeOpen,setCodeOpen]=useState(false)
  const[code,setCode]=useState('');const[codeErr,setCodeErr]=useState(false)
  const[showPanel,setShowPanel]=useState(false);const[copyFrom,setCopyFrom]=useState('');const[helpOpen,setHelpOpen]=useState(false)
  const[celebrate,setCelebrate]=useState(null);const pbr=useRef(new Set());const skr=useRef(false)
  const branch=getBranch()
  const[meta,setMeta]=useState(undefined)

  const lp=useCallback(async()=>{const p=await sget(pk(branch));if(p&&Array.isArray(p)&&p.length)setPool(p)},[branch])
  const lb=useCallback(async(d,s)=>{
    if(!s)setLoading(true)
    let b=await sget(kf(branch,d))
    if(!b&&d>=ts()){const ks=await slist(bp(branch));const ds=ks.map(k=>k.replace(bp(branch),'')).filter(x=>x<d).sort();const pv=ds.length?await sget(kf(branch,ds[ds.length-1])):null;if(pv){b={targets:pv.targets.map(t=>({...t})),rows:pv.rows.map(r=>({...r})),cells:{}}}else{const pn=(await sget(pk(branch)))||DP;b={targets:[{id:uid(),label:'\u05d9\u05e2\u05d3 1'},{id:uid(),label:'\u05d9\u05e2\u05d3 2'},{id:uid(),label:'\u05d9\u05e2\u05d3 3'}],rows:pn.map(n=>({id:uid(),name:n})),cells:{}}}}
    setBoard(b);if(!s)setLoading(false)
  },[branch])

  useEffect(()=>{if(!branch)return;const ch=sb.channel('bg-'+branch).on('postgres_changes',{event:'*',schema:'public',table:'bingo_kv'},pl=>{if(skr.current)return;const k=pl.new?.key||pl.old?.key;if(k===pk(branch))lp();if(k===kf(branch,date))lb(date,true)}).subscribe();return()=>sb.removeChannel(ch)},[date,lp,lb,branch])
  useEffect(()=>{if(!branch){setMeta(null);return}sget(mk(branch)).then(m=>setMeta(m||null))},[branch]);useEffect(()=>{if(branch&&meta)lp()},[lp,branch,meta]);useEffect(()=>{if(branch&&meta)lb(date,false)},[date,lb,branch,meta])
  useEffect(()=>{if(!board)return;const nb=new Set();board.rows.forEach(r=>{if(board.targets.length>0&&board.targets.every(t=>board.cells[`${r.id}::${t.id}`]))nb.add(r.id)});for(const rid of nb){if(!pbr.current.has(rid)){setCelebrate(rid);setTimeout(()=>setCelebrate(null),2500);break}};pbr.current=nb},[board])

  async function tc(ri,ti){if(date<ts()&&!admin)return;skr.current=true;const lt=(await sget(kf(branch,date)))||board;const ck=`${ri}::${ti}`;const cells={...(lt.cells||{})};if(cells[ck])delete cells[ck];else cells[ck]=true;const nx={...lt,cells};setBoard(nx);const ok=await sset(kf(branch,date),nx);setSaveErr(!ok);setTimeout(()=>{skr.current=false},1000)}
  async function cm(fn){skr.current=true;const lt=(await sget(kf(branch,date)))||board;const nx=fn(JSON.parse(JSON.stringify(lt)));setBoard(nx);const ok=await sset(kf(branch,date),nx);setSaveErr(!ok);setTimeout(()=>{skr.current=false},1000)}
  function repChange(rid,field,val){if(date<ts()&&!admin)return;const v=(val||'').replace(/[^0-9]/g,'').slice(0,9);setBoard(b=>{const reports={...(b.reports||{})};reports[rid]={...(reports[rid]||{}),[field]:v};return {...b,reports}})}
  function repSave(){if(date<ts()&&!admin)return;setBoard(b=>{if(b){skr.current=true;sset(kf(branch,date),b).then(ok=>{setSaveErr(!ok);setTimeout(()=>{skr.current=false},800)})}return b})}
  const at=()=>cm(b=>{b.targets.push({id:uid(),label:`\u05d9\u05e2\u05d3 ${b.targets.length+1}`});return b})
  const rt=tid=>cm(b=>{b.targets=b.targets.filter(t=>t.id!==tid);Object.keys(b.cells).forEach(k=>{if(k.endsWith(`::${tid}`))delete b.cells[k]});return b})
  const rnt=(tid,l)=>cm(b=>{const t=b.targets.find(x=>x.id===tid);if(t)t.label=l;return b})
  const ar=()=>cm(b=>{const u=new Set(b.rows.map(r=>r.name));const f=pool.find(n=>!u.has(n))||pool[0]||'\u05d1\u05e0\u05e7\u05d0\u05d9';b.rows.push({id:uid(),name:f});return b})
  const rr=rid=>cm(b=>{b.rows=b.rows.filter(r=>r.id!==rid);Object.keys(b.cells).forEach(k=>{if(k.startsWith(`${rid}::`))delete b.cells[k]});return b})
  const srn=(rid,n)=>cm(b=>{const r=b.rows.find(x=>x.id===rid);if(r)r.name=n;return b})
  const cd=()=>cm(b=>{b.cells={};return b})
  const ep=(i,v)=>{const n=[...pool];n[i]=v;setPool(n)}
  const cp=()=>{const nx=pool.filter(x=>x.trim()!=='');setPool(nx);sset(pk(branch),nx)}
  const pAdd=()=>setPool(p=>[...p,''])
  const pDel=i=>{const n=pool.filter((_,x)=>x!==i);setPool(n);sset(pk(branch),n)}
  async function csf(sd){if(!sd)return;const src=await sget(kf(branch,sd));if(!src)return;await cm(b=>{b.targets=src.targets.map(t=>({...t}));b.rows=src.rows.map(r=>({...r}));b.cells={};return b})}
  function tu(){if(meta&&code===meta.code){setAdmin(true);setCodeOpen(false);setCode('');setCodeErr(false)}else setCodeErr(true)}

  const st=board?(()=>{const tot=board.rows.length*board.targets.length;const dn=Object.keys(board.cells).length;const fl=board.rows.filter(r=>board.targets.length>0&&board.targets.every(t=>board.cells[`${r.id}::${t.id}`])).length;return{tot,dn,fl,pct:tot?Math.round((dn/tot)*100):0}})():null
  const df=`'Frank Ruhl Libre','Heebo',Georgia,serif`;const ff=`'Heebo','Segoe UI',system-ui,Arial,sans-serif`
  const past=date<ts();const locked=past&&!admin

  const boardRef=useRef(null)
  const capRef=useRef(null)
  const[capturing,setCapturing]=useState(false)
  const NOOP=()=>{}
  const[sumOpen,setSumOpen]=useState(false);const[sumText,setSumText]=useState('');const[copied,setCopied]=useState(false);const[tab,setTab]=useState('board')
  function buildSummary(){if(!board)return'';const rows=board.rows,tg=board.targets;const tot=rows.length*tg.length;const dn=Object.keys(board.cells).filter(k=>board.cells[k]).length;const pct=tot?Math.round(dn/tot*100):0;const bingo=rows.filter(r=>tg.length>0&&tg.every(t=>board.cells[`${r.id}::${t.id}`]));let s=`🎯 סיכום יום · ${hd(date)}\n\n✅ הושלמו: ${dn}/${tot} (${pct}%)\n`;if(bingo.length)s+=`🎉 בינגו מלא: ${bingo.map(r=>r.name).join(', ')}\n`;s+=`\n👤 לפי בנקאי:\n`;rows.forEach(r=>{const c=tg.filter(t=>board.cells[`${r.id}::${t.id}`]).length;s+=`• ${r.name}: ${c}/${tg.length}${tg.length>0&&c===tg.length?' 🏆':''}\n`});s+=`\n🎯 לפי יעד:\n`;tg.forEach(t=>{const c=rows.filter(r=>board.cells[`${r.id}::${t.id}`]).length;s+=`• ${t.label}: ${c}/${rows.length}\n`});const rep=board.reports||{};const rl=rows.map(r=>{const rr=rep[r.id]||{};const c=parseInt(rr.credit,10)||0;const g=parseInt(rr.recruit,10)||0;const p=[];if(c>0)p.push(`${c} א ₪ אשראי`);if(g>0)p.push(g===1?'גיוס אחד':`${g} גיוסים`);return p.length?`• ${r.name}: ${p.join(' ו־')}`:null}).filter(Boolean);if(rl.length)s+=`\n📊 דיווח ביצועים:\n`+rl.join('\n')+'\n';return s}
  function openSummary(){setSumText(buildSummary());setCopied(false);setSumOpen(true)}
  function copySummary(){try{navigator.clipboard.writeText(sumText);setCopied(true);setTimeout(()=>setCopied(false),1600)}catch(e){setCopied(false)}}
  async function shareSummary(){const iOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);try{if(navigator.share&&!iOS){await navigator.share({text:sumText});return}}catch(e){if(e.name==='AbortError')return}
    // ב-iOS תפריט השיתוף מצרף את כתובת הדף, ווואטסאפ מציג לינק במקום הטקסט.
    // לכן מעתיקים את הסיכום המדויק ופותחים את וואטסאפ עם הטקסט מוכן מראש.
    copySummary();try{window.open('https://wa.me/?text='+encodeURIComponent(sumText),'_blank')}catch(e){}}
  async function shot(){if(!board)return;setCapturing(true);await new Promise(r=>setTimeout(r,180));try{const el=capRef.current;if(!el)throw new Error('render');const canvas=await html2canvas(el,{backgroundColor:'#0E1B2E',scale:2,useCORS:true});canvas.toBlob(async blob=>{if(!blob)return;const file=new File([blob],`bingo-${date}.png`,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:`לוח יעדים ${date}`});return}catch(e){if(e.name==='AbortError')return}}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`bingo-${date}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')}catch(e){alert('שגיאה בצילום המסך: '+e.message)}finally{setCapturing(false)}}

  if(!branch)return<Landing C={C} df={df} ff={ff}/>
  if(meta===undefined)return<div style={{minHeight:'100vh',background:C.bg,color:C.sub,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:ff,fontSize:15}}>{'\u05d8\u05d5\u05e2\u05df\u2026'}</div>
  if(meta===null)return<NotFound C={C} df={df} ff={ff} branch={branch}/>
  return(
    /* ── overflowX:hidden מונע גלילה אופקית של הדף כולו ── */
    <div dir="rtl" style={{minHeight:'100vh',background:C.bg,fontFamily:ff,color:C.white,overflowX:'hidden'}}>
      <div style={{maxWidth:1060,margin:'0 auto',padding:'18px 12px 48px'}}>
        <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:16,flexWrap:'wrap'}}>
          <div>
            <h1 style={{fontFamily:df,fontWeight:800,fontSize:28,lineHeight:1.1,color:C.white,margin:0}}>{'\u05dc\u05d5\u05d7 \u05d4\u05d9\u05e2\u05d3\u05d9\u05dd'}</h1>
            <div style={{color:C.gold,fontSize:13,fontWeight:600,marginTop:3}}>{`${meta.name} \u00b7 \u05d1\u05d9\u05e0\u05d2\u05d5 \u05d9\u05e2\u05d3\u05d9\u05dd \u05d9\u05d5\u05de\u05d9`}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <button onClick={()=>setHelpOpen(true)} title="הוראות שימוש" style={{display:'flex',alignItems:'center',gap:6,background:C.panel,color:C.goldSoft,border:`1px solid ${C.line}`,borderRadius:12,padding:'10px 13px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>
            <span>{'\u2139\ufe0f'}</span><span>{'\u05d4\u05d5\u05e8\u05d0\u05d5\u05ea'}</span>
          </button>
          <button onClick={()=>admin?setShowPanel(s=>!s):setCodeOpen(true)} style={{display:'flex',alignItems:'center',gap:8,background:admin?C.gold:C.panel,color:admin?C.panel2:C.goldSoft,border:`1px solid ${admin?C.gold:C.line}`,borderRadius:12,padding:'10px 15px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>
            <span>{admin?'\u2699\ufe0f':'\ud83d\udd12'}</span><span>{admin?'\u05e0\u05d9\u05d4\u05d5\u05dc':'\u05d0\u05d3\u05de\u05d9\u05df'}</span>
          </button>
          {admin&&<button onClick={()=>{setAdmin(false);setShowPanel(false)}} title="\u05d9\u05e6\u05d9\u05d0\u05d4 \u05de\u05de\u05e6\u05d1 \u05d0\u05d3\u05de\u05d9\u05df" style={{display:'flex',alignItems:'center',gap:6,background:'transparent',color:C.gold,border:`1.5px solid ${C.gold}`,borderRadius:12,padding:'10px 13px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>
            <span>{'\ud83d\udd13'}</span><span>{'\u05d9\u05e6\u05d9\u05d0\u05d4'}</span>
          </button>}
          </div>
        </header>

        <div style={{display:'flex',gap:8,marginBottom:14}}>
          <button onClick={()=>setTab('board')} style={{flex:1,background:tab==='board'?C.gold:C.panel,color:tab==='board'?C.panel2:C.goldSoft,border:`1px solid ${tab==='board'?C.gold:C.line}`,borderRadius:12,padding:'11px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'🎯 לוח יעדים'}</button>
          <button onClick={()=>setTab('report')} style={{flex:1,background:tab==='report'?C.gold:C.panel,color:tab==='report'?C.panel2:C.goldSoft,border:`1px solid ${tab==='report'?C.gold:C.line}`,borderRadius:12,padding:'11px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'📊 דיווח ביצועים'}</button>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:8,marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:C.panel,border:`1px solid ${C.line}`,borderRadius:12,padding:'8px 13px'}}>
            <span>{'\ud83d\udcc5'}</span>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{background:'transparent',color:C.white,border:'none',outline:'none',fontFamily:ff,fontSize:14,fontWeight:600,cursor:'pointer'}}/>
          </div>
          <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:12,padding:'8px 13px',fontSize:13,color:C.sub}}>{hd(date)}{date===ts()&&<span style={{color:C.gold,fontWeight:700}}>{' \u00b7 \u05d4\u05d9\u05d5\u05dd'}</span>}</div>
          {st&&tab==='board'&&(<div style={{display:'flex',alignItems:'center',gap:8,background:C.panel,border:`1px solid ${C.line}`,borderRadius:12,padding:'8px 13px'}}>
            <div style={{width:80,height:8,background:C.panel2,borderRadius:99,overflow:'hidden'}}><div style={{width:`${st.pct}%`,height:'100%',background:C.done,transition:'width .4s'}}/></div>
            <span style={{fontSize:13,fontWeight:700}}>{st.dn}/{st.tot}</span>
            {st.fl>0&&<span style={{fontSize:13,color:C.gold,fontWeight:700}}>{`\u00b7 ${st.fl} \u05d1\u05d9\u05e0\u05d2\u05d5 \ud83c\udf89`}</span>}
          </div>)}
          {saveErr&&<div style={{background:'#3A1A1A',border:'1px solid #7A3A34',color:'#F0C4BE',borderRadius:10,padding:'8px 12px',fontSize:12}}>{'שגיאת שמירה ⚠️'}</div>}
        </div>

        {board&&!loading&&past&&<div style={{background:locked?C.panel:'#2A2113',border:`1px solid ${locked?C.line:C.gold}`,color:locked?C.sub:C.gold,borderRadius:12,padding:'10px 14px',marginBottom:12,fontSize:13,fontWeight:600,textAlign:'center'}}>{locked?'🔒 יום עבר · לצפייה בלבד. להזזת סימונים היכנס לאדמין.':'✏️ מצב אדמין · עריכת יום עבר מאופשרת.'}</div>}

        {loading?<div style={{textAlign:'center',padding:60,color:C.sub}}>{'טוען…'}</div>:!board?
          <div style={{background:C.board,borderRadius:18,color:C.ink,padding:48,textAlign:'center'}}><div style={{fontSize:44,marginBottom:10}}>{'🗓️'}</div><div style={{fontWeight:700,fontSize:17}}>{'אין לוח לתאריך זה'}</div><div style={{color:C.sub,fontSize:14,marginTop:6}}>{'תאריך עבר שלא הוגדר בו לוח.'}</div></div>:
          <div ref={boardRef}>{tab==='board'?<Bo board={board} admin={admin} locked={locked} pool={pool} celebrate={celebrate} onToggle={tc} onRenameTarget={rnt} onRemoveTarget={rt} onRemoveRow={rr} onSetRowName={srn} onAddTarget={at} onAddRow={ar}/>:<Rep C={C} board={board} locked={locked} onChange={repChange} onSave={repSave}/>}</div>
        }

        {tab==='board'&&<div style={{display:'flex',justifyContent:'center',gap:20,marginTop:18,color:C.sub,fontSize:12}}>
          {!locked&&<><span>{'❌ לחץ לסימון'}</span><span>{'✅ לחץ לביטול'}</span></>}
          {admin&&<span style={{color:C.goldSoft}}>{'✏️ לחץ על שם יעד לעריכה'}</span>}
        </div>}

        {board&&!loading&&<div style={{display:'flex',gap:10,justifyContent:'center',marginTop:16,flexWrap:'wrap'}}>
          <button onClick={shot} style={{display:'flex',alignItems:'center',gap:8,background:C.panel,color:C.goldSoft,border:`1px solid ${C.line}`,borderRadius:12,padding:'11px 18px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'📸 צילום מסך'}</button>
          <button onClick={openSummary} style={{display:'flex',alignItems:'center',gap:8,background:C.panel,color:C.goldSoft,border:`1px solid ${C.line}`,borderRadius:12,padding:'11px 18px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'📋 סיכום יום'}</button>
        </div>}

        {capturing&&board&&<div ref={capRef} aria-hidden style={{position:'absolute',left:-99999,top:0,width:'fit-content',background:'#0E1B2E',padding:22,boxSizing:'border-box'}}>
          <div style={{color:C.gold,fontFamily:df,fontWeight:800,fontSize:23,marginBottom:14,textAlign:'right',direction:'rtl'}}>{`🎯 לוח יעדים · ${hd(date)}`}</div>
          <Cap C={C} board={board}/>
        </div>}
      </div>

      {helpOpen&&<Ov onClose={()=>setHelpOpen(false)}>
        <div style={{fontFamily:df,fontSize:20,fontWeight:800,marginBottom:14}}>{'\u2139\ufe0f \u05d4\u05d5\u05e8\u05d0\u05d5\u05ea \u05e9\u05d9\u05de\u05d5\u05e9'}</div>
        <div style={{display:'flex',flexDirection:'column',gap:11,fontSize:14,lineHeight:1.6}}>
          <div>{'\u2705 \u05dc\u05d7\u05e6\u05d5 \u05e2\u05dc \u05ea\u05d0 \u05db\u05d3\u05d9 \u05dc\u05e1\u05de\u05df \u05e9\u05d4\u05d9\u05e2\u05d3 \u05d1\u05d5\u05e6\u05e2. \u05dc\u05d7\u05d9\u05e6\u05d4 \u05e0\u05d5\u05e1\u05e4\u05ea \u05de\u05d1\u05d8\u05dc\u05ea.'}</div>
          <div>{'\ud83d\udd04 \u05db\u05dc \u05e9\u05d9\u05e0\u05d5\u05d9 \u05e0\u05e9\u05de\u05e8 \u05d5\u05de\u05e1\u05ea\u05e0\u05db\u05e8\u05df \u05de\u05d9\u05d3 \u05dc\u05db\u05dc \u05d4\u05de\u05db\u05e9\u05d9\u05e8\u05d9\u05dd \u2014 \u05d0\u05d9\u05df \u05e6\u05d5\u05e8\u05da \u05dc\u05e9\u05de\u05d5\u05e8.'}</div>
          <div>{'\ud83c\udfc6 \u05d4\u05e9\u05dc\u05de\u05ea \u05e9\u05d5\u05e8\u05d4 \u05de\u05dc\u05d0\u05d4 = \u05d1\u05d9\u05e0\u05d2\u05d5! \ud83c\udf89'}</div>
          <div>{'\ud83d\udcc5 \u05db\u05dc \u05d1\u05d5\u05e7\u05e8 \u05e0\u05e4\u05ea\u05d7 \u05dc\u05d5\u05d7 \u05d7\u05d3\u05e9 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea. \u05d9\u05de\u05d9 \u05e2\u05d1\u05e8 \u05e0\u05e9\u05de\u05e8\u05d9\u05dd \u05dc\u05e6\u05e4\u05d9\u05d9\u05d4 \u05d1\u05dc\u05d1\u05d3.'}</div>
          <div>{'\ud83d\udcc5 \u05de\u05e2\u05d1\u05e8 \u05d1\u05d9\u05df \u05d9\u05de\u05d9\u05dd \u2014 \u05d3\u05e8\u05da \u05d1\u05d5\u05e8\u05e8 \u05d4\u05ea\u05d0\u05e8\u05d9\u05da \u05dc\u05de\u05e2\u05dc\u05d4.'}</div>
          <div>{'\ud83d\udcf8 \u05e6\u05d9\u05dc\u05d5\u05dd \u05de\u05e1\u05da \u2014 \u05e9\u05d5\u05de\u05e8 \u05d0\u05d5 \u05de\u05e9\u05ea\u05e3 \u05ea\u05de\u05d5\u05e0\u05d4 \u05e9\u05dc \u05d4\u05dc\u05d5\u05d7.'}</div>
          <div>{'\ud83d\udccb \u05e1\u05d9\u05db\u05d5\u05dd \u05d9\u05d5\u05dd \u2014 \u05d9\u05d5\u05e6\u05e8 \u05d8\u05e7\u05e1\u05d8 \u05e1\u05d9\u05db\u05d5\u05dd \u05dc\u05e9\u05dc\u05d9\u05d7\u05d4 \u05dc\u05e7\u05d1\u05d5\u05e6\u05d4.'}</div>
        </div>
        <button onClick={()=>setHelpOpen(false)} style={{width:'100%',marginTop:18,background:C.gold,color:C.panel2,border:'none',borderRadius:12,padding:12,fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:ff}}>{'\u05d4\u05d1\u05e0\u05ea\u05d9'}</button>
      </Ov>}

      {codeOpen&&(<Ov onClose={()=>{setCodeOpen(false);setCode('');setCodeErr(false)}}>
        <div style={{fontFamily:df,fontSize:21,fontWeight:800,marginBottom:8}}>{'כניסת אדמין 🔐'}</div>
        <div style={{color:C.sub,fontSize:13,marginBottom:16}}>{'הזן קוד כדי לפתוח את לשונית הניהול.'}</div>
        <input autoFocus type="password" inputMode="numeric" value={code} onChange={e=>{setCode(e.target.value);setCodeErr(false)}} onKeyDown={e=>e.key==='Enter'&&tu()} placeholder="● ● ● ●" style={{width:'100%',background:C.panel2,color:C.white,border:`2px solid ${codeErr?C.pend:C.line}`,borderRadius:12,padding:'14px',fontSize:22,textAlign:'center',letterSpacing:10,outline:'none',fontFamily:ff}}/>
        {codeErr&&<div style={{color:C.pend,fontSize:13,marginTop:8,textAlign:'center'}}>{'קוד שגוי.'}</div>}
        <button onClick={tu} style={{width:'100%',marginTop:16,background:C.gold,color:C.panel2,border:'none',borderRadius:12,padding:'13px',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:ff}}>{'כניסה'}</button>
      </Ov>)}

      {admin&&showPanel&&<AP C={C} pool={pool} date={date} copyFrom={copyFrom} setCopyFrom={setCopyFrom} onClose={()=>setShowPanel(false)} onLock={()=>{setAdmin(false);setShowPanel(false)}} onClearDay={cd} onEditPoolName={ep} onCommitPool={cp} onAddPool={pAdd} onRemovePool={pDel} onCopyStructure={csf} display={df}/>}

      {sumOpen&&<Ov onClose={()=>setSumOpen(false)}>
        <div style={{fontFamily:df,fontSize:20,fontWeight:800,marginBottom:6}}>{'📋 סיכום היום'}</div>
        <div style={{color:C.sub,fontSize:12,marginBottom:12}}>{'אפשר לערוך את הטקסט לפני השיתוף.'}</div>
        <textarea value={sumText} onChange={e=>setSumText(e.target.value)} style={{width:'100%',height:250,background:C.panel2,color:C.white,border:`1px solid ${C.line}`,borderRadius:12,padding:12,fontFamily:ff,fontSize:13,lineHeight:1.7,resize:'vertical',boxSizing:'border-box',direction:'rtl',outline:'none'}}/>
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button onClick={shareSummary} style={{flex:1,background:C.gold,color:C.panel2,border:'none',borderRadius:12,padding:12,fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'📤 שיתוף'}</button>
          <button onClick={copySummary} style={{flex:1,background:'transparent',color:C.gold,border:`1.5px solid ${C.gold}`,borderRadius:12,padding:12,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>{copied?'✓ הועתק':'📋 העתקה'}</button>
        </div>
      </Ov>}
    </div>
  )
}

/* ══ BOARD ══ */
function Bo({board,admin,locked,pool,celebrate,onToggle,onRenameTarget,onRemoveTarget,onRemoveRow,onSetRowName,onAddTarget,onAddRow}){
  /* תאים קומפקטיים לנייד */
  const NW=admin?108:110, CW=58
  const cols=`${NW}px repeat(${board.targets.length},${CW}px)`
  const ff=`'Heebo','Segoe UI',system-ui,Arial,sans-serif`
  const scRef=useRef(null)
  const[edge,setEdge]=useState({l:false,r:false})
  const upd=useCallback(()=>{const el=scRef.current;if(!el)return;const max=el.scrollWidth-el.clientWidth;const s=Math.abs(el.scrollLeft);setEdge({l:s<max-2,r:s>2})},[])
  useEffect(()=>{upd();const el=scRef.current;const raf=requestAnimationFrame(upd);let ro;if(el&&'ResizeObserver'in window){ro=new ResizeObserver(upd);ro.observe(el)}window.addEventListener('resize',upd);return()=>{cancelAnimationFrame(raf);if(ro)ro.disconnect();window.removeEventListener('resize',upd)}},[upd,board])

  return(
    <div>
      {/* הלוח עצמו — גולל רק בתוכו */}
      <div style={{position:'relative'}}>
      <div ref={scRef} onScroll={upd} style={{background:C.board,borderRadius:20,padding:10,boxShadow:'0 12px 36px rgba(0,0,0,.4)',overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
        <div style={{display:'grid',gridTemplateColumns:cols,gap:5,minWidth:'fit-content'}}>

          {/* שורת כותרות יעדים */}
          <div style={{background:C.board}}/>
          {board.targets.map(t=>{
            const cf=board.rows.length>0&&board.rows.every(r=>board.cells[`${r.id}::${t.id}`])
            return(<div key={t.id} style={{position:'relative',textAlign:'center'}}>
              <EL value={t.label} disabled={!admin} onSave={l=>onRenameTarget(t.id,l)} style={{color:C.ink,fontSize:12,fontWeight:700,borderBottom:`2.5px solid ${cf?C.done:C.boardLine}`,minHeight:34,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1.2}}/>
              {cf&&<div style={{fontSize:10,color:C.done,fontWeight:700}}>{'✓ מלא'}</div>}
              {admin&&<button onClick={()=>onRemoveTarget(t.id)} title="הסר יעד" style={{position:'absolute',top:-6,insetInlineEnd:-6,width:20,height:20,borderRadius:99,background:C.pend,color:'#fff',border:'2px solid '+C.board,fontSize:13,lineHeight:'16px',cursor:'pointer',fontWeight:700}}>{'−'}</button>}
            </div>)
          })}

          {/* שורות בנקאים */}
          {board.rows.map(r=>{
            const rf=board.targets.length>0&&board.targets.every(t=>board.cells[`${r.id}::${t.id}`])
            const ic=celebrate===r.id
            return(<RF key={r.id}>
              {/* תא שם + כפתור מחיקה בתוכו (תמיד גלוי) */}
              <div style={{position:'sticky',right:0,zIndex:2,background:C.board}}>
                <div style={{display:'flex',alignItems:'center',gap:4,background:rf?'#FBF3D9':C.white,border:`1.5px solid ${rf?C.gold:C.boardLine}`,borderRadius:12,padding:'0 6px',height:54,boxShadow:ic?`0 0 0 3px ${C.gold},0 0 14px ${C.gold}55`:'none',transition:'box-shadow .4s'}}>
                  {/* כפתור מחיקת שורה — בתוך תא השם */}
                  {admin&&<button onClick={()=>onRemoveRow(r.id)} title="הסר בנקאי" style={{flexShrink:0,width:22,height:22,borderRadius:99,background:C.pendBg,color:C.pend,border:`1.5px solid ${C.pendBd}`,fontSize:15,lineHeight:'20px',cursor:'pointer',fontWeight:700,textAlign:'center'}}>{'−'}</button>}
                  {admin?
                    <select value={r.name} onChange={e=>onSetRowName(r.id,e.target.value)} style={{flex:1,background:'transparent',color:C.ink,border:'none',fontFamily:ff,fontSize:13,fontWeight:700,outline:'none',cursor:'pointer',direction:'rtl',minWidth:0}}>
                      {!pool.includes(r.name)&&<option value={r.name}>{r.name}</option>}
                      {pool.map(n=><option key={n} value={n}>{n}</option>)}
                    </select>:
                    <span style={{flex:1,color:C.ink,fontSize:14,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</span>
                  }
                  {rf&&<span style={{fontSize:13,flexShrink:0}}>{'🎉'}</span>}
                </div>
              </div>

              {/* תאי יעדים */}
              {board.targets.map(t=>{
                const done=!!board.cells[`${r.id}::${t.id}`]
                return<button key={t.id} onClick={locked?undefined:()=>onToggle(r.id,t.id)} style={{height:54,borderRadius:12,cursor:locked?'default':'pointer',background:done?C.doneBg:C.pendBg,border:`2px solid ${done?C.doneBd:C.pendBd}`,fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',transition:'transform .1s ease'}} onMouseDown={e=>!locked&&(e.currentTarget.style.transform='scale(.88)')} onMouseUp={e=>e.currentTarget.style.transform='scale(1)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>{done?'✅':'❌'}</button>
              })}
            </RF>)
          })}
        </div>
      </div>
      {edge.l&&<div style={{position:'absolute',left:18,bottom:'100%',marginBottom:3,pointerEvents:'none',zIndex:3,fontSize:30,lineHeight:1,color:C.gold,fontWeight:500,textShadow:'0 1px 3px rgba(0,0,0,.5)'}}>{'\u2039'}</div>}
      {edge.r&&<div style={{position:'absolute',right:NW+14,bottom:'100%',marginBottom:3,pointerEvents:'none',zIndex:3,fontSize:30,lineHeight:1,color:C.gold,fontWeight:500,textShadow:'0 1px 3px rgba(0,0,0,.5)'}}>{'\u203a'}</div>}
      </div>

      {/* כפתורי הוספה — מחוץ לאזור הגלילה, תמיד גלויים */}
      {admin&&(
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button onClick={onAddRow} style={{flex:1,background:C.doneBg,color:C.done,border:`2px dashed ${C.done}`,borderRadius:12,height:46,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'＋ הוסף בנקאי'}</button>
          <button onClick={onAddTarget} style={{flex:1,background:'#EBF3FB',color:'#3B6EA5',border:'2px dashed #3B6EA5',borderRadius:12,height:46,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:ff}}>{'＋ הוסף יעד'}</button>
        </div>
      )}
    </div>
  )
}
const RF=({children})=><>{children}</>

/* ══ PERFORMANCE REPORT ══ */
function Rep({C,board,locked,capture,onChange,onSave}){
  const f=`'Heebo','Segoe UI',system-ui,Arial,sans-serif`
  const rows=board.rows,rep=board.reports||{}
  const inp={width:'100%',boxSizing:'border-box',background:locked?'#EFEDE4':'#fff',border:`1px solid ${C.line}`,borderRadius:10,textAlign:'center',fontFamily:f,fontSize:17,fontWeight:800,color:C.ink,padding:'13px 4px',outline:'none'}
  const th={fontFamily:f,fontWeight:800,fontSize:13,color:C.ink,textAlign:'center',padding:'0 0 2px'}
  return(
    <div style={{background:C.board,borderRadius:20,padding:12,boxShadow:'0 12px 36px rgba(0,0,0,.4)'}}>
      <div style={{display:'grid',gridTemplateColumns:'minmax(80px,1fr) 92px 92px',gap:7,alignItems:'center'}}>
        <div style={{...th,textAlign:'right',paddingRight:6}}>{'בנקאי'}</div>
        <div style={th}>{'אשראי (א׳)'}</div>
        <div style={th}>{'גיוס'}</div>
        {rows.map(r=>{const v=rep[r.id]||{};return(<RF key={r.id}>
          <div style={{background:'#FBFAF3',border:`1px solid ${C.line}`,borderRadius:10,padding:'13px 10px',textAlign:'right',fontFamily:f,fontWeight:800,fontSize:15,color:C.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.name}</div>
          <input type="tel" inputMode="numeric" disabled={locked||capture} value={v.credit||''} onChange={e=>onChange(r.id,'credit',e.target.value)} onBlur={onSave} placeholder="0" style={inp}/>
          <input type="tel" inputMode="numeric" disabled={locked||capture} value={v.recruit||''} onChange={e=>onChange(r.id,'recruit',e.target.value)} onBlur={onSave} placeholder="0" style={inp}/>
        </RF>)})}
      </div>
      {!capture&&<div style={{color:C.ink,opacity:.6,fontSize:12,marginTop:12,textAlign:'center',fontFamily:f}}>{locked?'🔒 יום עבר · לצפייה בלבד.':'הזינו ביצועים · אשראי באלפי ₪ (א׳). נשמר אוטומטית.'}</div>}
    </div>
  )
}

/* ══ COMBINED CAPTURE TABLE (one continuous row per banker: name · targets · credit · recruit) ══ */
function Cap({C,board}){
  const f=`'Heebo','Segoe UI',system-ui,Arial,sans-serif`
  const NW=110,CW=58,RW=80
  const cols=`${NW}px repeat(${board.targets.length},${CW}px) ${RW}px ${RW}px`
  const rep=board.reports||{}
  const th=full=>({color:C.ink,fontSize:12,fontWeight:800,textAlign:'center',display:'flex',alignItems:'flex-end',justifyContent:'center',minHeight:46,lineHeight:1.2,paddingBottom:4,borderBottom:`2.5px solid ${full?C.done:C.boardLine}`})
  const repTh={color:'#8A6B22',fontSize:12,fontWeight:800,textAlign:'center',display:'flex',alignItems:'flex-end',justifyContent:'center',minHeight:46,lineHeight:1.2,paddingBottom:4,borderBottom:`2.5px solid ${C.gold}`}
  const repCell={height:54,borderRadius:12,background:'#FBF4E1',border:'2px solid #E7D9A8',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:f,fontWeight:800,fontSize:17,color:C.ink}
  return(
    <div style={{background:C.board,borderRadius:20,padding:12,boxShadow:'0 12px 36px rgba(0,0,0,.4)',width:'fit-content'}}>
      <div style={{display:'grid',gridTemplateColumns:cols,gap:5}}>
        <div/>
        {board.targets.map(t=>{const cf=board.rows.length>0&&board.rows.every(r=>board.cells[`${r.id}::${t.id}`]);return<div key={t.id} style={th(cf)}>{t.label}</div>})}
        <div style={repTh}>{'אשראי (א׳)'}</div>
        <div style={repTh}>{'גיוס'}</div>
        {board.rows.map(r=>{
          const rf=board.targets.length>0&&board.targets.every(t=>board.cells[`${r.id}::${t.id}`])
          const rr=rep[r.id]||{},c=parseInt(rr.credit,10)||0,g=parseInt(rr.recruit,10)||0
          return(<RF key={r.id}>
            <div style={{display:'flex',alignItems:'center',gap:4,background:rf?'#FBF3D9':C.white,border:`1.5px solid ${rf?C.gold:C.boardLine}`,borderRadius:12,padding:'0 8px',height:54}}>
              <span style={{flex:1,color:C.ink,fontSize:14,fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</span>
              {rf&&<span style={{fontSize:13}}>{'🎉'}</span>}
            </div>
            {board.targets.map(t=>{const done=!!board.cells[`${r.id}::${t.id}`];return<div key={t.id} style={{height:54,borderRadius:12,background:done?C.doneBg:C.pendBg,border:`2px solid ${done?C.doneBd:C.pendBd}`,fontSize:22,display:'flex',alignItems:'center',justifyContent:'center'}}>{done?'✅':'❌'}</div>})}
            <div style={repCell}>{c>0?c:'—'}</div>
            <div style={repCell}>{g>0?g:'—'}</div>
          </RF>)
        })}
      </div>
    </div>
  )
}

/* ══ ADMIN PANEL ══ */
function AP({C,pool,date,copyFrom,setCopyFrom,onClose,onLock,onClearDay,onEditPoolName,onCommitPool,onAddPool,onRemovePool,onCopyStructure,display}){
  const f=`'Heebo','Segoe UI',system-ui,Arial,sans-serif`
  return(
    <div style={{position:'fixed',inset:0,zIndex:40,background:'rgba(0,0,0,.6)',display:'flex',justifyContent:'flex-start'}} onClick={onClose}>
      <div dir="rtl" onClick={e=>e.stopPropagation()} style={{width:'min(400px,92vw)',height:'100%',background:C.panel,borderLeft:`1px solid ${C.line}`,overflowY:'auto',overflowX:'hidden',padding:20,boxSizing:'border-box',fontFamily:f}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <div style={{fontFamily:display,fontSize:22,fontWeight:800,color:C.white}}>{'⚙️ ניהול הלוח'}</div>
          <button onClick={onClose} style={{background:'transparent',color:C.sub,border:'none',fontSize:24,cursor:'pointer'}}>{'×'}</button>
        </div>
        <S C={C} t="📖 הוראות אדמין"><div style={{color:C.sub,fontSize:13,lineHeight:1.7,display:'flex',flexDirection:'column',gap:6}}>
          <div>{'\u2022 \u05e2\u05e8\u05d9\u05db\u05ea \u05d9\u05e2\u05d3: \u05dc\u05d7\u05e5 \u05e2\u05dc \u05e9\u05dd \u05d4\u05d9\u05e2\u05d3 \u05d1\u05e8\u05d0\u05e9 \u05d4\u05e2\u05de\u05d5\u05d3\u05d4 \u05d5\u05d4\u05e7\u05dc\u05d3 \u05e9\u05dd \u05d7\u05d3\u05e9.'}</div>
          <div>{'\u2022 \u05d4\u05d5\u05e1\u05e4\u05d4/\u05d4\u05e1\u05e8\u05d4: \u05db\u05e4\u05ea\u05d5\u05e8\u05d9 \uff0b \u05de\u05ea\u05d7\u05ea \u05dc\u05dc\u05d5\u05d7 (\u05d9\u05e2\u05d3 / \u05d1\u05e0\u05e7\u05d0\u05d9); \u2212 \u05d1\u05e8\u05d0\u05e9 \u05e2\u05de\u05d5\u05d3\u05ea \u05d9\u05e2\u05d3 \u05d5\u05d1\u05ea\u05d5\u05da \u05ea\u05d0 \u05d4\u05e9\u05dd (\u05d4\u05e1\u05e8 \u05d1\u05e0\u05e7\u05d0\u05d9).'}</div>
          <div>{'\u2022 \u05e9\u05dd \u05d1\u05e0\u05e7\u05d0\u05d9 \u05dc\u05e9\u05d5\u05e8\u05d4: \u05d1\u05d7\u05e8 \u05de\u05d4\u05ea\u05e4\u05e8\u05d9\u05d8 \u05d4\u05e0\u05e4\u05ea\u05d7 \u05e9\u05d1\u05ea\u05d0 \u05d4\u05e9\u05dd.'}</div>
          <div>{'\u2022 \u05de\u05d0\u05d2\u05e8 \u05e9\u05de\u05d5\u05ea: \uff0b \u05d4\u05d5\u05e1\u05e3 / \u2212 \u05d4\u05e1\u05e8 \u05dc\u05de\u05d8\u05d4 \u05d1\u05e4\u05d0\u05e0\u05dc \u2014 \u05de\u05e9\u05e4\u05d9\u05e2 \u05e2\u05dc \u05ea\u05e4\u05e8\u05d9\u05d8\u05d9 \u05d4\u05d1\u05d7\u05d9\u05e8\u05d4.'}</div>
          <div>{'\u2022 \u05d9\u05de\u05d9 \u05e2\u05d1\u05e8: \u05e0\u05e2\u05d5\u05dc\u05d9\u05dd \u05dc\u05db\u05d5\u05dc\u05dd; \u05e8\u05e7 \u05d1\u05de\u05e6\u05d1 \u05d0\u05d3\u05de\u05d9\u05df \u05d0\u05e4\u05e9\u05e8 \u05dc\u05ea\u05e7\u05df \u05d1\u05d4\u05dd \u05e1\u05d9\u05de\u05d5\u05e0\u05d9\u05dd.'}</div>
          <div>{'\u2022 \u05e1\u05d9\u05d5\u05dd: \"\ud83d\udd12 \u05e0\u05e2\u05d9\u05dc\u05ea \u05e0\u05d9\u05d4\u05d5\u05dc\" \u05d9\u05d5\u05e6\u05d0 \u05de\u05de\u05e6\u05d1 \u05d0\u05d3\u05de\u05d9\u05df.'}</div>
        </div></S>
        <S C={C} t={`ניקוי סימונים · ${date}`}><button onClick={onClearDay} style={{width:'100%',background:C.panel2,color:'#F0C4BE',border:`1px solid ${C.line}`,borderRadius:12,padding:12,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:f}}>{'🗑️ אפס כל התאים ל-❌'}</button></S>
        <S C={C} t="שכפול מבנה מתאריך אחר">
          <div style={{display:'flex',gap:8}}>
            <input type="date" value={copyFrom} onChange={e=>setCopyFrom(e.target.value)} style={{flex:1,background:C.panel2,color:C.white,border:`1px solid ${C.line}`,borderRadius:10,padding:'10px 12px',fontFamily:f,fontSize:14,outline:'none'}}/>
            <button onClick={()=>onCopyStructure(copyFrom)} style={{background:C.gold,color:C.panel2,border:'none',borderRadius:10,padding:'10px 16px',fontWeight:800,fontSize:14,cursor:'pointer',fontFamily:f}}>{'העתק'}</button>
          </div>
          <p style={{color:C.sub,fontSize:12,marginTop:8}}>{'מעתיק מבנה מתאריך קודם — תאים ריקים.'}</p>
        </S>
        <S C={C} t="מאגר שמות הבנקאים">
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {pool.map((n,i)=>(
              <div key={i} style={{display:'flex',gap:8,alignItems:'center'}}>
                <input value={n} autoFocus={n===''} onChange={e=>onEditPoolName(i,e.target.value)} onBlur={onCommitPool} placeholder="שם בנקאי" style={{flex:1,background:C.panel2,color:C.white,border:`1px solid ${C.line}`,borderRadius:10,padding:'10px 13px',fontFamily:f,fontSize:14,outline:'none'}}/>
                {pool.length>1&&<button onClick={()=>onRemovePool(i)} aria-label="הסר בנקאי" style={{flexShrink:0,width:42,height:42,background:'transparent',color:'#F0C4BE',border:`1px solid ${C.line}`,borderRadius:10,fontSize:22,fontWeight:800,lineHeight:1,cursor:'pointer'}}>{'−'}</button>}
              </div>
            ))}
            <button onClick={onAddPool} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'transparent',color:C.gold,border:`1.5px dashed ${C.gold}`,borderRadius:10,padding:'11px',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:f}}>{'＋ הוסף בנקאי'}</button>
          </div>
          <p style={{color:C.sub,fontSize:12,marginTop:8}}>{'שמות אלה מופיעים בתפריט הבחירה של כל שורה.'}</p>
        </S>
        <button onClick={onLock} style={{width:'100%',marginTop:8,background:'transparent',color:C.gold,border:`1.5px solid ${C.gold}`,borderRadius:12,padding:12,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:f}}>{'🔒 נעילת ניהול'}</button>
      </div>
    </div>
  )
}
const S=({C,t,children})=><div style={{marginBottom:20,paddingBottom:18,borderBottom:`1px solid ${C.line}`}}><div style={{color:C.goldSoft,fontSize:12,fontWeight:800,marginBottom:10}}>{t}</div>{children}</div>
function Ov({children,onClose}){return<div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,.65)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}><div dir="rtl" onClick={e=>e.stopPropagation()} style={{width:'min(360px,94vw)',background:'#13253C',border:'1px solid #263B54',borderRadius:20,padding:24,color:'#FBF9F3',fontFamily:`'Heebo','Segoe UI',system-ui,Arial,sans-serif`}}>{children}</div></div>}
