// Local interactive prototype. All schedules/notices are demonstration data.
const demoToday = new Date(2026, 8, 18);
const demoMinutes = 9 * 60 + 41;
let selectedDay = 4;
let homeDay = 4;
let homeSource = 'school';
let noticeSource = 'all';
let activeNotice = null;
const readNotices = new Set();
const savedNotices = new Set();
const remindedNotices = new Set();
const courseNotes = { 'course-card-1': '随堂测验复习' };
const statutoryHolidays = {
  '2026-09-25': '中秋节', '2026-09-26': '中秋节', '2026-09-27': '中秋节',
  '2026-10-01': '国庆节', '2026-10-02': '国庆节', '2026-10-03': '国庆节',
  '2026-10-04': '国庆节', '2026-10-05': '国庆节', '2026-10-06': '国庆节', '2026-10-07': '国庆节',
  '2026-09-20': '调休上班', '2026-10-10': '调休上班'
};
let scheduleView = 'day';
const courses = [
  { id: 'course-card-1', title: '数据结构与算法设计 (C++)', short: '数据结构', room: '诚毅教学楼 3-402', teacher: '张教授 · 计算机工程学院', start: '08:00', end: '09:35', slot: 0, days: [0, 2], color: '#963b48', weeks: 16 },
  { id: 'course-card-2', title: '操作系统原理与实践', short: '操作系统', room: '尚大楼 1405', teacher: '李副教授 · 计算机工程学院', start: '10:00', end: '11:35', slot: 1, days: [0, 4], color: '#48799c', weeks: 16 },
  { id: 'course-card-3', title: '毛泽东思想和中国特色社会主义理论体系概论', short: '概论', room: '美贤楼 208', teacher: '王教授 · 马克思主义学院', start: '14:00', end: '15:35', slot: 2, days: [2], color: '#398474', weeks: 16 },
  { id: 'course-card-4', title: '线性代数', short: '线性代数', room: '美贤楼 102', teacher: '陈老师 · 理学院', start: '10:00', end: '11:35', slot: 1, days: [1], color: '#766099', weeks: 18 },
  { id: 'course-card-5', title: '大学英语', short: '大学英语', room: '尚大楼 301', teacher: '刘老师 · 外国语学院', start: '08:00', end: '09:35', slot: 0, days: [4], color: '#ad773a', weeks: 18 },
  { id: 'course-card-6', title: '体育 · 羽毛球', short: '体育', room: '综合体育馆', teacher: '黄老师 · 体育学院', start: '14:00', end: '15:35', slot: 2, days: [3], color: '#448575', weeks: 16 },
  { id: 'course-card-7', title: '软件工程课程设计', short: '软件工程', room: '尚大楼 1402', teacher: '林老师 · 计算机工程学院', start: '14:00', end: '15:35', slot: 2, days: [4], color: '#766099', weeks: 16 }
];
const notices = [
  { id: 'course-confirm', source: 'school', unit: '教务处', tag: '重要', date: '2026-09-18', title: '关于秋季学期选课确认的通知', summary: '请在 9 月 20 日前核对本学期课程，别错过最后确认时间。', deadline: '2026-09-20 17:00', body: ['请同学们登录教务系统，核对 2026–2027 学年秋季学期的课程、学分与上课时间，并在截止时间前完成选课确认。', '如发现课程遗漏、时间冲突或学分异常，请先联系所在学院教学秘书，核实后按教务系统中的流程申请调整。', '确认前请检查个人课表是否与选课结果一致。详细要求以教务处正式通知为准。'] },
  { id: 'library', source: 'school', unit: '图书馆', tag: '服务', date: '2026-09-17', title: '图书馆周末开放安排', summary: '周末自习不扑空，出发前看一眼开放时间。', body: ['本周末图书馆阅览空间开放时间为 08:00–22:00，借还书服务时间为 08:30–17:30。', '请按预约规则使用座位，离馆时带走个人物品。各阅览室具体安排以馆内公告为准。'] },
  { id: 'network', source: 'school', unit: '信息化中心', tag: '服务', date: '2026-09-16', title: '校园网络维护时段提醒', summary: '9 月 19 日凌晨进行例行维护，请提前保存学习资料。', deadline: '2026-09-19 00:00', body: ['校园网络计划于 9 月 19 日 00:00–02:00 进行例行维护。部分服务可能短暂中断，请提前保存资料。', '维护完成后服务将恢复。如仍无法连接，可通过信息化中心服务渠道反馈。'] },
  { id: 'innovation', source: 'college', unit: '计算机工程学院', tag: '报名', date: '2026-09-17', title: '创新项目申报截止提醒', summary: '有想法就一起试试。本轮项目申报将于 9 月 25 日截止。', deadline: '2026-09-25 18:00', body: ['本轮大学生创新训练项目申报面向有兴趣开展研究与实践的同学，请提前联系指导老师并组建项目小组。', '申报材料包括项目计划书、团队成员信息与进度安排。请在截止时间前按学院通知要求提交。', '建议预留时间与老师沟通，完善方案与分工。具体名额、资格与材料要求以学院正式通知为准。'] },
  { id: 'talk', source: 'college', unit: '计算机工程学院', tag: '讲座', date: '2026-09-16', title: '周五见：从课程项目到开源贡献', summary: '一起聊聊如何把课堂里的小想法，变成能被更多人使用的作品。', deadline: '2026-09-18 19:00', body: ['本周五 19:00，在尚大楼 1405 举办开源实践交流活动，欢迎对软件开发与开源协作感兴趣的同学参加。', '内容包括项目入门、协作流程以及学长学姐的实践分享。可提前准备想讨论的问题。'] },
  { id: 'lab', source: 'college', unit: '计算机工程学院', tag: '通知', date: '2026-09-15', title: '本学期实验室开放预约说明', summary: '查看开放时段与预约要求，合理安排课程项目。', body: ['本学期实验室开放预约已启动，请根据课程项目需求选择时段。', '首次预约前请完成实验室使用须知阅读。进入实验室后请遵守设备使用和安全管理规定。'] }
];

