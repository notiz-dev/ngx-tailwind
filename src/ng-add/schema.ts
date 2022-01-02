export interface Schema {
  /**
   * Autoprefixer version.
   */
  autoprefixerVersion: string;

  /**
   * Css stylesheet format.
   */
  cssFormat: CssFormat;

  /**
   * The project in which we want to generate our component.
   */
  project: string;

  /**
   * postcss version.
   */
  postcssVersion: string;

  /**
   * Tailwind CSS version.
   */
  tailwindVersion: string;

  /**
   * Official @tailwindcss/* plugins installed and added to tailwind.config.js
   */
  tailwindPlugins: string[];
}

export type CssFormat = 'css' | 'scss';
