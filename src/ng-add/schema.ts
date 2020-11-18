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
   * ngx-build-plus version.
   */
  ngxBuildPlusVersion: string;

  /**
   * The project in which we want to generate our component.
   */
  project: string;

  /**
   * postcss version.
   */
  postcssVersion: string;

  /**
   * postcss-import version.
   */
  postcssImportVersion: string;

  /**
   * postcss-loader version.
   */
  postcssLoaderVersion: string;

  /**
   * postcss-scss version.
   */
  postcssScssVersion: string;

  /**
   * Skip initializing Tailwind CSS.
   */
  skipTailwindInit?: boolean;

  /**
   * Tailwind CSS version.
   */
  tailwindVersion: string;
}

export type CssFormat = 'css' | 'scss';
