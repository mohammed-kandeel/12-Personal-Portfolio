'use strict';
const html = document.documentElement;
const body = document.body;
const themeBtn = document.querySelector('#theme-toggle-button');
const links = Array.from(document.querySelectorAll('.nav-links a'));
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const allSections = {
   heroSection: document.querySelector('#hero-section'),
   aboutSection: document.querySelector('#about'),
   portfolioSection: document.querySelector('#portfolio'),
   experienceSection: document.querySelector('#experience'),
   testimonialsSection: document.querySelector('#testimonials'),
   contactSection: document.querySelector('#contact'),
};
const scrollToTop = document.querySelector('#scroll-to-top');
const portfolioBtns = Array.from(document.querySelectorAll('#portfolio #portfolio-filters button'));
const portfolioItems = Array.from(document.querySelectorAll('#portfolio  #portfolio-grid > div'));

const testimonials = document.querySelector('#testimonials-carousel');
const testimonialsCards = Array.from(document.querySelectorAll('#testimonials-carousel .testimonial-card'));
const nextTestimonialBtn = document.querySelector('#next-testimonial');
const prevTestimonialBtn = document.querySelector('#prev-testimonial');
const carouselIndicatorBtns = Array.from(document.querySelectorAll('.carousel-indicator'));
let moveTestimonialsCards = 0;

const settingsToggle = document.querySelector('#settings-toggle');
const closeSettingsBtn = document.querySelector('#close-settings');
const settingsSidebar = document.querySelector('#settings-sidebar');
const fontOptionBtns = Array.from(document.querySelectorAll('.font-option'));
const resetSettingsBtn = document.querySelector('#reset-settings');

// --- events ---
// window
document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      // close
      closeMobileMenu();
      closeSettingsSidebar();
   }
});
window.addEventListener('resize', function (e) {
   // reset testimonial
   slideTestimonials({ index: 0 });

   // close
   closeMobileMenu();
   closeSettingsSidebar();
});
window.addEventListener('click', function ({ target }) {
   // close
   if (document.querySelector('#header') !== target.closest('#header')) closeMobileMenu();
   if (settingsSidebar !== target.closest('#settings-sidebar') && settingsToggle !== target.closest('#settings-toggle')) closeSettingsSidebar();
});
document.addEventListener('scroll', () => {
   setActiveLink();
   showScrollToTop();
});
// navbar
themeBtn.addEventListener('click', () => {
   html.classList.toggle('dark');
   html.classList.toggle('light');
});
mobileMenuBtn.addEventListener('click', () => {
   document.querySelector('[role="menubar"]').classList.toggle('translate-0');
});
(function () {
   for (const link of links) {
      link.addEventListener('click', () => {
         // close navbar
         closeMobileMenu();
      });
   }
})();
// portfolio
(function () {
   for (const btn of portfolioBtns) {
      btn.addEventListener('click', function () {
         portfolioBtnStyle(this);
         portfolioFilter(this);
      });
   }
})();
// scrollToTop
scrollToTop.addEventListener('click', function () {
   window.scrollTo(top);
});
// testimonial
nextTestimonialBtn.addEventListener('click', () => {
   slideTestimonials({ moveTo: 1 });
});
prevTestimonialBtn.addEventListener('click', () => {
   slideTestimonials({ moveTo: -1 });
});
(function () {
   for (const btn of carouselIndicatorBtns) {
      btn.addEventListener('click', ({ target }) => {
         slideTestimonials({ index: target.getAttribute('data-index') });
      });
   }
})();
// settings-sidebar
closeSettingsBtn.addEventListener('click', closeSettingsSidebar);
resetSettingsBtn.addEventListener('click', resetSettings);
settingsToggle.addEventListener('click', () => {
   settingsSidebar.classList.toggle('translate-x-full');
   settingsSidebar.setAttribute('aria-hidden', settingsSidebar.classList.contains('translate-x-full'));
   moveSettingsToggle(settingsSidebar.classList.contains('translate-x-full'));
});
(function () {
   for (const btn of fontOptionBtns) {
      btn.addEventListener('click', () => {
         setFontOption(btn.getAttribute('data-font'));
         fontOptionBtnsStyle(fontOptionBtns.indexOf(btn));
      });
   }
})();
function addEventToThemeColorsBtns(btns) {
   for (const btn of btns) {
      btn.addEventListener('click', function ({ target }) {
         console.log();
         selectedThemeColorBtn({
            newThemeBtn: document.querySelector(`#theme-colors-grid button[title="${target.getAttribute('title')}"]`),
            oldThemeBtn: document.querySelector(`#theme-colors-grid button[title="${html.getAttribute('data-themeColor')}"]`),
         });
         changeThemeColor(btn);
      });
   }
}

