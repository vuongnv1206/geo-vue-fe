<template>
  <VaSidebar v-model="writableVisible" :width="sidebarWidth" :color="color" minimized-width="0">
    <VaAccordion v-model="value" multiple>
      <VaCollapse v-for="(route, index) in navigationRoutesCanAccess" :key="index">
        <template #header="{ value: isCollapsed }">
          <VaSidebarItem
            :to="route.children ? undefined : { name: route.name }"
            :active="routeHasActiveChild(route)"
            :active-color="activeColor"
            :text-color="textColor(route)"
            :aria-label="`${route.children ? 'Open category ' : 'Visit'} ${t(route.displayName)}`"
            role="button"
            hover-opacity="0.10"
          >
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <VaIcon
                v-if="route.meta.icon"
                aria-hidden="true"
                :name="route.meta.icon"
                size="20px"
                :color="iconColor(route)"
              />
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                {{ t(route.displayName) }}
                <VaIcon v-if="route.children" :name="arrowDirection(isCollapsed)" size="20px" />
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </template>
        <template #body>
          <div v-for="(childRoute, index2) in route.children" :key="index2">
            <VaSidebarItem
              :to="{ name: childRoute.name }"
              :active="isActiveChildRoute(childRoute)"
              :active-color="activeColor"
              :text-color="textColor(childRoute)"
              :aria-label="`Visit ${t(route.displayName)}`"
              hover-opacity="0.10"
            >
              <VaSidebarItemContent class="py-3 pr-2 pl-11">
                <VaSidebarItemTitle class="leading-5 font-semibold">
                  {{ t(childRoute.displayName) }}
                </VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
          </div>
        </template>
      </VaCollapse>
    </VaAccordion>
  </VaSidebar>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'

import navigationRoutes, { type INavigationRoute } from './NavigationRoutes'

import { useAuthStore } from '../../stores/modules/auth.module'

export default defineComponent({
  name: 'Sidebar',
  props: {
    visible: { type: Boolean, default: true },
    mobile: { type: Boolean, default: false },
  },
  emits: ['update:visible'],

  setup: (props, { emit }) => {
    const { getColor, colorToRgba } = useColors()
    const route = useRoute()
    const authStore = useAuthStore()
    const { t } = useI18n()

    const value = ref<boolean[]>([])

    const writableVisible = computed({
      get: () => props.visible,
      set: (v: boolean) => emit('update:visible', v),
    })

    const isActiveChildRoute = (child: INavigationRoute) => route.name === child.name

    const routeHasActiveChild = (section: INavigationRoute) => {
      if (!section.children) {
        return route.path.endsWith(`${section.name}`)
      }

      return section.children.some(({ name }) => route.path.endsWith(`${name}`))
    }

    const hasAccess = (route: INavigationRoute) => {
      if (!route.meta) {
        return true
      }
      if (route.meta.permission) {
        return authStore.hasAccess(route.meta.permission)
      }
      return true
    }

    const setActiveExpand = () =>
      (value.value = navigationRoutes.routes.map((route: INavigationRoute) => routeHasActiveChild(route)))

    const sidebarWidth = computed(() => (props.mobile ? '100vw' : '280px'))
    const color = computed(() => getColor('background-secondary'))
    const activeColor = computed(() => colorToRgba(getColor('focus'), 0.1))
    const navigationRoutesCanAccess = computed(() => {
      const clonedNavigationRoutes = navigationRoutes.routes.map((route) => {
        return { ...route }
      })
      return clonedNavigationRoutes.filter((route: INavigationRoute) => {
        if (!hasAccess(route)) {
          return false
        }
        if (route.children) {
          route.children = route.children.filter((child: INavigationRoute) => hasAccess(child))
          // If there are no children left, don't show the parent
          return route.children.length > 0
        }
        return true
      })
    })

    const iconColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'secondary')
    const textColor = (route: INavigationRoute) => (routeHasActiveChild(route) ? 'primary' : 'textPrimary')
    const arrowDirection = (state: boolean) => (state ? 'va-arrow-up' : 'va-arrow-down')

    watch(() => route.fullPath, setActiveExpand, { immediate: true })

    return {
      writableVisible,
      sidebarWidth,
      value,
      color,
      activeColor,
      navigationRoutes,
      navigationRoutesCanAccess,
      routeHasActiveChild,
      hasAccess,
      isActiveChildRoute,
      t,
      iconColor,
      textColor,
      arrowDirection,
    }
  },
})
</script>
