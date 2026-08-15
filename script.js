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
  const mapLinks = {
    '암스테르담 운하 (Grachtengordel)': 'https://maps.app.goo.gl/HUP63n3SiEq6N4BJ9',
    '반 고흐 미술관 (Van Gogh Museum)': 'https://maps.app.goo.gl/VME2iBgYEm2E7U3Z9',
    '담 광장 (Dam Square)': 'https://maps.app.goo.gl/GaTPL55EANy9pY13A',
    '큐브하우스 (Kubuswoningen)': 'https://maps.app.goo.gl/Xz8zR16aoSnPFVgu9',
    '마르크탈 (Markthal)': 'https://maps.app.goo.gl/mWWEqStxHsSAiQN96',
    '에라스무스 다리 (Erasmusbrug)': 'https://maps.app.goo.gl/CYyoGxhfeKC2pwacA',
    '마우리츠하우스 (Mauritshuis)': 'https://maps.app.goo.gl/4nFYCGezogZCf4h16',
    '스헤베닝겐 해변 (Scheveningen)': 'https://maps.app.goo.gl/nWNfMbWct2WVuzeP6',
    '비넨호프 (Binnenhof)': 'https://maps.app.goo.gl/uPtTyrsfcyqgYqaB6',
    '호르투스 보타니쿠스 (Hortus Botanicus)': 'https://maps.app.goo.gl/ebwE6CneUq4znmB18',
    '라켄할 미술관 (Museum De Lakenhal)': 'https://maps.app.goo.gl/dPQqbCzG9ou9JUik7',
    '레이던 성채 (Burcht van Leiden)': 'https://maps.app.goo.gl/HSqa4LArxN48Qx3C6',
    '돔타워 (Domtoren)': 'https://maps.app.goo.gl/WiYHsUwKUmsJbVCy5',
    '운하 카페 거리 (Oudegracht)': 'https://maps.app.goo.gl/PoGAYNej9mzjPtwv5',
    '스피릿 박물관 (Speelklok Museum)': 'https://maps.app.goo.gl/R4o2htjQcZsiYtYg7',
    '구시가지 운하 (Historic Canals)': 'https://maps.app.goo.gl/ZeGeiN8vJX3uGHEq8',
    '델프트 도자기 공방 (Royal Delft)': 'https://maps.app.goo.gl/ZKbaUfaooy9bTK7e9',
    '니우어케르크 (Nieuwe Kerk)': 'https://maps.app.goo.gl/3spnEPZx68R9mDoMA',
    '스트라입-S (Strijp-S)': 'https://maps.app.goo.gl/kKbLkNuCvEEBAmzN6',
    '반 아베 미술관 (Van Abbemuseum)': 'https://maps.app.goo.gl/8kZ74RCjRMGd5a1CA',
    'DDW (Dutch Design Week)': 'https://maps.app.goo.gl/vMyvGVN6EoQbuedx7',
    '프레이트호프 광장 (Vrijthof)': 'https://maps.app.goo.gl/e9A6GgAFLkLyJ773A',
    '도미니카넨 서점 (Boekhandel Dominicanen)': 'https://maps.app.goo.gl/3cRCFGNNDApuSzNT7',
    '성 세르바스 다리 (Sint Servaasbrug)': 'https://maps.app.goo.gl/TheGKaaKWKu9EjrW6'
  };

  document.querySelectorAll('.place-card-body').forEach(card => {
    if (card.querySelector('.place-card-map')) return;
    const name = card.querySelector('.place-card-name');
    if (!name) return;
    const label = name.textContent.trim();
    const query = label.replace(/^[^(]*\(([^)]*)\).*$/, '$1').trim() + ' Netherlands';
    const link = document.createElement('a');
    link.className = 'place-card-map';
    link.href = mapLinks[label] || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Google Maps ↗';
    card.appendChild(link);
  });
}

function initResponsiveTables() {
  document.querySelectorAll('.styled-table').forEach(table => {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      Array.from(row.children).forEach((cell, index) => {
        if (headers[index]) cell.dataset.label = headers[index];
      });
    });
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

function initOrientationSlider() {
  document.querySelectorAll('.orientation-slider').forEach(slider => {
    const track = slider.querySelector('.orientation-track');
    const slides = Array.from(track?.querySelectorAll('img') || []);
    const thumbs = Array.from(slider.querySelectorAll('.orientation-thumbs button'));
    const prevButton = slider.querySelector('.orientation-arrow.prev');
    const nextButton = slider.querySelector('.orientation-arrow.next');

    if (!track || slides.length === 0 || thumbs.length === 0) return;

    let activeIndex = 0;

    const clampIndex = index => Math.max(0, Math.min(index, slides.length - 1));

    const setActive = index => {
      activeIndex = clampIndex(index);
      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle('active', thumbIndex === activeIndex);
      });
      prevButton?.classList.toggle('is-hidden', activeIndex === 0);
      nextButton?.classList.toggle('is-hidden', activeIndex === slides.length - 1);
    };

    const goToSlide = (index, behavior = 'smooth') => {
      const nextIndex = clampIndex(index);
      track.scrollTo({
        left: nextIndex * track.clientWidth,
        behavior
      });
      setActive(nextIndex);
    };

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    prevButton?.addEventListener('click', () => {
      goToSlide(activeIndex - 1);
    });

    nextButton?.addEventListener('click', () => {
      goToSlide(activeIndex + 1);
    });

    let scrollFrame = null;
    track.addEventListener('scroll', () => {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
        setActive(currentIndex);
      });
    }, { passive: true });

    window.addEventListener('resize', () => {
      goToSlide(activeIndex, 'auto');
    });

    setActive(0);
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
  initResponsiveTables();
  initChecklist();
  initOrientationSlider();
  showInitialPage();
});