// --- navbar ---
function closeMobileMenu() {
   document.querySelector('[role="menubar"]').classList.remove('translate-0');
}
function setActiveLink() {
   let activeSection;
   for (const section of Object.values(allSections)) {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
         activeSection = section;
      }
   }
   for (const link of links) {
      if (link.getAttribute('href') === '#' + activeSection.getAttribute('id')) link.classList.add('active');
      else link.classList.remove('active');
   }
}
// --- portfolio ---
function portfolioBtnStyle(item) {
   for (const btn of portfolioBtns) {
      btn.classList.remove('bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'hover:shadow-lg', 'hover:shadow-primary/50');
      btn.classList.add(
         'bg-white',
         'dark:bg-slate-800',
         'text-slate-600',
         'dark:text-slate-300',
         'hover:bg-slate-100',
         'dark:hover:bg-slate-700',
         'border',
         'border-slate-300',
         'dark:border-slate-700'
      );
   }
   item.classList.add('bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'hover:shadow-lg', 'hover:shadow-primary/50');
   item.classList.remove(
      'bg-white',
      'dark:bg-slate-800',
      'text-slate-600',
      'dark:text-slate-300',
      'hover:bg-slate-100',
      'dark:hover:bg-slate-700',
      'border',
      'border-slate-300',
      'dark:border-slate-700'
   );
}
function portfolioFilter(item) {
   for (const card of portfolioItems) {
      card.classList.add('transition-all', 'duration-300', 'opacity-0', 'scale-75');
      card.classList.remove('opacity-100', 'scale-100');
      setTimeout(() => {
         card.classList.add('hidden');
      }, 300);

      setTimeout(() => {
         if (item.getAttribute('data-filter') === 'all' || item.getAttribute('data-filter') === card.getAttribute('data-category')) {
            card.classList.remove('hidden');
            setTimeout(() => {
               card.classList.remove('opacity-0', 'scale-75');
               card.classList.add('opacity-100', 'scale-100');
            }, 302);
         }
      }, 301);
   }
}
// --- ScrollToTop ---
function showScrollToTop() {
   if (scrollToTop.classList.contains('invisible') && window.scrollY > allSections.aboutSection.offsetHeight / 2) {
      scrollToTop.classList.toggle('opacity-0');
      scrollToTop.classList.toggle('invisible');
      scrollToTop.classList.toggle('opacity-100');
   } else if (scrollToTop.classList.contains('opacity-100') && window.scrollY < allSections.heroSection.offsetHeight / 2) {
      scrollToTop.classList.toggle('opacity-0');
      scrollToTop.classList.toggle('invisible');
      scrollToTop.classList.toggle('opacity-100');
   }
}
// --- Testimonials ---
function slideTestimonials({ moveTo = 1, index = -1 }) {
   const viewWidth = +getComputedStyle(testimonials).width.replace('px', '');
   const cardWidth = +getComputedStyle(testimonialsCards[0]).width.replace('px', '');
   let maxMove = testimonialsCards.length * cardWidth - (viewWidth / cardWidth) * cardWidth;
   index === -1 ? (index = 1) : (moveTestimonialsCards = 0);
   moveTestimonialsCards += cardWidth * moveTo * index;
   if (Math.ceil(maxMove) < Math.ceil(moveTestimonialsCards)) moveTestimonialsCards = 0;
   else if (Math.ceil(moveTestimonialsCards) < 0) moveTestimonialsCards = maxMove;
   testimonials.style.transform = `translate(${moveTestimonialsCards}px)`;
   changeCarouselIndicatorStyle(Math.floor(moveTestimonialsCards / cardWidth));
}
function changeCarouselIndicatorStyle(dataIndex) {
   for (const btn of carouselIndicatorBtns) {
      if (btn.getAttribute('data-index') === String(dataIndex)) {
         btn.classList.add('bg-accent');
         btn.classList.remove('dark:bg-slate-600');
      } else {
         btn.classList.remove('bg-accent');
         btn.classList.add('dark:bg-slate-600');
      }
   }
}
// --- side nave ---
// fonts
function closeSettingsSidebar() {
   settingsSidebar.classList.add('translate-x-full');
   moveSettingsToggle(settingsSidebar.classList.contains('translate-x-full'));
}
function moveSettingsToggle(is) {
   is ? (settingsToggle.style.right = '0') : (settingsToggle.style.right = `${getComputedStyle(settingsSidebar).width}`);
}
function setFontOption(font) {
   body.classList.remove('font-tajawal', 'font-alexandria', 'font-cairo');
   body.classList.add('font-' + font);
}
function fontOptionBtnsStyle(index) {
   for (const btn of fontOptionBtns) {
      btn.classList.remove('border-primary');
      btn.classList.add('border-slate-200', 'dark:border-slate-700');
      btn.children[2].classList.add('opacity-0');
      btn.setAttribute('aria-checked', 'false');
   }
   fontOptionBtns[index].classList.add('border-primary');
   fontOptionBtns[index].classList.remove('border-slate-200', 'dark:border-slate-700');
   fontOptionBtns[index].children[2].classList.remove('opacity-0');
   fontOptionBtns[index].setAttribute('aria-checked', 'true');
}
// theme
function createBtnsThemeColors() {
   const themeColors = [
      {
         title: 'Purple Blue',
         primary: '#6366f1',
         secondary: '#8b5cf6',
         accent: '#a855f7',
      },
      {
         title: 'Pink Orange',
         primary: '#ec4899',
         secondary: '#f97316',
         accent: '#fb923c',
      },
      {
         title: 'Green Emerald',
         primary: '#10b981',
         secondary: '#059669',
         accent: '#34d399',
      },
      {
         title: 'Blue Cyan',
         primary: '#3b82f6',
         secondary: '#06b6d4',
         accent: '#22d3ee',
      },
      {
         title: 'Red Rose',
         primary: '#ef4444',
         secondary: '#f43f5e',
         accent: '#fb7185',
      },
      {
         title: 'Amber Orange',
         primary: '#f59e0b',
         secondary: '#ea580c',
         accent: '#fbbf24',
      },
   ];
   for (let i = 0; i < themeColors.length; i++) {
      const btn = document.createElement('button');
      btn.classList.add(
         'w-12',
         'h-12',
         'rounded-full',
         'cursor-pointer',
         'transition-transform',
         'hover:scale-110',
         'border-2',
         'border-slate-200',
         'dark:border-slate-700',
         'hover:border-primary',
         'shadow-sm'
      );
      btn.setAttribute('title', `${themeColors[i].title}`);
      btn.setAttribute('data-primary', `${themeColors[i].primary}`);
      btn.setAttribute('data-secondary', `${themeColors[i].secondary}`);
      btn.setAttribute('data-accent', `${themeColors[i].secondary}`);
      btn.style = `background: linear-gradient(135deg,${themeColors[i].primary} ,${themeColors[i].secondary} )`;
      document.querySelector('#theme-colors-grid').append(btn);
   }
   addEventToThemeColorsBtns(document.querySelectorAll('#theme-colors-grid button'));
   changeThemeColor(document.querySelector(`#theme-colors-grid button[title="${themeColors[0].title}"]`));
   selectedThemeColorBtn({});
}
function changeThemeColor(btn) {
   html.style.cssText = `
            --color-primary:${btn.getAttribute('data-primary')} ;
            --color-secondary:${btn.getAttribute('data-primary')};
            --color-accent:${btn.getAttribute('data-accent')}`;
   html.setAttribute('data-themeColor', `${btn.getAttribute('title')}`);
}
function selectedThemeColorBtn({ newThemeBtn = document.querySelector(`#theme-colors-grid button[title="Purple Blue"]`), oldThemeBtn, allBtns }) {
   if (oldThemeBtn) oldThemeBtn.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
   else if (allBtns) {
      for (const btn of allBtns) {
         btn.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
      }
   }
   newThemeBtn?.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
}
// reset
function resetSettings() {
   setFontOption('tajawal');
   fontOptionBtnsStyle(1);
   changeThemeColor(document.querySelector(`#theme-colors-grid button[title="Purple Blue"]`));
   selectedThemeColorBtn({ allBtns: document.querySelectorAll(`#theme-colors-grid button`) });
}

// --- first run ---
createBtnsThemeColors();
setActiveLink();
resetSettings();
