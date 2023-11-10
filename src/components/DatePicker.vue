<script lang="ts" setup>
import { computed, ref, toRef } from "vue";
import CalendarIcon from "./icon/Calendar.vue";
import { usePopup } from "../composables/usePopup";
import ChevronLeftIcon from "./icon/ChevronLeft.vue";
import ChevronRightIcon from "./icon/ChevronRight.vue";
import { calculateBlankDays, calculateMonthDays, generateWeekDays } from "../helpers/date";

// const datePickerRef = ref<HTMLElement>();
const date = defineModel<Date>()
const props = withDefaults(
  defineProps<{
    dateStyle?: 'short' | 'medium' | 'long';
    id?: string;
    locale?: string;
    name?: string;
    placeholder?: string;
    weekStart?: number;
  }>(),
  {
    dateStyle: 'short',
    locale: () => navigator.language || 'en-US',
    weekStart: 0,
  }
);

const year = date.value ? toRef(date.value.getFullYear()) : ref(new Date().getFullYear());
const month = date.value ? toRef(date.value.getMonth()) : ref(new Date().getMonth());

const {
  isVisible: calendarVisible,
  open: openCalendar,
  close: closeCalendar,
  target: datePickerRef
} = usePopup();

const weekDays = computed(() => generateWeekDays({
  locale: props.locale,
  weekStart: props.weekStart
}));
const blankDays = computed(() => Array.from({
  length: calculateBlankDays(year.value, month.value, { weekStart: props.weekStart })
}, (_, i) => i + 1));
const monthDays = computed(() => Array.from({
  length: calculateMonthDays(year.value, month.value)
}, (_, i) => i + 1));

const monthName = computed(() => {
  const longMonthName = new Date(year.value, month.value).toLocaleString(props.locale, { month: 'long' })
  return longMonthName.charAt(0).toUpperCase() + longMonthName.slice(1);
});

function previousMonth() {
  if (month.value === 0) {
    year.value--;
    month.value = 11;
  } else {
    month.value--;
  }
}
function nextMonth() {
  if (month.value === 11) {
    year.value++;
    month.value = 0;
  } else {
    month.value++;
  }
}

function isToday(day: number) {
  return new Date(year.value, month.value, day).toDateString() === new Date().toDateString();
}

function isSelected(day: number) {
  return date.value?.toDateString() === new Date(year.value, month.value, day).toDateString();
}

function selectDay(day: number) {
  date.value = new Date(year.value, month.value, day);
  setTimeout(() => closeCalendar(), 200);
};
</script>

<template>
  <div class="relative">
    <input :name="props.name" type="hidden" :value="date?.toISOString()">
    <input @click="openCalendar" @focus="openCalendar" :aria-expanded="calendarVisible" aria-haspopup="dialog"
      :class="['pl-3 pr-9 py-1 w-full bg-transparent shadow-sm rounded border border-gray-200 text-sm cursor-pointer']"
      :id="props.id" :placeholder="props.placeholder" readonly role="button" type="text"
      :value="date?.toLocaleDateString(props.locale, { dateStyle: props.dateStyle })">
    <span class="px-2 py-1 absolute top-0 right-0 pointer-events-none">
      <CalendarIcon class="w-5 h-5" />
    </span>
    <Transition enter-from-class="opacity-0 -translate-y-1"
      enter-active-class="transition-opacity transition-transform ease-out">
      <div class="mt-1 absolute top-full left-0 z-50" ref="datePickerRef" role="dialog" v-show="calendarVisible">
        <div class="px-3 py-1 bg-white shadow-sm rounded border border-gray-200">
          <div class="my-3 flex justify-between items-center">
            <div>
              <span class="font-bold text-lg">{{ monthName }}</span>
              <span class="ml-1 text-xl text-gray-700">{{ year }}</span>
            </div>
            <div class="inline-flex">
              <button @click="previousMonth" class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out" role="button" type="button">
                <ChevronLeftIcon class="w-6 h-6 text-gray-700" />
              </button>
              <button @click="nextMonth" class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out" role="button" type="button">
                <ChevronRightIcon class="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
          <div class="mb-1 grid grid-cols-7 gap-1">
            <span class="w-8 h-8 inline-flex justify-center items-center font-bold text-xs text-center leading-loose"
              :key="weekDay" v-for="weekDay in weekDays">{{ weekDay }}</span>
          </div>
          <div :key="month" class="mb-3 grid grid-cols-7 gap-1">
            <span class="w-8 h-8 inline-block text-sm" :key="blankDay" v-for="blankDay in blankDays"></span>
            <button @click="selectDay(monthDay)" :class="[
              'w-8 h-8 inline-block rounded-full text-sm text-center leading-loose text-gray-700 transition-colors duration-200 ease-in-out',
              { 'font-bold !text-blue-400': isToday(monthDay) && !isSelected(monthDay) },
              { 'hover:bg-blue-200': !isToday(monthDay) && !isSelected(monthDay) },
              { 'bg-blue-400 !text-white': isSelected(monthDay) }
            ]" :key="monthDay" role="button" type="button" v-for="monthDay in monthDays">{{ monthDay }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
