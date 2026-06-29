function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

function showPage(id, options = {}) {
  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const target = document.getElementById('page-' + id);
  if (!target) return false;
  target.classList.add('active');

  const navItem = document.querySelector(`.nav-item[href="#${id}"], [onclick="return showPage('${id}')"], [onclick="showPage('${id}')"]`);
  if (navItem) navItem.classList.add('active');

  const titles = {
    home: '홈', checklist: '정착 체크리스트', housing: '하우징', visa: 'IND 등록', bsn: 'BSN / DigiD',
    bank: '은행 계좌', insurance: '건강보험 & 병원', subsidy: '보조금',
    transport: '교통수단', telecom: '통신 & 인터넷', tax: '물세 / 쓰레기세',
    'korean-food': '한식당 리스트', weather: '날씨 & 옷차림', emergency: '긴급 연락처', shopping: '장보기 & 한인 마트',
    recipe: '한국 요리 레시피', travel: '여행 정보', delivery: '택배 시스템',
    parttime: '아르바이트', museum: '뮤지엄 카드', holidays: '공휴일 & 축제',
    license: '운전 면허 변경', bike: '자전거', apps: '유용한 앱'
  };

  const topBarTitle = document.getElementById('topBarTitle');
  if (topBarTitle) topBarTitle.textContent = titles[id] || id;

  if (options.updateHash !== false && window.location.hash !== '#' + id) {
    history.pushState(null, '', '#' + id);
  }

  closeSidebar();

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  return false;
}

function showInitialPage() {
  const id = window.location.hash ? window.location.hash.slice(1) : 'home';
  showPage(id || 'home', { updateHash: false });
}

function addPlaceMapLinks() {
  document.querySelectorAll('.place-card-body').forEach(card => {
    if (card.querySelector('.place-card-map')) return;
    const name = card.querySelector('.place-card-name');
    if (!name) return;
    const query = name.textContent.replace(/\([^)]*\)/g, '').trim() + ' Netherlands';
    const link = document.createElement('a');
    link.className = 'place-card-map';
    link.href = 'https://www.google.com/maps/search/' + encodeURIComponent(query);
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Google Maps ↗';
    card.appendChild(link);
  });
}

function initChecklist() {
  const storageKey = 'ksan-guide-checklist';
  let checkedItems = [];

  try {
    checkedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    checkedItems = [];
  }

  const save = () => localStorage.setItem(storageKey, JSON.stringify(checkedItems));

  document.querySelectorAll('#page-checklist .checklist-item').forEach((item, index) => {
    const label = item.querySelector('span')?.textContent.trim() || `item-${index}`;
    const id = `${index}:${label}`;
    const isChecked = checkedItems.includes(id);

    item.dataset.checkId = id;
    item.tabIndex = 0;
    item.setAttribute('role', 'checkbox');
    item.setAttribute('aria-checked', String(isChecked));
    item.classList.toggle('checked', isChecked);

    const toggle = () => {
      const nowChecked = !item.classList.contains('checked');
      item.classList.toggle('checked', nowChecked);
      item.setAttribute('aria-checked', String(nowChecked));
      checkedItems = nowChecked
        ? Array.from(new Set([...checkedItems, id]))
        : checkedItems.filter(savedId => savedId !== id);
      save();
    };

    item.addEventListener('click', toggle);
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
}

function searchPage(q) {
  const query = q.toLowerCase().trim();
  const resultBox = document.getElementById('search-results');

  if (!query) {
    document.querySelectorAll('.nav-item').forEach(n => n.style.display = '');
    if (resultBox) resultBox.style.display = 'none';
    return;
  }

  // nav 필터
  document.querySelectorAll('.nav-item').forEach(n => {
    const text = n.textContent.toLowerCase();
    n.style.display = text.includes(query) ? '' : 'none';
  });

  // 섹션 내용 검색
  const results = [];
  document.querySelectorAll('.page-section').forEach(section => {
    const sectionId = section.id.replace('page-', '');
    const sectionTitle = document.querySelector(`.nav-item[href="#${sectionId}"], [onclick="showPage('${sectionId}')"]`);
    const titleText = sectionTitle ? sectionTitle.textContent.trim() : sectionId;

    // 텍스트 노드만 추출
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const texts = [];
    let node;
    while (node = walker.nextNode()) {
      const t = node.textContent.trim();
      if (t.length > 1) texts.push(t);
    }
    const fullText = texts.join(' ').toLowerCase();

    if (fullText.includes(query)) {
      // 주변 컨텍스트 찾기
      const idx = fullText.indexOf(query);
      const start = Math.max(0, idx - 40);
      const end = Math.min(fullText.length, idx + query.length + 40);
      let snippet = fullText.slice(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < fullText.length) snippet = snippet + '...';
      // 쿼리 하이라이트
      const highlighted = snippet.replace(
        new RegExp(query, 'gi'),
        match => `<mark style="background:#FDF2EB;color:#C05B1F;border-radius:3px;padding:0 2px;">${match}</mark>`
      );
      results.push({ id: sectionId, title: titleText, snippet: highlighted });
    }
  });

  if (!resultBox) return;

  if (results.length === 0) {
    resultBox.innerHTML = '<div style="padding:12px 16px;font-size:13px;color:#999;">검색 결과가 없어요</div>';
    resultBox.style.display = 'block';
    return;
  }

  resultBox.innerHTML = results.map(r => `
    <div onclick="showPage('${r.id}'); document.getElementById('searchInput').value=''; searchPage('');"
      style="padding:12px 16px;cursor:pointer;border-bottom:1px solid #f0f0f0;transition:background 0.15s;"
      onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background=''">
      <div style="font-size:12px;font-weight:600;color:#E8682A;margin-bottom:3px;">${r.title}</div>
      <div style="font-size:12px;color:#555;line-height:1.5;">${r.snippet}</div>
    </div>
  `).join('');
  resultBox.style.display = 'block';
}

// 검색창 외부 클릭 시 결과 닫기
document.addEventListener('click', function(e) {
  const box = document.getElementById('search-results');
  const input = document.getElementById('searchInput');
  if (box && !box.contains(e.target) && e.target !== input) {
    box.style.display = 'none';
  }
});

window.addEventListener('hashchange', showInitialPage);
document.addEventListener('DOMContentLoaded', function() {
  addPlaceMapLinks();
  initChecklist();
  showInitialPage();
});