function icon(name) { return '<i aria-hidden="true" class="ui-icon" style="--icon:url(assets/icons/' + name + '.svg)"></i>'; }
function hydrateIcons() { document.querySelectorAll('[data-icon]').forEach(el => { el.style.setProperty('--icon', 'url(assets/icons/' + el.dataset.icon + '.svg)'); el.setAttribute('aria-hidden', 'true'); }); }
function dayDate(week, day) { return new Date(2026, 7, 31 + (week - 1) * 7 + day); }
function dateLabel(date) { return (date.getMonth() + 1) + '/' + date.getDate(); }
function dateKey(date) { return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'); }
function weekStrip(week, selected, handler) {
  return Array.from({length: 7}, (_, day) => '<button aria-pressed="' + (selected === day) + '" onclick="' + handler + '(' + day + ')" aria-label="' + dateLabel(dayDate(week,day)) + ' 周' + '一二三四五六日'[day] + '"><strong>' + dateLabel(dayDate(week,day)) + '</strong><span>周' + '一二三四五六日'[day] + '</span></button>').join('');
}
function dayCourses(week, day) { return courses.filter(course => course.days.includes(day) && week <= course.weeks).sort((a,b)=>a.start.localeCompare(b.start)); }
function homeCourse() {
  const list = dayCourses(3,homeDay);
  return homeDay === 4 ? list.find(c => Number(c.end.slice(0,2)) * 60 + Number(c.end.slice(3)) > demoMinutes) : list[0];
}
function selectHomeDay(day) { homeDay = day; renderCampusHome(); }
function renderCampusHome() {
  document.getElementById('homeWeekStrip').innerHTML = weekStrip(3,homeDay,'selectHomeDay');
  const course = homeCourse();
  document.getElementById('nextClassHeading').textContent = homeDay === 4 ? '下一节课' : '当日课程';
  document.getElementById('nextClassCard').innerHTML = course ? '<div class="course-title-row"><span class="class-label">' + (homeDay === 4 ? '即将开始' : '第 ' + (course.slot*2+1) + '–' + (course.slot*2+2) + ' 节') + '</span><h3>' + course.title + '</h3></div><div class="class-meta"><span>' + icon('clock') + course.start + '–' + course.end + '</span><span>' + icon('map-pin') + course.room + '</span></div>' : '<span class="class-label">自由安排</span><h3>这一天没有课程</h3><div class="class-meta">去自习，或给自己放个小假。</div>';
  document.getElementById('nextClassCard').disabled = !course;
  document.getElementById('nextClassCard').setAttribute('aria-label', course ? course.title + '，' + course.start + '至' + course.end + '，' + course.room : '这一天没有课程，去自习，或给自己放个小假');
  document.getElementById('nextClassCard').classList.toggle('is-free-day', !course);
  document.getElementById('nextClassCard').insertAdjacentHTML('beforeend', '<img class="course-illustration" src="assets/campus-study-v2.png" width="66" height="66" alt="" aria-hidden="true">');
  document.querySelectorAll('[data-home-source]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.homeSource === homeSource)));
  document.getElementById('homeNotices').innerHTML = notices.filter(n => n.source === homeSource).slice(0,2).map(noticeRow).join('');
}
function openNextCourse() { const c = homeCourse(); if (c) openCourseById(c.id); }
function setHomeNoticeSource(source) { homeSource = source; renderCampusHome(); }
function noticeRow(n) {
  return '<article class="notice-row"><button class="notice-open" onclick="openNoticeDetail(\''+n.id+'\')"><div class="notice-row-head"><h3>'+n.title+'</h3><time>'+n.date.slice(5)+(readNotices.has(n.id)?'':'<span class="unread-dot" aria-label="未读"></span>')+'</time></div><div class="notice-source"><span class="notice-tag '+(n.source === 'college'?'college':'')+'">'+n.tag+'</span>'+n.unit+(savedNotices.has(n.id)?' · 已收藏':'')+'</div><p class="notice-summary">'+n.summary+'</p>'+(n.deadline?'<span class="notice-deadline">'+(remindedNotices.has(n.id)?'已设提醒 · ':'截止：')+n.deadline.slice(5)+'</span>':'')+'</button></article>';
}
function openNoticeList(source = homeSource) { noticeSource = source; document.getElementById('noticeSearch').value = ''; document.getElementById('noticeUnread').checked = false; selectCampusModule('notices'); renderNoticeList(); }
function setNoticeSource(source) { noticeSource = source; renderNoticeList(); }
function renderNoticeList() {
  const query = document.getElementById('noticeSearch').value.trim().toLowerCase();
  const unread = document.getElementById('noticeUnread').checked;
  const list = notices.filter(n => (noticeSource === 'all' || n.source === noticeSource || noticeSource === 'saved' && savedNotices.has(n.id)) && (!unread || !readNotices.has(n.id)) && (n.title+n.unit+n.summary).toLowerCase().includes(query));
  document.querySelectorAll('[data-source]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.source === noticeSource)));
  document.getElementById('noticeCount').textContent = list.length + ' 条公告';
  document.getElementById('noticeList').innerHTML = list.length ? list.map(noticeRow).join('') : '<div class="empty-state">暂时没有符合条件的公告<br><span class="muted">换个关键词，或调整筛选试试</span></div>';
}
let noticeReturnFocus = null;
function openNoticeDetail(id) {
  activeNotice = notices.find(n => n.id === id);
  if (!activeNotice) return;
  noticeReturnFocus = document.activeElement;
  readNotices.add(id);
  document.getElementById('noticeDetailTitle').textContent = activeNotice.title;
  document.getElementById('noticeDetailMeta').textContent = activeNotice.unit + ' · ' + activeNotice.date + ' · 已读';
  document.getElementById('noticeDetailTags').innerHTML = '<span class="notice-tag '+(activeNotice.source==='college'?'college':'')+'">'+(activeNotice.source==='college'?'学院公告':'学校公告')+'</span>';
  const deadline = document.getElementById('noticeDetailDeadline');
  deadline.hidden = !activeNotice.deadline;
  deadline.textContent = activeNotice.deadline ? '记一下时间：' + activeNotice.deadline : '';
  document.getElementById('noticeDetailBody').innerHTML = activeNotice.body.map(p => '<p>'+p+'</p>').join('');
  document.querySelector('.notice-article').scrollTop = 0;
  updateNoticeActions(); renderCampusHome(); renderNoticeList();
  document.getElementById('noticeDetail').classList.add('is-active');
  document.getElementById('noticeSave').focus();
}
function updateNoticeActions() {
  const saved = savedNotices.has(activeNotice.id);
  const save = document.getElementById('noticeSave');
  save.setAttribute('aria-pressed', String(saved)); save.setAttribute('aria-label',saved?'取消收藏':'收藏公告');
  save.innerHTML = icon(saved?'bookmark-simple-fill':'bookmark-simple');
  const reminder = document.getElementById('noticeReminder');
  reminder.textContent = activeNotice.deadline ? (remindedNotices.has(activeNotice.id) ? '已设提醒 · 点击取消' : '提醒我这件事') : (saved ? '已收藏 · 点击取消' : '收藏，稍后再看');
  document.getElementById('noticeReminderHint').textContent = activeNotice.deadline ? '本次演示中记录提醒，不发送系统通知' : '收藏后可在公告列表的「已收藏」中找到';
}
function toggleNoticeSave() { if (!activeNotice) return; const id = activeNotice.id; savedNotices.has(id) ? savedNotices.delete(id) : savedNotices.add(id); updateNoticeActions(); renderCampusHome(); renderNoticeList(); showToast(savedNotices.has(id)?'已收藏公告':'已取消收藏'); }
function toggleNoticeReminder() { if (!activeNotice) return; if (!activeNotice.deadline) return toggleNoticeSave(); const id=activeNotice.id; remindedNotices.has(id)?remindedNotices.delete(id):remindedNotices.add(id); updateNoticeActions(); renderCampusHome(); renderNoticeList(); showToast(remindedNotices.has(id)?'已记录提醒（演示）':'已取消提醒'); }
function closeNoticeDetail() { document.getElementById('noticeDetail').classList.remove('is-active'); if(noticeReturnFocus?.isConnected) noticeReturnFocus.focus(); }
function selectScheduleDay(day) { selectedDay = day; renderSchedule(); }
function openCourseById(id) {
  const c = courses.find(c => c.id === id); if (!c) return;
  openCourseDetailModal(c.title,c.room,c.teacher,c.start+' - '+c.end,'1–'+c.weeks+'周 每周上课',c.id);
  document.getElementById('courseNoteInput').value = courseNotes[id] || '';
}
function renderSchedule() {
  document.getElementById('scheduleWeekStrip').innerHTML = weekStrip(currentScheduleWeek,selectedDay,'selectScheduleDay');
  const list = dayCourses(currentScheduleWeek,selectedDay);
  document.getElementById('schedule-day-container').innerHTML = list.length ? list.map(c => '<button id="'+c.id+'" class="app-card course-card w-full text-left" style="--course-color:'+c.color+'" onclick="openCourseById(\''+c.id+'\')"><span class="course-time">'+(c.slot*2+1)+'–'+(c.slot*2+2)+'节 · '+c.start+'–'+c.end+'</span><h4>'+c.title+'</h4><p class="course-room">'+c.room+'<br>'+c.teacher+'</p><div class="course-note-badge '+(courseNotes[c.id]?'':'hidden')+'">备忘 · <span>'+escapeHtml(courseNotes[c.id]||'暂无备忘')+'</span></div></button>').join('') : '<div class="campus-panel empty-state">这一天没有课程<br><span class="muted">'+(currentScheduleWeek>18?'本学期教学周已结束':'试试切换日期，或安排一点自由时间')+'</span></div>';
  const weekChars = '一二三四五六日';
  const header = Array.from({length:7},(_,d)=>{ const date=dayDate(currentScheduleWeek,d); const key=dateKey(date); const holiday=statutoryHolidays[key]; return '<span class="schedule-day-head '+(d>4?'weekend':'')+'"><b>周'+weekChars[d]+'</b><small>'+dateLabel(date)+'</small>'+(holiday?'<em>'+holiday+'</em>':'')+'</span>'; }).join('');
  let grid = '<div class="schedule-grid"><span class="schedule-slot-head">节次</span>'+header;
  for(let slot=0;slot<6;slot++) {
    grid+='<span class="schedule-slot-label">'+(slot*2+1)+'–'+(slot*2+2)+'</span>';
    for(let d=0;d<7;d++) {
      const date=dayDate(currentScheduleWeek,d); const key=dateKey(date); const holiday=statutoryHolidays[key]; const c=dayCourses(currentScheduleWeek,d).find(c=>c.slot===slot); const note=c&&courseNotes[c.id];
      if(c) grid+='<button class="schedule-event '+(d>4?'weekend':'')+'" aria-label="周'+weekChars[d]+' '+c.title+(note?'，备忘 '+note:'')+'" onclick="openCourseById(\''+c.id+'\')"><strong>'+c.short+'</strong><small>'+c.room+'</small>'+(note?'<em>📌 '+escapeHtml(note)+'</em>':'')+'</button>';
      else grid+='<div class="grid-empty '+(d>4?'weekend ':'')+(holiday?'holiday':'')+'" aria-label="'+(holiday||'无课')+'">'+(holiday?'<small>'+holiday+'</small>':'')+'</div>';
    }
  }
  document.getElementById('schedule-week-container').innerHTML = grid+'</div><p class="muted schedule-hint">点击课程查看详情，备忘会显示在格子内</p>';
}
const originalSaveCourseNote = saveCourseNote;
saveCourseNote = function() { courseNotes[currentCourseCardId]=document.getElementById('courseNoteInput').value.trim(); originalSaveCourseNote(); renderSchedule(); };
const baseSwitchTab = switchTab;
switchTab = function(tab) { closeCampusActionSheet(); closeFeedActionSheet(); baseSwitchTab(tab); updateBottomNav(tab); document.getElementById('fabPublishBtn').classList.toggle('hidden',tab!=='feed'); };
function updateBottomNav(tab) {
  document.querySelectorAll('.bottom-nav > button').forEach(b => {
    const active = b.id === 'tab-' + tab;
    b.setAttribute('aria-current', active ? 'page' : 'false');
    b.classList.toggle('is-active', active);
  });
}
// Preserve the original four destinations while matching the selected visual language.
const nav = document.getElementById('tab-feed').parentElement;
nav.classList.add('bottom-nav');
[['feed','house','社区'],['campus','squares-four','校园功能'],['messages','chat-circle-dots','消息'],['profile','user','我的']].forEach(([id,name,label])=>{document.getElementById('tab-'+id).innerHTML=icon(name)+'<span class="mt-1">'+label+'</span>';});
// Keep the selected destination visually truthful even when inline handlers run first.
nav.addEventListener('click', event => {
  if (event.target.closest('button')) updateBottomNav(currentTab);
});
document.getElementById('fabPublishBtn').setAttribute('role','button');
document.getElementById('fabPublishBtn').setAttribute('tabindex','0');
document.getElementById('fabPublishBtn').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPublishModal();}});

