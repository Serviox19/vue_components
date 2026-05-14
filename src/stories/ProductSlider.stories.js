import ProductSlider from '../components/ProductSlider/ProductSlider.vue';
import productData from '../../public/product.json';

export default {
  title: 'Product/ProductSlider',
  component: ProductSlider,
};

export const Default = {
  args: {
    data: productData,
  },
};