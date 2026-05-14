<template>
  <div class="product-slider">
    <Swiper :slides="slides" v-bind="swiperOptions">
      <SwiperSlide v-for="slide in slides" :key="slide.id">
        <ProductCard :product="slide" />
      </SwiperSlide>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </Swiper>
  </div>
</template>

<script>
import ProductCard from '../ProductCard/ProductCard.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './index.css';

export default {
  name: 'ProductSlider',
  components: {
    Swiper,
    SwiperSlide,
    ProductCard,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      swiperOptions: {
        modules: [Navigation, Pagination],
        slidesPerView: 3,
        spaceBetween: 12,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }
    }
  },
  computed: {
    slides() {
      return Array.from({ length: 5 }, (_, index) => ({
        ...this.data,
        id: `${this.data.id}-${index}`,
      }));
    },
  },
};
</script>