<template>
  <div class="storybook-wrapper">
    <div class="gallery" :class="classes" v-if="slides && slides.length > 0">
      <!-- Main Swiper -->
      <swiper :slides-per-view="slidesPerView" :space-between="0" :modules="modules" v-bind="moduleProps()"
        @swiper="onSwiper" @slideChange="onSlideChange" class="main-swiper">
        <swiper-slide v-for="(slide, idx) in slides" :key="idx">
          <div v-if="slide.type === 'video'">
            <iframe width="560" :src="slide.src" frameborder="0" allowfullscreen></iframe>
          </div>
          <img v-else :src="slide.img" :alt="slide.title" />
        </swiper-slide>
        <div class="swiper-pagination" v-if="pagination"></div>
      </swiper>

      <swiper @swiper="setThumbsSwiper" :watchSlidesProgress="true" :spaceBetween="10" :slidesPerView="4.5"
        :grabCursor="true" :modules="Thumbs" v-if="thumbnails">
        <swiper-slide v-for="(slide, idx) in slides" :key="idx">
          <span class="swiper-slide-thumb-icon" v-if="slide.type === 'video'">
            <img src="../../assets/play.svg" alt="play-icon">
          </span>
          <img :class="{ 'fade': slide.type === 'video' }" :src="slide.type === 'video' ? slide.poster : slide.img" :alt="slide.title" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue';
import './index.css';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  name: 'ProductGallery',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    thumbnails: {
      type: Boolean,
      default: false,
    },
    thumbnailPosition: {
      type: String,
      required: true,
    },
    swipeable: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    slides: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      activeSlide: 0,
      slidesPerView: 1,
    };
  },
  emits: [''],
  setup(props) {
    props = reactive(props);
    const mainSwiper = ref(null);
    const thumbsSwiper = ref(null);

    const moduleProps = () => {
      const result = {};
      if (props.pagination) {
        result.pagination = {
          el: '.swiper-pagination',
          clickable: true,
        };
      }
      if (props.thumbnails) {
        result.thumbs = {
          swiper: thumbsSwiper.value,
        };
        result.navigation = true;
      }
      return result;
    };

    const setThumbsSwiper = (swiper) => {
      thumbsSwiper.value = swiper;
    };

    const onSwiper = (swiper) => {
      //console.log(swiper);
      mainSwiper.value = swiper;
    };

    const onSlideChange = () => {
      //console.log('slide change');
    };

    const modulesToLoad = computed(() => {
      const modules = [];
      if (props.pagination) {
        modules.push(Pagination);
      }
      if (props.thumbnails) {
        modules.push(Thumbs);
        modules.push(Navigation);
      }
      return modules;
    });

    return {
      classes: computed(() => ({
        'gallery--thumbnail-left': props.thumbnailPosition === 'left',
        'gallery--thumbnail-bottom': props.thumbnailPosition === 'bottom',
      })),
      onSwiper,
      onSlideChange,
      moduleProps,
      thumbsSwiper,
      setThumbsSwiper,
      modules: modulesToLoad,
      swipe: props.swipeable,
    };
  },
};
</script>

<style scoped>

  .gallery {
    position: relative;
    width: 650px;
  }

  .gallery--thumbnail-left {
    flex-direction: row;
  }

  .swiper-thumbs .swiper-slide {
    width: 100%;
    height: auto;
  }

  .swiper-thumbs .swiper-slide-thumb-active {
    border: solid 1.5px;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-slide-thumb-icon img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    object-fit: unset;
    z-index: 10;
  }

  .swiper-slide iframe {
    width: 100%;
    height: 400px;
  }

  .swiper-pagination {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .fade {
    opacity: 0.5;
    z-index: 1;
  }
</style>