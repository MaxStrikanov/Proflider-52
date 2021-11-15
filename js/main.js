const dayNight = document.querySelector('.dayNight');
const menuToggle = document.querySelector('.menuToggle');
const body = document.querySelector('body');
const navigation = document.querySelector('.navigation');


 //табы
 
 const tabs = () => {
  const tabHeader = document.querySelector('.dots');
  const tab = document.querySelectorAll('.dot');
  const tabContent = document.querySelectorAll('.exContent');
  console.log(tab);

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
});;