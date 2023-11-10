<script lang="ts" setup>
import { ref } from "vue";
import DatePicker from "./components/DatePicker.vue";

const someDate = ref();
const anotherDate = ref(new Date(2021, 0, 1));
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col">
    <header class="my-20">
      <h1 class="font-bold text-2xl text-center text-gray-800"><span class="text-green-400">Vue</span> DatePicker</h1>
    </header>
    <main class="mx-auto container flex-1">
      <div class="mx-auto max-w-xs">
        <div class="mb-3">
          <label class="font-medium text-sm" for="some-date">Some date</label>
          <DatePicker id="some-date" placeholder="Choose a date..." v-model="someDate" :week-start="1" />
        </div>
        <form>
          <div>
            <label class="font-medium text-sm" for="another-date">Another date</label>
            <DatePicker id="another-date" placeholder="Choose a date..." v-model="anotherDate" :week-start="1" />
          </div>
        </form>
      </div>
    </main>
    <footer class="mt-20 mb-1">
      <p class="text-xs text-center">2023 - Damien Heulin</p>
    </footer>
  </div>
</template>
