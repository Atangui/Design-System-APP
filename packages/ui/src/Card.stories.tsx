import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Card Title</h3>
        <p style={{ margin: 0, color: '#666' }}>This is a card with elevated variant.</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Card Title</h3>
        <p style={{ margin: 0, color: '#666' }}>This is a card with outlined variant.</p>
      </div>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Card Title</h3>
        <p style={{ margin: 0, color: '#666' }}>This is a card with filled variant.</p>
      </div>
    ),
  },
};
