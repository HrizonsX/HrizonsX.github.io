// Both channels render the same posts; following only changes the author filter.
let currentFeedChannel = 'rec';
const followedFeedAuthors = new Set(['软工小林_23', '集大跑腿小哥']);
const feedPostOrder = ['study', 'notes', 'wall', 'delivery'];
const publishTags = [];

function renderPublishTags() {
  document.getElementById('publishTagCount').textContent = publishTags.length + ' / 5';
  document.getElementById('publishTagList').innerHTML = publishTags.map((tag, index) =>
    '<button type="button" onclick="removePublishTag(' + index + ')" aria-label="删除标签 ' + escapeHtml(tag) + '">' + escapeHtml(tag) + '<span aria-hidden="true">×</span></button>'
  ).join('');
}

function addPublishTag() {
  const input = document.getElementById('publishTagInput');
  const tag = input.value.trim().replace(/^[#＃]+|[#＃]+$/g, '').trim();
  if (!tag || /[#＃]/.test(tag)) { showToast('请输入一个标签名称'); return false; }
  if ([...tag].length > 20) { showToast('每个标签最多 20 字'); return false; }
  if (publishTags.includes(tag)) { input.value = ''; showToast('这个标签已经添加了'); return true; }
  if (publishTags.length >= 5) { showToast('最多添加 5 个标签'); return false; }
  publishTags.push(tag);
  input.value = '';
  renderPublishTags();
  return true;
}

function removePublishTag(index) {
  publishTags.splice(index, 1);
  renderPublishTags();
}

Object.assign(postDetailData, {
  notes: {
    title: '数据库期末重点思维导图', author: '软工小林_23', avatar: '林',
    meta: '35分钟前 · 诚毅二食堂门口', subtitle: '#期末复习#',
    body: '刚刚把大二下学期整理的《数据库系统概论》期末重点思维导图整理好了！需要的同学在评论区留邮箱或者私信我，学长免费分享 PDF 原图～',
    info: ['资料：数据库系统概论期末重点思维导图', '获取：评论或私信作者'],
    likes: 31, commentCount: 8, comments: []
  },
  delivery: {
    title: '顺丰大件代取提醒', author: '集大跑腿小哥', avatar: '跑',
    meta: '2小时前 · 诚毅快递街', subtitle: '#校园跑腿#',
    body: '美贤路顺丰代取点今天下午爆仓啦，有需要代取大件包裹的同学尽早下单，晚上统一安排推车运送到各宿舍大堂！遵循校内互助安全守则～',
    info: ['取件：美贤路顺丰代取点', '送达：各宿舍大堂', '相关：校园跑腿、大件代取'],
    likes: 57, commentCount: 19, comments: []
  }
});
postDetailData.study.images = [
  { src: 'assets/campus-life-v2.png', caption: '尚大楼自习室' },
  { src: 'assets/campus-study-v2.png', caption: '考研复习进度打卡' }
];

function renderFeedPost(postId) {
  const post = postDetailData[postId];
  const id = escapeHtml(postId);
 const author = escapeHtml(post.author);
  const metaParts = String(post.meta || '').split(' · ');
  const headerMeta = escapeHtml(metaParts.slice(0, metaParts.length === 3 ? 2 : 1).join(' · '));
  const followed = followedFeedAuthors.has(post.author);
  const shareIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  return `<article class="app-card p-4 space-y-2.5 feed-post-card" data-post-id="${id}">
    <div class="feed-card-header">
      <span class="feed-card-avatar">${escapeHtml(post.avatar)}</span>
      <div class="feed-card-author"><strong>${author}</strong>${postId === 'wall' ? '<span class="feed-official">官方</span>' : ''}<small>${headerMeta}</small></div>
      ${post.author === 'GnaixEuy' ? '' : `<div class="feed-card-author-actions">
        <button type="button" class="feed-private" data-author="${author}" onclick="openChatPage(this.dataset.author, '集美大学')">私信</button>
        <button type="button" data-follow-author="${author}" aria-pressed="${followed}" onclick="toggleFeedFollow(this.dataset.followAuthor)">${followed ? '已关注' : '+ 关注'}</button>
      </div>`}
    </div>
    <div class="feed-card-topic">${escapeHtml(post.subtitle)}</div>
    <div class="feed-post-copy-wrap">
      <p class="feed-post-copy is-collapsed text-[13px] text-slate-800 leading-relaxed" role="button" tabindex="0" data-post-id="${id}" onclick="openPostDetail(this.dataset.postId)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openPostDetail(this.dataset.postId)}">${escapeHtml(post.body)}</p>
      <button type="button" class="feed-post-expand" data-post-id="${id}" onclick="openPostDetail(this.dataset.postId)">查看全文 ›</button>
    </div>
    ${post.images ? `<div class="feed-card-media">${post.images.map(img => `<button type="button" class="feed-media-card" data-post-id="${id}" onclick="openPostDetail(this.dataset.postId)"><img src="${img.src}" alt="${img.caption}"><span>${img.caption}</span></button>`).join('')}</div>` : ''}
    <div class="feed-card-actions">
      <button type="button" onclick="openWechatActionSheet()">${shareIcon}<span>分享</span></button>
      <button type="button" aria-label="评论 ${post.commentCount}" data-post-id="${id}" onclick="openPostDetail(this.dataset.postId)">${icon('chat-circle-dots')}<span>${post.commentCount}</span></button>
      <button type="button" class="post-save-action" data-post-save="${id}" aria-pressed="false" onclick="togglePostSave(event,this.dataset.postSave)"><span aria-hidden="true">☆</span><span>收藏</span></button>
      <button type="button" data-post-like="${id}" aria-label="点赞 ${post.likes}" aria-pressed="${!!post.liked}" onclick="toggleFeedLike(this)">${icon('heart')}<span>${post.likes}</span></button>
    </div>
  </article>`;
}

function renderFeedPosts() {
  const ids = feedPostOrder.filter(id => currentFeedChannel !== 'focus' || followedFeedAuthors.has(postDetailData[id].author));
  document.getElementById('feedPostList').innerHTML = ids.length
    ? ids.map(renderFeedPost).join('')
    : '<div class="feed-follow-empty">还没有关注的同学动态<button type="button" onclick="setFeedChannel(\'rec\')">去推荐看看</button></div>';
  updatePostSaveUI();
}

function toggleFeedFollow(author) {
  const followed = followedFeedAuthors.has(author);
  if (followed) followedFeedAuthors.delete(author); else followedFeedAuthors.add(author);
  renderFeedPosts();
  showToast(followed ? '已取消关注' : '关注成功');
}

function toggleFeedLike(button) {
  const post = postDetailData[button.dataset.postLike];
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  button.setAttribute('aria-pressed', String(post.liked));
  button.setAttribute('aria-label', '点赞 ' + post.likes);
  button.querySelector('span').textContent = post.likes;
}

renderFeedPosts();
