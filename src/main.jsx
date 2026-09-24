import React,{useEffect,useMemo,useState}from"react";
import{createRoot}from"react-dom/client";
import{initializeApp}from"firebase/app";
import{getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut}from"firebase/auth";
import{getFirestore,doc,setDoc,onSnapshot}from"firebase/firestore";
import{Menu,X,ArrowUpRight,ExternalLink,ShieldCheck,Code2,Briefcase,Mail,Phone,MapPin,Download,LogOut,Plus,Trash2,Save,Network,GraduationCap,Calendar,Eye,ChevronLeft,ChevronRight,Sparkles}from"lucide-react";
import"./styles.css";

const cfg={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
const ready=Object.values(cfg).every(Boolean);
const app=ready?initializeApp(cfg):null;
const auth=app?getAuth(app):null;
const db=app?getFirestore(app):null;
const ref=ready?doc(db,"site","main"):null;

const emptyData={
  profile:{name:"",role:"",bio:"",location:"",email:"",phone:"",github:"",linkedin:"",avatarUrl:"",cvUrl:"",availability:""},
  skills:[],projects:[],experience:[],education:[],certificates:[],
  network:{internetLabel:"",routerLabel:"",switchLabel:"",clients:[],note:""}
};

function normalize(raw){
  raw=raw||{};
  return{
    ...emptyData,...raw,
    profile:{...emptyData.profile,...(raw.profile||{})},
    skills:Array.isArray(raw.skills)?raw.skills:[],
    projects:Array.isArray(raw.projects)?raw.projects:[],
    experience:Array.isArray(raw.experience)?raw.experience:[],
    education:Array.isArray(raw.education)?raw.education:[],
    certificates:Array.isArray(raw.certificates)?raw.certificates:[],
    network:{...emptyData.network,...(raw.network||{})}
  };
}

const css="@import url(https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap);"+
":root{font-family:Cairo,Arial,sans-serif;color:#eaf3ff;background:#040811;--bg:#040811;--panel:rgba(8,17,31,.74);--panel2:#091525;--line:rgba(154,185,220,.15);--line2:rgba(74,218,255,.34);--cyan:#4adaff;--blue:#7b8dff;--text:#edf5ff;--muted:#8ea0b7;--success:#74e4a5;--danger:#ff7f98}"+
"*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 75% 8%,rgba(74,218,255,.13),transparent 26%),radial-gradient(circle at 12% 60%,rgba(123,141,255,.10),transparent 30%),var(--bg)}"+
"body:before{content:'';position:fixed;inset:0;z-index:-2;opacity:.5;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom,black,transparent 92%)}"+
"a{text-decoration:none;color:inherit}button,input,textarea{font:inherit}.container{width:min(1180px,calc(100% - 34px));margin:auto}.nav{height:78px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 max(18px,calc((100% - 1180px)/2));position:sticky;top:0;z-index:30;background:rgba(4,8,17,.74);backdrop-filter:blur(20px)}"+
".brand{font:700 13px JetBrains Mono,monospace;letter-spacing:.6px}.brand span{color:var(--cyan)}.navlinks{display:flex;gap:24px;align-items:center}.navlinks a{font-size:11px;color:#aebbd0;transition:.2s}.navlinks a:hover{color:#fff}.menu{display:none;background:none;border:0;color:#fff;cursor:pointer}"+
".hero{min-height:760px;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:72px}.eyebrow{font:600 10px JetBrains Mono,monospace;color:#7f91aa;letter-spacing:.9px}.eyebrow i{color:var(--success);font-style:normal}.hero h1{font-size:clamp(48px,7vw,86px);line-height:1.02;letter-spacing:-3px;margin:14px 0 10px}.hero h2{font-size:21px;color:var(--cyan);margin:0 0 18px}.hero p{font-size:16px;line-height:2;color:#a9b7c9;max-width:690px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0}.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border:1px solid var(--line);background:rgba(255,255,255,.035);border-radius:11px;color:var(--text);cursor:pointer;font-size:12px;transition:transform .2s,border-color .2s,background .2s}.btn:hover{transform:translateY(-2px);border-color:var(--line2);background:rgba(74,218,255,.06)}.primary{border:0;background:linear-gradient(135deg,#2aabc9,#6679e8)}"+
".hero-meta{display:flex;flex-wrap:wrap;gap:14px;color:#8091a9;font-size:11px}.hero-meta span{display:inline-flex;align-items:center;gap:6px}.terminal{margin-top:24px;border:1px solid var(--line);background:rgba(1,5,11,.78);border-radius:16px;padding:16px 18px;font:11px/2 JetBrains Mono,monospace;box-shadow:0 24px 80px rgba(0,0,0,.22)}.terminal-top{display:flex;gap:6px;align-items:center;padding-bottom:9px;margin-bottom:9px;border-bottom:1px solid var(--line)}.terminal-top b{margin-right:auto;color:#71839b;font-weight:500}.dot{width:7px;height:7px;border-radius:50%;background:#26384e}.cyan{color:var(--cyan)}.green{color:var(--success)}"+
".visual{position:relative;min-height:500px;border:1px solid var(--line);border-radius:25px;background:linear-gradient(180deg,rgba(11,23,40,.86),rgba(6,12,22,.62));overflow:hidden;display:grid;place-items:center;box-shadow:0 35px 100px rgba(0,0,0,.25)}.visual:before{content:'';position:absolute;inset:22px;border:1px dashed rgba(74,218,255,.11);border-radius:20px}.avatar{width:145px;height:145px;border-radius:50%;object-fit:cover;border:1px solid var(--line2);box-shadow:0 0 50px rgba(74,218,255,.22);background:#081322}.visual-core{display:grid;place-items:center;gap:14px;position:relative;z-index:1}.network-map{display:flex;flex-direction:column;align-items:center;gap:12px}.node{min-width:170px;text-align:center;padding:12px 16px;border-radius:12px;background:#081522;border:1px solid var(--line2);font:600 10px JetBrains Mono,monospace;box-shadow:0 0 30px rgba(74,218,255,.08)}.connector{width:1px;height:24px;background:linear-gradient(var(--cyan),transparent)}.clients{display:flex;gap:14px}.client-dot{width:13px;height:13px;border:1px solid var(--cyan);border-radius:50%;box-shadow:0 0 16px rgba(74,218,255,.55);animation:pulse 2.6s infinite}.client-dot:nth-child(2){animation-delay:.5s}.client-dot:nth-child(3){animation-delay:1s}.client-dot:nth-child(4){animation-delay:1.5s}@keyframes pulse{50%{transform:scale(1.35);opacity:.45}}"+
".section{padding:85px 0}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:28px}.section-title{display:flex;align-items:baseline;gap:12px}.section-title span{font:600 10px JetBrains Mono,monospace;color:var(--cyan)}.section-title h2{font-size:30px;margin:0}.section-lead{color:#7889a0;font-size:11px;max-width:440px;text-align:left}.grid{display:grid;gap:16px}.cols2{grid-template-columns:1.2fr .8fr}.cols3{grid-template-columns:repeat(3,1fr)}.cols4{grid-template-columns:repeat(4,1fr)}.card{background:var(--panel);border:1px solid var(--line);border-radius:17px;padding:22px;box-shadow:0 22px 70px rgba(0,0,0,.18);backdrop-filter:blur(14px)}.card p{color:#9eacc0;line-height:1.95}.code-card{direction:ltr;text-align:left;font:11px/1.8 JetBrains Mono,monospace;color:#b9c8da;overflow:auto}.chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.chip{padding:7px 9px;border:1px solid var(--line);background:rgba(255,255,255,.025);border-radius:8px;color:#bdcadb;font-size:10px}.skill-card{position:relative;overflow:hidden}.skill-card:after{content:'';position:absolute;width:100px;height:100px;right:-35px;bottom:-40px;border-radius:50%;background:rgba(74,218,255,.07);filter:blur(10px)}"+
".projects-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.filter{padding:8px 11px;border-radius:9px;border:1px solid var(--line);background:rgba(255,255,255,.02);color:#899ab1;font-size:10px;cursor:pointer}.filter.active{color:#fff;border-color:var(--line2);background:rgba(74,218,255,.07)}.project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.project-card{padding:0;overflow:hidden}.project-image{height:250px;background:linear-gradient(135deg,#091426,#06101d);overflow:hidden;position:relative}.project-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .45s}.project-card:hover .project-image img{transform:scale(1.045)}.project-image:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(3,8,17,.85));pointer-events:none}.project-body{padding:20px}.project-kicker{font:600 9px JetBrains Mono,monospace;color:var(--cyan);text-transform:uppercase}.project-body h3{margin:6px 0 8px;font-size:21px}.project-body p{margin:0;color:#9eacc0;line-height:1.9;font-size:13px}.project-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px}.link-btn{display:inline-flex;align-items:center;gap:7px;color:var(--cyan);font-size:11px}.image-btn{border:0;background:none;color:#9bacbf;cursor:pointer;display:inline-flex;gap:6px;align-items:center;font-size:10px}"+
".timeline{max-width:900px;border-right:1px solid var(--line);padding-right:22px}.timeline-item{position:relative;margin-bottom:16px}.timeline-item:before{content:'';position:absolute;right:-29px;top:25px;width:11px;height:11px;border:2px solid var(--cyan);background:var(--bg);border-radius:50%;box-shadow:0 0 16px rgba(74,218,255,.35)}.timeline-date{font:600 10px JetBrains Mono,monospace;color:var(--cyan)}.cert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.cert-card{padding:0;overflow:hidden;cursor:pointer}.cert-image{height:200px;background:linear-gradient(135deg,#091525,#07101d);overflow:hidden}.cert-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}.cert-card:hover .cert-image img{transform:scale(1.035)}.cert-body{padding:17px}.cert-body h3{margin:0 0 6px;font-size:15px}.cert-body p{margin:0;color:#8f9fb5;font-size:11px}.contact-card{display:flex;align-items:center;justify-content:center;gap:9px;min-height:76px}.reveal{opacity:0;transform:translateY(16px);transition:opacity .65s ease,transform .65s ease}.reveal.show{opacity:1;transform:none}.footer{border-top:1px solid var(--line);padding:28px 0 40px;text-align:center;color:#6f8097;font-size:10px}"+
".modal{position:fixed;inset:0;background:rgba(0,0,0,.80);display:grid;place-items:center;z-index:80;padding:18px;backdrop-filter:blur(8px)}.modal-box{width:min(920px,96vw);max-height:92vh;overflow:auto;background:#07111f;border:1px solid var(--line);border-radius:18px;box-shadow:0 40px 100px rgba(0,0,0,.45)}.modal-head{display:flex;justify-content:space-between;gap:15px;align-items:center;padding:15px 18px;border-bottom:1px solid var(--line)}.close{border:0;background:transparent;color:#b6c5d8;cursor:pointer}.modal-image{width:100%;max-height:75vh;object-fit:contain;background:#02060d}.empty{padding:28px;text-align:center;color:#718199;border:1px dashed var(--line);border-radius:14px}"+
".admin-shell{min-height:100vh;display:grid;grid-template-columns:250px 1fr;background:var(--bg)}.admin-side{border-left:1px solid var(--line);padding:20px 15px;background:#08111f;display:flex;flex-direction:column;gap:5px}.admin-side button{display:flex;align-items:center;gap:8px;border:0;background:transparent;color:#8797ab;padding:11px;border-radius:9px;text-align:right;cursor:pointer;width:100%;font-size:11px}.admin-side button:hover,.admin-side button.active{background:#102035;color:#fff}.admin-main{width:min(1100px,100%);margin:auto;padding:34px}.admin-top{display:flex;justify-content:space-between;align-items:start;gap:20px;margin-bottom:20px}.admin-title h1{margin:0;font-size:29px}.admin-title p{color:#71829a;font-size:11px}.field{display:block;margin:10px 0}.field span{display:block;color:#8999ae;font-size:10px;margin-bottom:6px}.field input,.field textarea{width:100%;padding:11px 12px;background:#060d17;border:1px solid var(--line);border-radius:9px;color:#edf5ff;outline:none}.field textarea{min-height:105px;resize:vertical}.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px 12px}.admin-panel{background:var(--panel);border:1px solid var(--line);border-radius:17px;padding:22px}.admin-panel h2{margin-top:0}.admin-list{display:grid;gap:7px;margin-top:20px}.admin-list>div{display:flex;align-items:center;gap:12px;justify-content:space-between;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.02)}.admin-list button{border:0;background:none;color:var(--danger);cursor:pointer}.thumb{width:58px;height:42px;border-radius:7px;object-fit:cover;background:#081321;border:1px solid var(--line)}.preview{margin-top:8px;width:100%;max-height:170px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}.notice{padding:10px 12px;border:1px solid rgba(74,218,255,.2);background:rgba(74,218,255,.05);color:#9edff1;border-radius:9px;font-size:11px;margin-bottom:14px}.error{padding:10px 12px;border:1px solid rgba(255,127,152,.2);background:rgba(120,20,40,.25);color:#ff9daf;border-radius:9px;font-size:11px;margin:10px 0}"+
"@media(max-width:900px){.hero{grid-template-columns:1fr;padding:70px 0}.visual{min-height:410px}.cols2,.cols3,.cols4,.project-grid,.cert-grid{grid-template-columns:1fr}.section{padding:62px 0}.section-lead{display:none}.navlinks{position:absolute;display:none;top:78px;right:0;left:0;padding:15px 18px;background:#08111f;border-bottom:1px solid var(--line);flex-direction:column;align-items:stretch}.navlinks.open{display:flex}.menu{display:block}.admin-shell{grid-template-columns:1fr}.admin-side{border-left:0;border-bottom:1px solid var(--line)}.admin-side button{display:none}.admin-main{padding:20px 15px}.form-grid{grid-template-columns:1fr}.timeline{padding-right:16px}.timeline-item:before{right:-23px}}@media(max-width:600px){.container{width:min(100% - 24px,1180px)}.hero h1{font-size:45px}.hero h2{font-size:18px}.project-image{height:210px}.cert-image{height:180px}.card{padding:18px}}";

function Style(){return <style>{css}</style>}

function SafeImage({src,alt,className}){const[bad,setBad]=useState(false);if(!src||bad)return <div className={className+" empty"}><Sparkles size={22}/><div>لا توجد صورة</div></div>;return <img className={className} src={src} alt={alt||""} loading="lazy" onError={()=>setBad(true)}/>}

function App(){
  const isAdminPath=window.location.pathname.replace(/\/+$/,"")==="/admin";
  const[data,setData]=useState(null),[loading,setLoading]=useState(true),[user,setUser]=useState(null);
  useEffect(()=>{
    if(!ref){setData(emptyData);setLoading(false);return}
    const stopData=onSnapshot(ref,s=>{setData(s.exists()?normalize(s.data()):normalize(null));setLoading(false)},()=>{setData(emptyData);setLoading(false)});
    const stopAuth=auth?onAuthStateChanged(auth,setUser):()=>{};
    return()=>{stopData();stopAuth()};
  },[]);
  useEffect(()=>{
    if(loading)return;
    const els=document.querySelectorAll(".reveal");
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.08});
    els.forEach(e=>io.observe(e));
    return()=>io.disconnect();
  },[loading]);
  if(loading)return <><Style/><div className="empty" style={{margin:"180px auto",maxWidth:480}}>جاري تحميل بيانات الموقع...</div></>;
  if(isAdminPath)return <><Style/><AdminAccess user={user} data={data} setData={setData}/></>;
  return <><Style/><Home data={data}/></>;
}

