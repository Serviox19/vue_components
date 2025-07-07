<template>
  <div class="product-display">
    <!-- Your component's HTML template goes here -->
    <div class="product-left">
      <!-- import product gallery -->
      <product-gallery
        :slides="slides"
        :thumbnails="true"
        :pagination="true"
        :swipeable="true"
        :thumbnail-position="'bottom'"
      />
    </div>
    <div class="product-right">
      <!-- import product details -->
      <div class="product-details">
        <h1>Product Name</h1>
        <p>Description of the product goes here. It should be detailed and informative.</p>
        <p>Price: $XX.XX</p>
        <p>Available Stock: XX</p>
        <p>Category: Category Name</p>
        <p>Rating: ★★★★☆</p>
        <div class="product-detail__actions">
          <div class="product-detail__quantity">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" max="10" value="1" />
          </div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductGallery from '../Gallery/Gallery.vue';
import productData from '/slides.json';

export default {
  name: 'ProductDisplay',
  components: {
    ProductGallery
  },
  data() {
    return {
      slides: productData
    };
  },
  props: {
    // Your component's props go here
  },
  computed: {
    // Your component's computed properties go here
  },
  methods: {
    // Your component's methods go here
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
/* Your component's styles go here */
</style>