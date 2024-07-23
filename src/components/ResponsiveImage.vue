<template>
  <div class="responsive-image">
    <img :src="imageUrl" :alt="altText" :class="{ 'loaded': imageLoaded }" @load="handleImageLoad" />
    <div v-if="!imageLoaded" class="loading-spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveImage',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false
    };
  },
  methods: {
    handleImageLoad() {
      this.imageLoaded = true;
    }
  }
};
</script>

<style scoped>
.responsive-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* Adjust this value to control the aspect ratio of the image */
}

.responsive-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.responsive-image img.loaded {
  opacity: 1;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>