document.addEventListener('DOMContentLoaded', () => {

  function initSwiperSliders() {

    var menu = [];
    jQuery('.swiper-slide').each(function (index) {
      menu.push(jQuery(this).find('.slide-inner').attr("data-text"));
    });
    var interleaveOffset = 0.5;
    var swiperOptions = {
      loop: true,
      speed: 1000,
      slidesPerView: 1,
      parallax: true,
      autoplay: {
        delay: 6500,
        disableOnInteraction: false,
      },
      watchSlidesProgress: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      on: {
        progress: function () {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            var slideProgress = swiper.slides[i].progress;
            var innerOffset = swiper.width * interleaveOffset;
            var innerTranslate = slideProgress * innerOffset;
            swiper.slides[i].querySelector(".slide-inner").style.transform =
              "translate3d(" + innerTranslate + "px, 0, 0)";
          }
        },

        touchStart: function () {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        },

        setTransition: function (speed) {
          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + "ms";
            swiper.slides[i].querySelector(".slide-inner").style.transition =
              speed + "ms";
          }
        }
      }
    };

    var swiper = new Swiper(".swiper-container", swiperOptions);

    var sliderBgSetting = $(".slide-bg-image");
    sliderBgSetting.each(function (indx) {
      if ($(this).attr("data-background")) {
        $(this).css("background-image", "url(" + $(this).data("background") + ")");
      }
    });

    const swiperMultipleSlides = document.querySelector('#swiper-multiple-slides');
    const SliderCategorias = document.querySelector('#categories-multiple-slides');

    if (swiperMultipleSlides) {
      new Swiper(swiperMultipleSlides, {
        slidesPerView: 5,
        spaceBetween: 30,
        loop: false,
        autoplay: false,
        pagination: {
          clickable: true,
          el: '.swiper-pagination-products'
        },
        breakpoints: {

          768: {
            slidesPerView: 1,
            stage: 2,

          }
        }
      });
    }

    if (SliderCategorias) {
      new Swiper(SliderCategorias, {
        slidesPerView: 5,
        spaceBetween: 30,
        loop: false,
        autoplay: true,
        pagination: {
          clickable: true,
          el: '.swiper-pagination-products'
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            stage: 2,

          }
        }
      });
    }

  }

  function initSearch() {
    const contentBuscador = document.getElementById('content-buscador');
    const openBuscadorBtn = document.getElementById('openBuscadorBtn');
    const closeIcon = document.getElementById('closeIcon');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (!contentBuscador || !openBuscadorBtn || !closeIcon || !searchForm) return;

    openBuscadorBtn.addEventListener('click', () => {
      contentBuscador.classList.add('open');
      searchInput.focus();
    });

    closeIcon.addEventListener('click', () => {
      contentBuscador.classList.remove('open');
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `/search?query=${encodeURIComponent(query)}`;
      }
    });
  }

  function initToolbarVisibility() {
    const toolbar = document.getElementById('call-toolbar');
    if (!toolbar) return;

    const cartHasItems = document.querySelector('#content-cart .cart-item') !== null || false;

    const updateToolbarVisibility = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 100 || cartHasItems) {
       // toolbar.classList.add('opacity-0', 'translate-y-24');
      } else {
        toolbar.classList.remove('opacity-0', 'translate-y-24');
      }
    };

    window.addEventListener('scroll', updateToolbarVisibility);
    updateToolbarVisibility();
  }

  function initWhatsAppButtons() {
    const buttons = document.querySelectorAll('#btn-actions-whatsapp'); // Usar una clase es más flexible
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const { number, title, price, messageTemplate } = button.dataset;

        console.log({ number, title, price, messageTemplate })

        if (number && title && price) {
          // const message = messageTemplate.replace('{title}', title).replace('{price}', price);
          const message = `Hola, quiero comprar este producto: ${title} - ${price} `;
          const whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
          window.open(whatsappLink, '_blank');
        } else {
          console.error('Faltan atributos de datos para el botón de WhatsApp.');
        }
      });
    });
  }

  initSwiperSliders();
  initSearch();
  initToolbarVisibility();
  initWhatsAppButtons();

});