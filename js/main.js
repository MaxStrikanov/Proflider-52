const dayNight = document.querySelector('.dayNight');
const menuToggle = document.querySelector('.menuToggle');
const body = document.querySelector('body');
const navigation = document.querySelector('.navigation');
const menuItem = document.querySelectorAll('.nav-link');
const accordionTitle = document.querySelectorAll('.contentBx ');
const accordionContent = document.querySelectorAll('.contentBx > .contentAc');

accordionTitle.forEach((item, i) => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    })
})

 //табы
const tabs = () => {
    const tabHeader = document.querySelector('.dots');
    const tab = document.querySelectorAll('.dot');
    const tabContent = document.querySelectorAll('.exContent');  
    const toggleTabContent = (index) => {

    for( let i = 0; i < tabContent.length; i++){
    if(index === i){
    tab[i].classList.add('active');
    tabContent[i].classList.remove('d-none');
    } else {
    tab[i].classList.remove('active');
    tabContent[i].classList.add('d-none');
    }
    }
}

tabHeader.addEventListener('click', (e) => {
    
    let target = e.target;
        target = target.closest('.dot');

    if (target){
       tab.forEach((item, i) => {
        if(item === target){
        toggleTabContent(i);
    }
    }); 
    } 
 });
};

tabs();

dayNight.onclick = () => {
  body.classList.toggle('dark');
  dayNight.classList.toggle('active')
}

menuToggle.onclick = () => {
  menuToggle.classList.toggle('active')
  navigation.classList.toggle('active')
}
navigation.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
        navigation.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
})
//*********scroll Top **********//
if(arrowTop){
    arrowTop.onclick = function(e) {
	    e.preventDefault();
	    var scrollToTop = window.setInterval(function() {
	        var pos = window.pageYOffset;
	        if ( pos > 0 ) {
	            window.scrollTo( 0, pos - 200 );
	        } else {
	            window.clearInterval( scrollToTop );
	        }
	    }, 32);
	}
	window.addEventListener('scroll', function() {
		arrowTop.hidden = (pageYOffset < document.documentElement.clientHeight);
	});
}
//*****************************//
/*
const swiper = new Swiper('.slider-rewies', {
  // Optional parameters
  loop: true,
  slidesPerView: 2,
    spaceBetween: 30,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  breakpoints: {
    // when window width is <= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
      
    },
    // when window width is <= 480px
    450: {
      slidesPerView: 1,
      spaceBetween: 20,
      
    },
    // when window width is <= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 30,
      
    },
    1200: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
}
});
*/

