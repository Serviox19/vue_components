<template>
  <div class="storybook-wrapper">
    <div class="gallery" :class="classes" v-if="slides && slides.length > 0">
      <!-- Main Swiper -->
      <swiper :slides-per-view="slidesPerView" :space-between="0" :modules="modules" v-bind="moduleProps()"
        @swiper="onSwiper" @slideChange="onSlideChange" class="main-swiper">
        <swiper-slide v-for="(slide, idx) in slides" :key="idx">
          <div v-if="slide.type === 'video'">
            <iframe
              width="560"
              :id="'gallery-yt-' + idx"
              :src="embedSrc(slide.src)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
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
          <img :class="{ 'fade': slide.type === 'video' }" :src="slide.type === 'video' ? slide.poster : slide.img"
            :alt="slide.title" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref, watch, onBeforeUnmount, nextTick } from 'vue';
import './index.css';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

let youtubeApiPromise = null;

function loadYouTubeIframeAPI() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') {
          prev();
        }
        resolve();
      };
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    });
  }
  return youtubeApiPromise;
}

function embedSrc(baseSrc) {
  if (!baseSrc) {
    return '';
  }
  try {
    const u = new URL(baseSrc, window.location.href);
    u.searchParams.set('enablejsapi', '1');
    u.searchParams.set('origin', window.location.origin);
    return u.toString();
  } catch {
    const sep = baseSrc.includes('?') ? '&' : '?';
    return `${baseSrc}${sep}enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
  }
}

function pauseYouTubeSlide(ytPlayers, slideIndex) {
  const player = ytPlayers.get(slideIndex);
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
    return;
  }
  const el = typeof document !== 'undefined' ? document.getElementById(`gallery-yt-${slideIndex}`) : null;
  if (el?.contentWindow) {
    el.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
      '*',
    );
  }
}

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
      slidesPerView: 1,
    };
  },
  setup(props) {
    props = reactive(props);
    const mainSwiper = ref(null);
    const thumbsSwiper = ref(null);
    const lastSlideIndex = ref(0);
    const ytPlayers = new Map();

    const destroyAllPlayers = () => {
      ytPlayers.forEach((p) => {
        try {
          p.destroy();
        } catch {
          /* noop */
        }
      });
      ytPlayers.clear();
    };

    const initYoutubePlayers = async () => {
      await loadYouTubeIframeAPI();
      await nextTick();
      if (!window.YT?.Player) {
        return;
      }
      props.slides.forEach((slide, idx) => {
        if (slide.type !== 'video' || ytPlayers.has(idx)) {
          return;
        }
        const el = document.getElementById(`gallery-yt-${idx}`);
        if (!el) {
          return;
        }
        try {
          const player = new window.YT.Player(el.id, {});
          ytPlayers.set(idx, player);
        } catch {
          /* iframe may not be ready; retry on next slides update */
        }
      });
    };

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

    const onSwiper = async (swiper) => {
      mainSwiper.value = swiper;
      lastSlideIndex.value = swiper.activeIndex;
      destroyAllPlayers();
      await initYoutubePlayers();
    };

    const onSlideChange = (swiper) => {
      const next = swiper.activeIndex;
      const prev = lastSlideIndex.value;
      if (prev !== next && props.slides[prev]?.type === 'video') {
        pauseYouTubeSlide(ytPlayers, prev);
      }
      lastSlideIndex.value = next;
    };

    watch(
      () => props.slides.map((s) => (s.type === 'video' ? s.src : s.img)),
      async () => {
        destroyAllPlayers();
        await nextTick();
        await initYoutubePlayers();
      },
    );

    onBeforeUnmount(() => {
      destroyAllPlayers();
    });

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
      embedSrc,
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
