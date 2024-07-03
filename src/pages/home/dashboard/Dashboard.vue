<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@modules/auth.module'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const isTeacher = computed(() => authStore?.musHaveRole('Teacher')) // just for testing
const isStudent = computed(() => authStore?.musHaveRole('Student')) // just for testing
</script>

<template>
  <div class="md:mx-28">
    <div v-if="isTeacher" class="col-span-12 grid grid-cols-12 gap-6 mt-4 flex items-center">
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'questions' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M140-160q-24 0-42-18.5T80-220v-520q0-23 18-41.5t42-18.5h281l60 60h339q23 0 41.5 18.5T880-680v460q0 23-18.5 41.5T820-160H140Zm0-60h680v-460H456l-60-60H140v520Zm0 0v-520 520Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.questions') }}</div>
          </div></RouterLink
        >
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'paper-folder' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M560-574v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-610q-38 0-73 9.5T560-574Zm0 220v-49q33-13.5 67.5-20.25T700-430q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-390q-38 0-73 9t-67 27Zm0-110v-48q33-14 67.5-21t72.5-7q26 0 51 4t49 10v44q-24-9-48.5-13.5T700-500q-38 0-73 9.5T560-464ZM248-300q53.57 0 104.28 12.5Q403-275 452-250v-427q-45-30-97.62-46.5Q301.76-740 248-740q-38 0-74.5 9.5T100-707v434q31-14 70.5-20.5T248-300Zm264 50q50-25 98-37.5T712-300q38 0 78.5 6t69.5 16v-429q-34-17-71.82-25-37.82-8-76.18-8-54 0-104.5 16.5T512-677v427Zm-30 90q-51-38-111-58.5T248-239q-36.54 0-71.77 9T106-208q-23.1 11-44.55-3Q40-225 40-251v-463q0-15 7-27.5T68-761q42-20 87.39-29.5 45.4-9.5 92.61-9.5 63 0 122.5 17T482-731q51-35 109.5-52T712-800q46.87 0 91.93 9.5Q849-781 891-761q14 7 21.5 19.5T920-714v463q0 27.89-22.5 42.45Q875-194 853-208q-34-14-69.23-22.5Q748.54-239 712-239q-63 0-121 21t-109 58ZM276-489Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.examinations') }}</div>
          </div></RouterLink
        >
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'classroom' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M260-260h560v-560h-60v278l-93-57-93 57v-278H260v560Zm0 60q-24 0-42-18t-18-42v-560q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm434-740h186-186Zm-314 0h560-560Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.classroom') }}</div>
          </div></RouterLink
        >
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'assignments' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M319-250h322v-60H319v60Zm0-170h322v-60H319v60ZM220-80q-24 0-42-18t-18-42v-680q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554v-186H220v680h520v-494H551ZM220-820v186-186 680-680Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.assignments') }}</div>
          </div></RouterLink
        >
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'subjects' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M493-139q3 14 11.5 31T522-79H180q-24 0-42-18t-18-42v-681q0-24 18-42t42-18h520q24 0 42 18t18 42v339q-13.5-2-30-2t-30 2v-339H462v278l-96-59-96 59v-278h-90v681h313Zm235 99q-81 0-136.5-55.5T536-232q0-81 55.5-136.5T728-424q81 0 136.5 55.5T920-232q0 81-55.5 136.5T728-40Zm-49-100 143-92-143-92v184ZM270-820h192-192Zm223 0H180h520-223 16Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.subjects') }}</div>
          </div></RouterLink
        >
      </VaCard>
      <VaCard class="shadow-lg rounded-lg p-6 col-span-6 md:col-span-3 intro-y h-full hover:shadow-xl hover-scale">
        <RouterLink :to="{ name: 'teacher-group' }"
          ><div class="box p-8 zoom-in h-full">
            <span class="block w-12 h-12 text-primary mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#154ec1"
              >
                <path
                  d="M38-160v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358-420q62 0 120 14t131 46q32 14 50.5 42.5T678-254v94H38Zm700 0v-94q0-63-32-103.5T622-423q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94H738ZM358-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519-488q24-25 36.5-61.5T568-631q0-45-12.5-79.5T519-774q11-3 24.5-5t24.5-2q66 0 108 42t42 108ZM98-220h520v-34q0-16-9.5-31T585-306q-72-32-121-43t-106-11q-57 0-106.5 11T130-306q-14 6-23 21t-9 31v34Zm260-321q39 0 64.5-25.5T448-631q0-39-25.5-64.5T358-721q-39 0-64.5 25.5T268-631q0 39 25.5 64.5T358-541Zm0 321Zm0-411Z"
                />
              </svg>
            </span>
            <div class="font-bold text-center text-base mt-3">{{ t('menu.teacher-group') }}</div>
          </div></RouterLink
        >
      </VaCard>
    </div>
    <div
      v-if="isStudent"
      class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-lg font-bold">Student can see this</h2>
        <p class="text-3xl font-bold">laho</p>
      </div>
    </div>
  </div>
</template>
<style>
.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 0.5s ease;
}
.hover-scale {
  cursor: pointer;
  transition-property:
    color,
    background-color,
    border-color,
    text-decoration-color,
    fill,
    stroke,
    box-shadow,
    transform,
    filter,
    -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow, transform,
    filter, backdrop-filter;
  transition-property:
    color,
    background-color,
    border-color,
    text-decoration-color,
    fill,
    stroke,
    box-shadow,
    transform,
    filter,
    backdrop-filter,
    -webkit-backdrop-filter;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