function lerp({ x, y }, { x: targetX, y: targetY }) {
  const fraction = 0.1; 
  x += (targetX - x) * fraction;
  y += (targetY - y) * fraction;
  return { x, y };
}
class Slider {
  constructor (el) {
      const imgClass = this.IMG_CLASS = 'sl-img-item';
      const textClass = this.TEXT_CLASS = 'sl-text-item';
      const activeImgClass = this.ACTIVE_IMG_CLASS = `${imgClass}-active`;
      const activeTextClass = this.ACTIVE_TEXT_CLASS =  `${textClass}-active`;
      this.el = el;
      this.contentE0 = document.getElementById('slider');
      this.contentEl = document.getElementById('slider-content');
      this.onMouseMove = this.onMouseMove.bind(this);
      this.activeImg = el.getElementsByClassName(activeImgClass);
      this.activeText = el.getElementsByClassName(activeTextClass);
      this.images = el.getElementsByTagName('img');
      document.getElementById('sl-nav-dots').addEventListener('click', this.onDotClick.bind(this));
      document.getElementById('left').addEventListener('click', this.prev.bind(this));
      document.getElementById('right').addEventListener('click', this.next.bind(this));
      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
      this.length = this.images.length;
      this.lastX = this.lastY = this.targetX = this.targetY = 0;
  }
  onResize () {
      const htmlStyles = getComputedStyle(document.documentElement);
      const mobileBreakpoint =  htmlStyles.getPropertyValue('--mobile-bkp');
      const isMobile = this.isMobile = matchMedia(`only screen and (max-width: ${mobileBreakpoint})`).matches;
      this.halfWidth = this.contentE0.offsetWidth / 2;
      this.halfHeight = this.contentE0.offsetHeight / 2;
      this.zDistance = htmlStyles.getPropertyValue('--z-distance');
      if (!isMobile && !this.mouseWatched) {
        this.mouseWatched = true;
        this.el.addEventListener('mousemove', this.onMouseMove);
        this.el.style.setProperty(
            '--img-prev', 
            `url(${this.images[+this.activeImg[0].dataset.id - 1].src})`
        );
        this.contentEl.style.setProperty('transform', `translateZ(${this.zDistance})`);
        } else if (isMobile && this.mouseWatched) {
        this.mouseWatched = false;
        this.el.removeEventListener('mousemove', this.onMouseMove);
        this.contentEl.style.setProperty('transform', 'none');
      }
  }
  getMouseCoefficients ({ clientX, clientY } = {}) {
      const halfWidth = this.halfWidth;
      const halfHeight = this.halfHeight;
      const xCoeff = ((clientX || this.targetX) - halfWidth) / halfWidth;
      const yCoeff = (halfHeight - (clientY || this.targetY)) / halfHeight;
      return { xCoeff,  yCoeff }
  }
  onMouseMove ({ clientX, clientY }) { 
      this.targetX = clientX - this.contentE0.getBoundingClientRect().left;
      this.targetY = clientY - this.contentE0.getBoundingClientRect().top;
      if (!this.animationRunning) {
          this.animationRunning = true;
          this.runAnimation();
      }
  }
  runAnimation () {
      if (this.animationStopped) {
        this.animationRunning = false;
        return;
      }
      const maxX = 10;
      const maxY = 10;
      const newPos = lerp({
          x: this.lastX,
          y: this.lastY
          }, {
          x: this.targetX,
          y: this.targetY
      });
      const { xCoeff, yCoeff } = this.getMouseCoefficients({
          clientX: newPos.x, 
          clientY: newPos.y
      });  
      this.lastX = newPos.x;
      this.lastY = newPos.y;
      this.positionImage({ xCoeff, yCoeff }); 
      this.contentEl.style.setProperty('transform', `
          translateZ(${this.zDistance})
          rotateX(${maxY * yCoeff}deg)
          rotateY(${maxX * xCoeff}deg)
      `);
      if (this.reachedFinalPoint) {
          this.animationRunning = false;
          } else {
          requestAnimationFrame(this.runAnimation.bind(this)); 
      }
  }
  get reachedFinalPoint () {
      const lastX = ~~this.lastX;
      const lastY = ~~this.lastY;
      const targetX = this.targetX;
      const targetY = this.targetY;
      return (lastX == targetX || lastX - 1 == targetX || lastX + 1 == targetX) 
      && (lastY == targetY || lastY - 1 == targetY || lastY + 1 == targetY);
  }
  positionImage ({ xCoeff, yCoeff }) {
      const maxImgOffset = 1;
      const currentImage = this.activeImg[0].children[0];
      currentImage.style.setProperty('transform', `
          translateX(${maxImgOffset * -xCoeff}em)
          translateY(${maxImgOffset * yCoeff}em)
      `);  
  }
  onDotClick ({ target }) {
      if (this.inTransit) return;
      const dot = target.closest('.sl-nav-dot');
      if (!dot) return;
      const nextId = dot.dataset.id;
      const currentId = this.activeImg[0].dataset.id;
      if (currentId == nextId) return;
      this.startTransition(nextId);
  }
  transitionItem (nextId) {
      function onImageTransitionEnd (e) {
          e.stopPropagation();
          nextImg.classList.remove(transitClass);
          self.inTransit = false;
          this.className = imgClass;
          this.removeEventListener('transitionend', onImageTransitionEnd);
      }
      const self = this;
      const el = this.el;
      const currentImg = this.activeImg[0];
      const currentId = currentImg.dataset.id;
      const imgClass = this.IMG_CLASS;
      const textClass = this.TEXT_CLASS;
      const activeImgClass = this.ACTIVE_IMG_CLASS;
      const activeTextClass = this.ACTIVE_TEXT_CLASS;
      const subActiveClass = `${imgClass}-subactive`;
      const transitClass = `${imgClass}-transit`;
      const nextImg = el.querySelector(`.${imgClass}[data-id='${nextId}']`);
      const nextText = el.querySelector(`.${textClass}[data-id='${nextId}']`);
      let outClass = '';
      let inClass = '';
      this.animationStopped = true;
      nextText.classList.add(activeTextClass);
      el.style.setProperty('--from-left', nextId);
      currentImg.classList.remove(activeImgClass);
      currentImg.classList.add(subActiveClass);
      if (currentId < nextId) {
          outClass = `${imgClass}-next`;
          inClass = `${imgClass}-prev`;
          } else {
          outClass = `${imgClass}-prev`;
          inClass = `${imgClass}-next`;
      }
      nextImg.classList.add(outClass);
      requestAnimationFrame(() => {
          nextImg.classList.add(transitClass, activeImgClass);
          nextImg.classList.remove(outClass);
          this.animationStopped = false;
          this.positionImage(this.getMouseCoefficients());
          currentImg.classList.add(transitClass, inClass);
          currentImg.addEventListener('transitionend', onImageTransitionEnd);
      });
      if (!this.isMobile)
      this.switchBackgroundImage(nextId);
  }
  startTransition (nextId) {
      function onTextTransitionEnd(e) {
          if (!e.pseudoElement) {
              e.stopPropagation();
              requestAnimationFrame(() => {
                  self.transitionItem(nextId);
              });
              this.removeEventListener('transitionend', onTextTransitionEnd);
          }
      }
      if (this.inTransit) return;
      const activeText = this.activeText[0];
      const backwardsClass = `${this.TEXT_CLASS}-backwards`;
      const self = this; 
      this.inTransit = true;
      activeText.classList.add(backwardsClass);
      activeText.classList.remove(this.ACTIVE_TEXT_CLASS);
      activeText.addEventListener('transitionend', onTextTransitionEnd);
      requestAnimationFrame(() => {
          activeText.classList.remove(backwardsClass);
      });
  }
  next () {
      if (this.inTransit) return;
      let nextId = +this.activeImg[0].dataset.id + 1;
      if (nextId > this.length)
      nextId = 1;
      this.startTransition(nextId);
  }
  prev () {
      if (this.inTransit) return;
      let nextId = +this.activeImg[0].dataset.id - 1;
      if (nextId < 1)
      nextId = this.length;
      this.startTransition(nextId);
  }
  switchBackgroundImage (nextId) {
      function onBackgroundTransitionEnd (e) {
          if (e.target === this) {
              this.style.setProperty('--img-prev', imageUrl);
              this.classList.remove(bgClass);
              this.removeEventListener('transitionend', onBackgroundTransitionEnd);
          }
      }
      const bgClass = 'slider--bg-next';
      const el = this.el;
      const imageUrl = `url(${this.images[+nextId - 1].src})`;
      el.style.setProperty('--img-next', imageUrl);
      el.addEventListener('transitionend', onBackgroundTransitionEnd);
      el.classList.add(bgClass);
  }
}
const sliderEl = document.getElementById('slider');
const slider = new Slider(sliderEl);
let timer = 0;
function autoSlide () {
  requestAnimationFrame(() => {
      slider.next();
  });
  timer = setTimeout(autoSlide, 4000);
}
function stopAutoSlide () {
  clearTimeout(timer);
  this.removeEventListener('touchstart', stopAutoSlide);
  this.removeEventListener('mousemove', stopAutoSlide);  
}
sliderEl.addEventListener('mousemove', stopAutoSlide);
sliderEl.addEventListener('touchstart', stopAutoSlide);
timer = setTimeout(autoSlide, 4000);    

// ScrollReveal().reveal('.card',{  delay: 500 });
/*AOS.init();*/
