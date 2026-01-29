import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

// a preset is a set of design tokens, so you you may call it a theme as well.
// a design token is like a key with a value.
// there are 3 types of tokens: primitive, semantic and components.
export const Preset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
  },

  semantic: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d2d2d2',
      400: '#7a7a7a',
      500: '#666666',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    primary: {
      50: '#f5f0f7',
      100: '#e9e0ec',
      200: '#5f724f',
      300: '#5f724f',
      400: '#5f724f',
      500: '#5f724f',
      600: '#5f724f',
      700: '#5f724f',
      800: '#5f724f',
      900: '#5f724f',
    },
    transitionDuration: '0s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: '14px',
    anchorGutter: '2px',
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        paddingY: '0.375rem',
      },
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        paddingY: '0.625rem',
      },
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
    list: {
      padding: '0.25rem 0.25rem',
      gap: '2px',
      header: {
        padding: '0.5rem 1rem 0.25rem 1rem',
      },
      option: {
        padding: '0.5rem 0.75rem',
        borderRadius: '{border.radius.sm}',
      },
      optionGroup: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600',
      },
    },
    content: {
      borderRadius: '{border.radius.md}',
    },
    mask: {
      transitionDuration: '0.15s',
    },
    navigation: {
      list: {
        padding: '0.25rem 0.25rem',
        gap: '2px',
      },
      item: {
        padding: '0.5rem 0.75rem',
        borderRadius: '{border.radius.sm}',
        gap: '0.5rem',
      },
      submenuLabel: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600',
      },
      submenuIcon: {
        size: '0.875rem',
      },
    },
    overlay: {
      select: {
        borderRadius: '{border.radius.md}',
        shadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      popover: {
        borderRadius: '{border.radius.md}',
        padding: '0.75rem',
        shadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      modal: {
        borderRadius: '0',
        padding: '1rem',
        shadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      navigation: {
        shadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  components: {
    drawer: {
      background: '{primary.900}',
      shadow: 'none',
      header: { padding: '25px 15px' },
    },
    accordion: {
      header: {
        active: {
          hover: {
            background: 'transparent',
            color: '{surface.0}',
          },
          color: '{surface.0}',
          background: 'transparent',
        },
        focus: {
          ring: {
            shadow: 'none',
            color: '{surface.0}',
          },
        },
        background: 'transparent',
        padding: '0px',
        color: '{surface.0}',
        hover: { color: '{surface.0}', background: 'transparent' },
      },
      content: {
        padding: '0px',
        background: 'transparent',
      },
    },
    toggleswitch: { width: '40px', height: '20px' },
    card: { body: { padding: '1rem' } },
    checkbox: {
      checked: {
        hover: { background: '{gray.500}', border: { color: '{gray.500}' } },
        background: '{gray.500}',
        border: { color: '{gray.500}' },
      },
      width: '23px',
      height: '23px',
      border: { radius: '3px' },
    },
    password: {
      overlay: {
        border: {
          color: '{gray.500}',
        },
      },
    },
    tree: { node: { gap: '7px' } },
    tooltip: { padding: '3px 10px' },
    timeline: { vertical: { event: { content: { padding: '0' } } } },
    popover: { content: { padding: '0' } },
    inputtext: {
      placeholder: { color: '{gray.400}' },
    },
    textarea: {
      placeholder: { color: '{gray.400}' },
    },
    select: {
      focus: {
        border: {
          color: '{primary.900}',
        },
      },
      placeholder: {
        color: '{gray.400}',
      },
      shadow: 'none',
      option: {
        padding: '8px 12px',
      },
      list: {
        header: { padding: '8px 12px 0' },
      },
    },
    multiselect: {
      option: {
        padding: '5px 8px',
      },
      list: {
        header: { padding: '8px 12px' },
      },
    },
  },
});
