export const initialData = {
  profile: {
    name: 'هاني رياض الحاشدي',
    role: 'مطور تطبيقات | مهتم بهندسة الشبكات',
    bio: 'أبني تطبيقات عملية بواجهات حديثة، وأهتم بتقنيات الشبكات وCisco وMikroTik والبنية التحتية.',
    location: 'اليمن',
    email: 'your@email.com', phone: '+967',
    github: 'https://github.com/', linkedin: 'https://linkedin.com/',
    avatarUrl: '', cvUrl: ''
  },
  skills: [
    {id:'s1',name:'Flutter',type:'Development'}, {id:'s2',name:'Dart',type:'Development'},
    {id:'s3',name:'Firebase',type:'Development'}, {id:'s4',name:'JavaScript',type:'Development'},
    {id:'s5',name:'Cisco / CCNA',type:'Networking'}, {id:'s6',name:'MikroTik',type:'Networking'},
    {id:'s7',name:'VLAN / HSRP / DHCP',type:'Networking'}, {id:'s8',name:'Wireshark',type:'Tools'}
  ],
  projects: [
    {id:'p1',title:'شبكتي',desc:'تطبيق لإدارة شبكات WiFi المدفوعة والبطاقات والوكلاء والتكامل مع MikroTik.',tags:'Flutter, Firebase, MikroTik',link:'#',imageUrl:''},
    {id:'p2',title:'Network Lab',desc:'مختبر شبكات لتطبيق VLAN وHSRP وDHCP وRouting باستخدام Cisco Packet Tracer.',tags:'Cisco, CCNA, Networking',link:'#',imageUrl:''}
  ],
  experience: [
    {id:'e1',title:'مطور تطبيقات مستقل',org:'Freelance',period:'2025 — الآن',desc:'تطوير تطبيقات Android وواجهات UI/UX وحلول تعتمد على Firebase.'},
    {id:'e2',title:'مزود خدمة / إدخال بيانات',org:'مؤسسة يمان للتنمية الصحية والاجتماعية',period:'2026',desc:'تنفيذ أعمال خدمة وإدخال ومعالجة البيانات.'}
  ],
  education: [
    {id:'ed1',degree:'Information Systems & Computer Technology',org:'التعليم الأكاديمي',period:'—',desc:'دراسة في مجال نظم المعلومات وتقنية الحاسوب.'}
  ],
  certificates: [
    {id:'c1',name:'CCNA: Introduction to Networks',year:'2026'},
    {id:'c2',name:'Network Support And Security',year:'2025'},
    {id:'c3',name:'Introduction Of Cybersecurity',year:'2025'}
  ],
  settings: {showNetworkSection:true}
};