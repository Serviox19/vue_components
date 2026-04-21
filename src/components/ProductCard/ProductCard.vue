<template>
  <div class="storybook-wrapper">
    <div class="product-card">
      <div class="product-card__image">
        <img :src="imageUrl" :alt="cardTitle" :width="imageWidth" :height="imageHeight" loading="lazy" />
      </div>
      <div class="product-card__content">
        <div class="common_div variant_and_price">
          <div class="product-card__variant">{{ variantToShow }}</div>
          <div class="product-card__price">{{ priceToShow }}</div>
        </div>
        <h2 class="product-card__title">{{ cardTitle }}</h2>
        <div class="product-card__actions">
          <!-- variant chips-->
          <div class="product-card__variants">
            <button
              class="product-card__variant-chip"
              v-for="variant in product.variants"
              :key="variant.id"
              :class="{ selected: selectedVariant?.id === variant.id }"
              @click="selectVariant(variant)"
              :style="{ backgroundColor: getSwatchColor(variant) }"
              :aria-label="variant.title"
            ></button>
          </div>
          <div class="product-card__actions-wrapper">
            <!-- qty-->
            <div class="product-card__quantity">
              <button
                class="qty-btn qty-btn--minus"
                @click="decrementQty"
                :disabled="quantity <= 1"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span class="qty-value">{{ quantity }}</span>
              <button
                class="qty-btn qty-btn--plus"
                @click="incrementQty"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <!-- add to cart button-->
            <button class="product-card__atc">add to cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './index.css';

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedVariant: this.product.variants[0],
      quantity: 1
    };
  },
  computed: {
    imageUrl() {
      if (this.selectedVariantImage) {
        return this.selectedVariantImage;
      }
      if (this.product.image) {
        return this.product.image.src;
      }
      const p = this.product;
      const first = Array.isArray(p.images) ? p.images[0] : null;
      return first?.src ?? p.image ?? '';
    },
    cardTitle() {
      return this.product.title ?? this.product.name ?? '';
    },
    priceToShow() {
      return this.selectedVariant?.price ?? this.product?.price ?? '';
    },
    variantToShow() {
      return this.selectedVariant?.title ?? this.selectedVariant?.option1 ?? '';
    },
    selectedVariantImage() {
      const image = this.product.images.find(image => image.variant_ids.includes(this.selectedVariant.id));
      return image?.src ?? '';
    }
  },
  methods: {
    selectVariant(variant) {
      this.selectedVariant = variant;
    },
    getSwatchColor(variant) {
      const name = (variant.title || variant.option1 || '').toLowerCase().trim();
      return this.product.swatchColors?.[name] || '#ccc';
    },
    incrementQty() {
      this.quantity += 1;
    },
    decrementQty() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
  },
};
</script>