// Real sample ICS export; no external calendar connection or permission needed.
doExportICS = function() {
  const stamp = d => d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  const icsText = s => s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UNIJMU//Prototype Calendar//ZH','CALSCALE:GREGORIAN'];
  courses.forEach(c=>c.days.forEach(day=>{
    const start=dayDate(1,day);
    const note=document.getElementById('exportNotes').checked ? courseNotes[c.id] : '';
    lines.push('BEGIN:VEVENT','UID:'+c.id+'-'+day+'@unijmu.prototype','DTSTAMP:20260918T014100Z','DTSTART:'+stamp(start)+'T'+String(Number(c.start.slice(0,2))-8).padStart(2,'0')+c.start.slice(3)+'00Z','DTEND:'+stamp(start)+'T'+String(Number(c.end.slice(0,2))-8).padStart(2,'0')+c.end.slice(3)+'00Z','RRULE:FREQ=WEEKLY;COUNT='+c.weeks,'SUMMARY:'+icsText(c.title),'LOCATION:'+icsText(c.room),'DESCRIPTION:'+icsText('UNIJMU 原型演示课表，非真实教务数据'+(note?'\n课程备忘：'+note:'')));
    if(document.getElementById('exportReminder').checked) lines.push('BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:-PT15M','DESCRIPTION:'+icsText(c.title+' 即将上课'),'END:VALARM');
    lines.push('END:VEVENT');
  }));
  lines.push('END:VCALENDAR');
  const fold=line=>{let result='',length=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(length+size>75){result+='\r\n ';length=1;}result+=char;length+=size;}return result;};
  const blob=new Blob([lines.map(fold).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='UNIJMU-演示课表.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);closeModal('calendarModal');showToast('已导出演示课表 .ics 文件');
};
document.addEventListener('keydown', e => {
  if (e.key==='Escape') closeNoticeDetail();
  if(e.key==='Tab'&&document.getElementById('noticeDetail').classList.contains('is-active')){
    const focusable=[...document.querySelectorAll('#noticeDetail button')].filter(b=>!b.disabled);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
hydrateIcons(); renderCampusHome(); renderNoticeList(); renderSchedule();
if(location.hash==='#campus') switchTab('campus'); else switchTab('feed');
