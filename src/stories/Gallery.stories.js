// import { within, userEvent, expect } from '@storybook/test';
import ProductGallery from '../components/Gallery/Gallery.vue';

export default {
  title: 'Product/Gallery',
  component: ProductGallery,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    thumbnailPosition: {
      control: { type: 'radio' },
      options: ['left', 'bottom']
    },
    thumbnails: {
      control: { type: 'boolean' }
    },
    swipeable: {
      control: { type: 'boolean' }
    },
    pagination: {
      control: { type: 'boolean' }
    },
  },
};

export const Default = {
  args: {
    thumbnails: false,
    swipeable: true,
    pagination: true,
    thumbnailPosition: "left"
  },
};

export const Thumbs = {
  args: {
    thumbnails: true,
    pagination: false,
    thumbnailPosition: 'left',
    swipeable: true,
  },
};