function Home({data:d}){
  const[menu,setMenu]=useState(false),[projectFilter,setProjectFilter]=useState("الكل"),[selected,setSelected]=useState(null);
  const groups=useMemo(()=>{const g={};d.skills.forEach(x=>{const k=x.type||"مهارات";if(!g[k])g[k]=[];g[k].push(x)});return g},[d.skills]);
  const filters=["الكل"].concat(Array.from(new Set(d.projects.flatMap(x=>String(x.tags||"").split(",").map(t=>t.trim()).filter(Boolean)))));
  const projects=d.projects.filter(x=>projectFilter==="الكل"||String(x.tags||"").split(",").map(t=>t.trim()).includes(projectFilter));
  return <div>
    <header className="nav">
      <a href="#" className="brand"><span>&gt;_</span> HANI.RYAD</a>
      <button className="menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      <nav className={"navlinks "+(menu?"open":"")}>{["about","skills","projects","experience","education","certificates","contact"].map(x=><a key={x} href={"#"+x} onClick={()=>setMenu(false)}>{x}</a>)}</nav>
    </header>
    <div className="container hero reveal">
      <div>
        <div className="eyebrow"><i>●</i> SYSTEM ONLINE · DEVELOPER / NETWORK</div>
        <h1>{d.profile.name||"هاني رياض الحاشدي"}</h1>
        <h2>{d.profile.role||"Application Developer & Network Enthusiast"}</h2>
        <p>{d.profile.bio||"ملفي المهني وأعمالي ومشاريعي التقنية."}</p>
        <div className="actions">
          <a className="btn primary" href="#projects">استكشف المشاريع <ArrowUpRight size={15}/></a>
          {d.profile.cvUrl&&<a className="btn" href={d.profile.cvUrl} target="_blank" rel="noreferrer"><Download size={15}/> تحميل CV</a>}
        </div>
        <div className="hero-meta">
          {d.profile.location&&<span><MapPin size={13}/> {d.profile.location}</span>}
          {d.profile.availability&&<span><Sparkles size={13}/> {d.profile.availability}</span>}
          {d.profile.email&&<span><Mail size={13}/> {d.profile.email}</span>}
        </div>
        <div className="terminal">
          <div className="terminal-top"><span className="dot"/><span className="dot"/><span className="dot"/><b>hani@portfolio ~</b></div>
          <span className="green">hani@portfolio</span>:~$ whoami<br/>
          application_developer · network_enthusiast<br/>
          <span className="green">hani@portfolio</span>:~$ status<br/>
          <span className="cyan">available_for_projects = true</span>
        </div>
      </div>
      <div className="visual">
        <div className="visual-core">
          {d.profile.avatarUrl&&<SafeImage src={d.profile.avatarUrl} alt={d.profile.name} className="avatar"/>}
          <div className="network-map">
            <div className="node">{d.network.internetLabel||"INTERNET"}</div>
            <div className="connector"/><div className="node">{d.network.routerLabel||"MikroTik / ROUTER"}</div>
            <div className="connector"/><div className="node">{d.network.switchLabel||"CORE SWITCH"}</div>
            <div className="clients">{[1,2,3,4].map(x=><span className="client-dot" key={x}/>)}</div>
          </div>
        </div>
      </div>
    </div>

    <Section id="about" n="01" t="من أنا">
      <div className="grid cols2 reveal">
        <div className="card"><p>{d.profile.bio||"أضف نبذة تعريفية من لوحة التحكم."}</p><div className="chips">{d.skills.slice(0,8).map(x=><span className="chip" key={x.id}>{x.name}</span>)}</div></div>
        <div className="card code-card"><div className="cyan">profile.json</div><br/>{JSON.stringify({name:d.profile.name,role:d.profile.role,location:d.profile.location,projects:d.projects.length,certificates:d.certificates.length},null,2)}</div>
      </div>
    </Section>

    <Section id="skills" n="02" t="المهارات">
      {Object.keys(groups).length?<div className="grid cols3">{Object.entries(groups).map(([k,v])=><div className="card skill-card reveal" key={k}><div className="cyan" style={{fontSize:10}}>STACK / {k}</div><h3>{k}</h3><div className="chips">{v.map(x=><span className="chip" key={x.id}>{x.name}</span>)}</div></div>)}</div>:<Empty text="أضف مهاراتك من لوحة التحكم."/>}
    </Section>

    <Section id="projects" n="03" t="المشاريع">
      {d.projects.length?<div className="reveal">
        <div className="projects-toolbar">{filters.map(f=><button key={f} className={"filter "+(projectFilter===f?"active":"")} onClick={()=>setProjectFilter(f)}>{f}</button>)}</div>
        <div className="project-grid">{projects.map((x,i)=><article className="card project-card reveal" key={x.id||i}>
          <div className="project-image">{x.image?<SafeImage src={x.image} alt={x.title} className="project-image-img"/>:<div className="empty" style={{height:"100%",border:0}}>صورة المشروع</div>}</div>
          <div className="project-body">
            <div className="project-kicker">PROJECT / {String(i+1).padStart(2,"0")}</div><h3>{x.title}</h3><p>{x.desc}</p>
            <div className="chips">{String(x.tags||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=><span className="chip" key={t}>{t}</span>)}</div>
            <div className="project-footer">
              <button className="image-btn" onClick={()=>setSelected({type:"project",item:x})}><Eye size={14}/> معاينة</button>
              {x.link&&x.link!=="#"&&<a className="link-btn" href={x.link} target="_blank" rel="noreferrer">المشروع <ExternalLink size={14}/></a>}
            </div>
          </div>
        </article>)}</div>
      </div>:<Empty text="أضف مشاريعك وصورها من لوحة التحكم."/>}
    </Section>

    {(d.network.note||d.network.internetLabel||d.network.routerLabel||d.network.switchLabel)&&<Section id="network" n="04" t="مختبر الشبكات"><div className="card reveal"><div className="grid cols3"><div className="node">{d.network.internetLabel}</div><div className="node">{d.network.routerLabel}</div><div className="node">{d.network.switchLabel}</div></div>{d.network.note&&<p>{d.network.note}</p>}</div></Section>}

    <Section id="experience" n="05" t="الخبرات">
      {d.experience.length?<div className="timeline">{d.experience.map(x=><div className="card timeline-item reveal" key={x.id}><div className="timeline-date">{x.period}</div><h3>{x.title}</h3><b>{x.org}</b><p>{x.desc}</p></div>)}</div>:<Empty text="أضف خبراتك من لوحة التحكم."/>}
    </Section>

    <Section id="education" n="06" t="التعليم">
      {d.education.length?<div className="grid cols3">{d.education.map(x=><div className="card reveal" key={x.id}><GraduationCap className="cyan"/><div className="timeline-date">{x.period}</div><h3>{x.degree}</h3><b>{x.org}</b><p>{x.desc}</p></div>)}</div>:<Empty text="أضف مؤهلاتك التعليمية من لوحة التحكم."/>}
    </Section>

    <Section id="certificates" n="07" t="الشهادات">
      {d.certificates.length?<div className="cert-grid">{d.certificates.map((x,i)=><article className="card cert-card reveal" key={x.id||i} onClick={()=>setSelected({type:"certificate",item:x})}>
        <div className="cert-image">{x.image?<SafeImage src={x.image} alt={x.name} className="cert-image-img"/>:<div className="empty" style={{height:"100%",border:0}}><ShieldCheck size={26}/><div>صورة الشهادة</div></div>}</div>
        <div className="cert-body"><h3>{x.name}</h3><p>{x.issuer||"Certificate"} {x.year?"· "+x.year:""}</p></div>
      </article>)}</div>:<Empty text="أضف شهاداتك وصورها من لوحة التحكم."/>}
    </Section>

    <Section id="contact" n="08" t="تواصل معي">
      <div className="grid cols4 reveal">
        {d.profile.email&&<a className="card contact-card" href={"mailto:"+d.profile.email}><Mail className="cyan" size={19}/><span>{d.profile.email}</span></a>}
        {d.profile.phone&&<a className="card contact-card" href={"tel:"+d.profile.phone}><Phone className="cyan" size={19}/><span>{d.profile.phone}</span></a>}
        {d.profile.github&&<a className="card contact-card" href={d.profile.github} target="_blank" rel="noreferrer"><Code2 className="cyan" size={19}/><span>GitHub</span></a>}
        {d.profile.linkedin&&<a className="card contact-card" href={d.profile.linkedin} target="_blank" rel="noreferrer"><Briefcase className="cyan" size={19}/><span>LinkedIn</span></a>}
      </div>
    </Section>
    <footer className="footer">© {new Date().getFullYear()} {d.profile.name||"HANI.RYAD"} · Developer / Network Engineer</footer>
    {selected&&<MediaModal selected={selected} close={()=>setSelected(null)}/>}
  </div>
}

