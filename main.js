'use strict';

// navbar가 홈 화면 밑으로 내려가면 background color 생기게 하기
const navbar = document.querySelector('#navbar');
const home = document.querySelector('#home');
const homeHeight = home.getBoundingClientRect().height;
const navbarMenu = document.querySelector('.navbar__menu')
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight-100) {
    navbar.classList.add('backgroundOn');
  } else {
    navbar.classList.remove('backgroundOn');
  }
});

document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight-100 && window.innerWidth < 768) {
    navbarMenu.style.backgroundColor = 'black';
  } else {
    navbarMenu.style.backgroundColor = 'transparent';
  }
});


document.addEventListener('scroll', () => {
  if (window.screenY > homeAreaHeight) {

  }
})

// 자주 사용하는 이벤트는 함수로 정의해서 사용 (재사용성 증가)
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
};
// navbar 메뉴 클릭시 해당 섹션으로 이동시키기
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link === null) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
});

// Home화면의 Contact me를 누르면 contact 섹션으로 이동시키기
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// 홈 화면에서 아래로 내릴수록 페이드아웃시키기
const homeArea = document.querySelector('.home__container');
const homeAreaHeight = homeArea.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  homeArea.style.opacity = 1 - window.scrollY / (homeAreaHeight+200);
});


// 작은 화면에서 navbar 토글 버튼 설정
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
})

// 1. 모든 섹션 요소들을 가지고 온다.
const sectionIds = [
  '#home', 
  '#about', 
  '#skills', 
  '#projects', 
  '#contact',
];
// map을 통해서 배열을 하나씩 순회하면서 각각의 아이디 문자열을 이용해서 해당하는 요소를 받아온다.
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));
// 2. InterserctionObserver를 이용해서 모든 섹션들을 관찰한다.
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

// 자주 사용하는 이벤트는 함수로 정의해서 사용 (재사용성 증가)
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
};

const observerOptions = {
  root: null, /* viewport */
  rootMargin: '0px',
  // 섹션이 30%정도 들어오면 적용되고, 70%정도 나가면 적용이 풀린다.
  threshold: 0.3,
}
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    // isIntersecting은 들어올 때를 뜻하기 때문에 앞에 !을 붙이면 나갈 때를 뜻한다.
    // 페이지가 로드되자마자 섹션들이 밖으로 나가서 문제가 발생하기 때문에 "&& entry.intersectionRatio > 0"을 추가해주어야 한다.
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴.
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1
      // 스크롤링이 위로 되어서 페이지가 내려감
      } else {
        selectedNavIndex = index - 1
      }

    }
  })
}
const observer = new IntersectionObserver(observerCallback, observerOptions);
// 관찰할 대상 설정
sections.forEach(section => observer.observe(section))
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활동화시킨다.
// 'scroll'은 브라우저에서 발생하는 스크롤을 모두 포함한다. 예를들어, 링크를 눌렀을 때 스크롤 되면 이벤트 발생
// 'wheel'은 "사용자"가 스크롤링할 때만 콜백함수를 호출한다.
window.addEventListener('wheel', () => {
  //  맨 윗쪽에 있다면
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  // 맨 아래쪽에 있다면
  } else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});


// 스크롤을 내리면 맨 위로 갈 수 있는 화살표 버튼 활성화시키기
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight /2) {
    arrowUp.classList.add('visible')
  } else {
    arrowUp.classList.remove('visible');
  }
});

arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
})