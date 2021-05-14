import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div
      class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
    >
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          class="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
        ></div>
        <div
          class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
        >
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-4xl">Tailwind CSS Schematics</h1>
            </div>
            <div class="divide-y divide-gray-200">
              <div
                class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                <p>
                  Simple
                  <a
                    href="https://angular.io/"
                    class="text-red-600 hover:text-red-700"
                    >Angular</a
                  >
                  schematic initializing
                  <a
                    href="https://tailwindcss.com/"
                    class="text-teal-600 hover:text-teal-700"
                    >Tailwind CSS</a
                  >
                  in your project and adds a custom webpack config to your build
                  process.
                </p>
                <ul class="list-disc space-y-2">
                  <li class="flex items-start">
                    <span class="h-6 flex items-center sm:h-7">
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-teal-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <p class="ml-2">
                      Creating a
                      <code class="text-sm font-bold text-gray-900"
                        >webpack.config.js</code
                      >
                      file
                    </p>
                  </li>
                  <li class="flex items-start">
                    <span class="h-6 flex items-center sm:h-7">
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-teal-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <p class="ml-2">
                      Adding tailwind imports to
                      <code class="text-sm font-bold text-gray-900"
                        >src/styles.scss</code
                      >
                    </p>
                  </li>
                  <li class="flex items-start">
                    <span class="h-6 flex items-center sm:h-7">
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-teal-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <p class="ml-2">
                      Configuring
                      <code class="text-sm font-bold text-gray-900"
                        >angular.json</code
                      >
                      file
                    </p>
                  </li>
                  <li class="flex items-start">
                    <span class="h-6 flex items-center sm:h-7">
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-teal-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <p class="ml-2">Installing dependencies</p>
                  </li>
                </ul>
                <p>
                  Perfect to quickly get started using Angular + Tailwind CSS.
                </p>
              </div>
              <div
                class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7"
              >
                <p>Check out on the Schematics on GitHub</p>
                <p>
                  <a
                    href="https://github.com/notiz-dev/ngx-tailwind#readme"
                    class="text-teal-600 hover:text-teal-700"
                  >
                    Repo on GitHub &rarr;
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-workspace';
}