function Section({id,n,t,children}){return <section id={id} className="container section"><div className="section-head"><div className="section-title"><span>{n} //</span><h2>{t}</h2></div><div className="section-lead">Professional profile · applications · networking · continuous learning</div></div>{children}</section>}
function Empty({text}){return <div className="empty">{text}</div>}

function MediaModal({selected,close}){
  const item=selected.item;
  return <div className="modal" onClick={close}><div className="modal-box" onClick={e=>e.stopPropagation()}><div className="modal-head"><strong>{item.title||item.name}</strong><button className="close" onClick={close}><X/></button></div><SafeImage src={item.image} alt={item.title||item.name} className="modal-image"/><div style={{padding:18}}>{item.desc&&<p style={{color:"#9eacc0",lineHeight:1.9}}>{item.desc}</p>}{item.issuer&&<p style={{color:"#9eacc0"}}>{item.issuer} {item.year?"· "+item.year:""}</p>}{item.credential&&<a className="btn primary" href={item.credential} target="_blank" rel="noreferrer">رابط التحقق <ExternalLink size={14}/></a>}</div></div></div>
}

function AdminAccess({user,data,setData}){
  const[authMode,setAuthMode]=useState(!user);
  useEffect(()=>{setAuthMode(!user)},[user]);
  return user?<Dashboard data={data} setData={setData} user={user} close={()=>{window.location.href="/"}}/>:<Login close={()=>{window.location.href="/"}}/>;
}

function Login({close}){
  const[email,setEmail]=useState(""),[pass,setPass]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  async function go(e){e.preventDefault();setBusy(true);setErr("");try{if(!auth)throw Error("Firebase غير مُعد بعد");await signInWithEmailAndPassword(auth,email,pass)}catch(x){setErr(x.message)}finally{setBusy(false)}}
  return <div className="modal"><form className="modal-box" style={{width:"min(430px,96vw)",padding:24}} onSubmit={go}><div className="modal-head" style={{padding:0,border:0}}><h2>دخول لوحة التحكم</h2><button type="button" className="close" onClick={close}><X/></button></div><Field label="البريد الإلكتروني" value={email} set={setEmail}/><Field label="كلمة المرور" type="password" value={pass} set={setPass}/>{err&&<div className="error">{err}</div>}<button className="btn primary" disabled={busy}>{busy?"جاري الدخول...":"تسجيل الدخول"}</button></form></div>
}

function Dashboard({data,setData,user,close}){
  const[d,setD]=useState(normalize(data)),[tab,setTab]=useState("profile"),[msg,setMsg]=useState("");
  useEffect(()=>setD(normalize(data)),[data]);
  async function save(next){setD(next);if(!ready)return setMsg("Firebase غير مُعد");try{await setDoc(ref,next);setData(next);setMsg("تم الحفظ على السحابة ✓")}catch(e){setMsg("تعذر الحفظ: "+e.message)}}
  function add(k,x){save({...d,[k]:[...d[k],{...x,id:crypto.randomUUID()}]})}
  function del(k,id){save({...d,[k]:d[k].filter(x=>x.id!==id)})}
  const tabs=[["profile","المعلومات الشخصية",Briefcase],["skills","المهارات",Code2],["projects","المشاريع",ArrowUpRight],["experience","الخبرات",Briefcase],["education","التعليم",GraduationCap],["certificates","الشهادات",ShieldCheck],["network","مختبر الشبكات",Network]];
  return <div className="admin-shell"><aside className="admin-side"><h3><span className="cyan">&gt;_</span> HANI.ADMIN</h3><p style={{fontSize:10,color:"#6f8097",wordBreak:"break-all"}}>{user.email}</p>{tabs.map(([k,label,I])=><button className={tab===k?"active":""} onClick={()=>setTab(k)} key={k}><I size={15}/>{label}</button>)}<button onClick={async()=>{await signOut(auth);close()}} style={{marginTop:"auto"}}><LogOut size={15}/> الموقع العام</button></aside><main className="admin-main"><div className="admin-top"><div className="admin-title"><h1>لوحة التحكم</h1><p>إدارة محتوى Portfolio والمشاريع والصور من مكان واحد.</p></div></div>{msg&&<div className="notice">{msg}</div>}{tab==="profile"&&<ProfileEditor data={d} save={save}/>}
  {tab==="skills"&&<CollectionEditor title="المهارات" items={d.skills} fields={["name","type"]} add={x=>add("skills",x)} del={id=>del("skills",id)}/>}
  {tab==="projects"&&<CollectionEditor title="المشاريع" items={d.projects} fields={["title","desc","tags","link","image"]} add={x=>add("projects",x)} del={id=>del("projects",id)} imageField="image"/>}
  {tab==="experience"&&<CollectionEditor title="الخبرات" items={d.experience} fields={["title","org","period","desc"]} add={x=>add("experience",x)} del={id=>del("experience",id)}/>}
  {tab==="education"&&<CollectionEditor title="التعليم" items={d.education} fields={["degree","org","period","desc"]} add={x=>add("education",x)} del={id=>del("education",id)}/>}
  {tab==="certificates"&&<CollectionEditor title="الشهادات" items={d.certificates} fields={["name","issuer","year","credential","image"]} add={x=>add("certificates",x)} del={id=>del("certificates",id)} imageField="image"/>}
  {tab==="network"&&<NetworkEditor data={d} save={save}/>}</main></div>
}

function ProfileEditor({data,save}){
  const[d,setD]=useState(data);useEffect(()=>setD(data),[data]);
  const set=(k,v)=>setD({...d,profile:{...d.profile,[k]:v}});
  return <div className="admin-panel"><h2>المعلومات الشخصية</h2><div className="form-grid">
    {["name","role","bio","location","email","phone","github","linkedin","avatarUrl","cvUrl","availability"].map(k=><Field key={k} label={k==="avatarUrl"?"رابط الصورة HTTPS":k==="cvUrl"?"رابط CV PDF HTTPS":k} type={k==="bio"?"textarea":"text"} value={d.profile[k]} set={v=>set(k,v)}/>)}
  </div>{d.profile.avatarUrl&&<img className="preview" src={d.profile.avatarUrl} alt="preview" onError={e=>e.currentTarget.style.display="none"}/>}<button className="btn primary" onClick={()=>save(d)}><Save size={15}/> حفظ المعلومات</button></div>
}

function NetworkEditor({data,save}){
  const[d,setD]=useState(data);useEffect(()=>setD(data),[data]);
  const set=(k,v)=>setD({...d,network:{...d.network,[k]:v}});
  return <div className="admin-panel"><h2>مختبر الشبكات</h2><Field label="Internet" value={d.network.internetLabel} set={v=>set("internetLabel",v)}/><Field label="Router" value={d.network.routerLabel} set={v=>set("routerLabel",v)}/><Field label="Switch" value={d.network.switchLabel} set={v=>set("switchLabel",v)}/><Field label="وصف المختبر" type="textarea" value={d.network.note} set={v=>set("note",v)}/><button className="btn primary" onClick={()=>save(d)}><Save size={15}/> حفظ</button></div>
}

function CollectionEditor({title,items,fields,add,del,imageField}){
  const blank=()=>Object.fromEntries(fields.map(f=>[f,""]));const[x,setX]=useState(blank());
  const labels={name:"الاسم",issuer:"الجهة",year:"السنة",credential:"رابط التحقق",image:"رابط الصورة HTTPS",title:"العنوان",desc:"الوصف",tags:"التقنيات (بفواصل)",link:"رابط المشروع",type:"التصنيف",org:"الجهة",period:"الفترة",degree:"المؤهل"};
  return <div className="admin-panel"><h2>{title}</h2><div className="form-grid">{fields.map(f=><Field key={f} label={labels[f]||f} type={f==="desc"?"textarea":"text"} value={x[f]} set={v=>setX({...x,[f]:v})}/>)}</div>{imageField&&x[imageField]&&<img className="preview" src={x[imageField]} alt="preview" onError={e=>e.currentTarget.style.display="none"}/>}<button className="btn primary" onClick={()=>{add(x);setX(blank())}}><Plus size={15}/> إضافة</button><div className="admin-list">{items.map(i=><div key={i.id}>{imageField&&i[imageField]?<img className="thumb" src={i[imageField]} alt=""/>:null}<div style={{marginRight:"auto"}}><strong>{i[fields[0]]}</strong><div style={{fontSize:9,color:"#75869d"}}>{i[fields[1]]||""}</div></div><button onClick={()=>del(i.id)} title="حذف"><Trash2 size={15}/></button></div>)}</div></div>
}

function Field({label,value,set,type="text"}){return <label className="field"><span>{label}</span>{type==="textarea"?<textarea value={value||""} onChange={e=>set(e.target.value)}/>:<input type={type} value={value||""} onChange={e=>set(e.target.value)}/>}</label>}

createRoot(document.getElementById("root")).render(<App/>);