export interface Schema {
  /**
   * The project in which we want to generate our component.
   */
  project: string;

  /**
   * Skip initializing Tailwind.
   */
  skipTailwindInit?: boolean;

  /**
   * Tailwind version.
   */
  tailwindVersion: string;
}
