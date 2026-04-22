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
          <div :class="['product-card__variants', variantSelector]" v-if="variantSelector === 'swatch'">
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
          <div :class="['product-card__variants', variantSelector]" v-else-if="variantSelector === 'select'">
            <div class="custom-select" ref="customSelect">
              <div class="custom-select__trigger" ref="trigger" @click="toggleDropdown">
                <span class="custom-select__swatch" :style="{ backgroundColor: getSwatchColor(selectedVariant) }"></span>
                <span class="custom-select__label">{{ selectedVariant.title }}</span>
                <span class="custom-select__arrow" :class="{ 'open': isDropdownOpen }"></span>
              </div>
              <div
                class="custom-select__options"
                v-if="isDropdownOpen"
                :style="dropdownStyle"
              >
                <div
                  class="custom-select__option"
                  v-for="variant in product.variants"
                  :key="variant.id"
                  :class="{ 'selected': selectedVariantId === variant.id }"
                  @click="selectVariantFromDropdown(variant)"
                >
                  <span class="custom-select__swatch" :style="{ backgroundColor: getSwatchColor(variant) }"></span>
                  <span class="custom-select__label">{{ variant.title }}</span>
                </div>
              </div>
            </div>
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
    variantSelector: {
      type: String,
      required: false,
      default: 'swatch',
    }
  },
  data() {
    return {
      selectedVariantId: this.product.variants[0].id,
      quantity: 1,
      isDropdownOpen: false,
      dropdownPosition: { top: 0, left: 0, width: 0 }
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  computed: {
    selectedVariant() {
      return this.product.variants.find(v => v.id === this.selectedVariantId);
    },
    dropdownStyle() {
      return {
        top: `${this.dropdownPosition.top}px`,
        left: `${this.dropdownPosition.left}px`,
        width: `${this.dropdownPosition.width}px`
      };
    },
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
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen && this.$refs.trigger) {
        this.$nextTick(() => {
          const rect = this.$refs.trigger.getBoundingClientRect();
          this.dropdownPosition = {
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width
          };
        });
      }
    },
    selectVariantFromDropdown(variant) {
      this.selectedVariantId = variant.id;
      this.isDropdownOpen = false;
    },
    selectVariant(variant) {
      this.selectedVariantId = variant.id;
    },
    handleClickOutside(event) {
      if (this.$refs.customSelect && !this.$refs.customSelect.contains(event.target)) {
        this.isDropdownOpen = false;
      }
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
