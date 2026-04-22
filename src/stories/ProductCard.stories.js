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
    variantSelector: {
      control: { type: 'array' },
      options: ['select', 'swatch'],
      defaultValue: 'swatch',
    }
  },
};

export const Default = {
  args: {
    product: productData,
    variantSelector: 'swatch',
  }
};

export const Select = {
  args: {
    product: productData,
    variantSelector: 'select',
  }
};
