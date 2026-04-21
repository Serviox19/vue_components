import ProductCard from '../components/ProductCard/ProductCard.vue';
import productData from '../../public/product.json';

export default {
  title: 'Product/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    product: {
      control: { type: 'object' },
    },
  },
};

export const Default = {
  args: {
    product: productData,
  }
};
