<template>
  <div class="flex flex-col m-auto justify-center items-center">
    <NuxtImg
      crossorigin
      src="https://img.linkstarted.top/public/main-logo.png"
      class="w-[220px] mb-6" />
    <div
      class="mx-auto relative px-4 w-[640px] min-h-[42px] border border-[red] rounded-[24px] shadow-md">
      <div class="flex items-center w-[600px] h-[42px]">
        <div class="pr-2">
          <div
            class="flex gap-x-1 w-[22px] hover:w-auto overflow-x-hidden hover:overflow-auto transition-all">
            <Icon
              v-for="({ icon, name, color }, index) in searchEngineList"
              class="flex-shrink-0 cursor-pointer"
              :style="{ color: color }"
              :name="icon"
              size="22px"
              @click="switchEngine(index)" />
          </div>
        </div>
        <input
          v-model="searchKeyWord"
          @input="getInput"
          @keyup.enter="toSearchPage"
          placeholder="想你所想"
          class="flex-grow h-[42px] outline-none bg-transparent text-[#1a1a1a]" />
      </div>
      <ul
        v-if="suggestList.length"
        class="flex flex-col gap-y-3 py-3 pl-4">
        <li
          v-for="word in suggestList"
          :key="word"
          class="text-gray-600">
          <NuxtLink
            class="text-[#1a1a1a]"
            :to="`${searchEngineList[0].baseUrl}${word}`"
            external
            target="_blank">
            {{ word }}
          </NuxtLink>
        </li>
      </ul>
      <!-- <div
        class="ml-3 cursor-pointer"
        @click="getGoogleSearch">
        Google
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IBaiduSuggestion } from '~/interface/suggestion';
  import fetchJsonp from 'fetch-jsonp';
  const searchKeyWord = ref('');
  const suggestList = ref<string[]>([]);
  const currentEngine = ref(0);
  const searchEngineList = ref([
    {
      name: 'Google',
      color: '',
      icon: 'logos:google-icon',
      baseUrl: 'https://www.google.com/search?q=',
    },
    {
      name: 'Bing',
      color: '#247ec3',
      icon: 'cib:bing',
      baseUrl: 'https://bing.com/search?q=',
    },
    {
      name: 'Baidu',
      color: '#2932e1',
      icon: 'simple-icons:baidu',
      baseUrl: 'https://www.baidu.com/s?wd=',
    },
  ]);
  // 切换搜索引擎
  const switchEngine = (index: number) => {
    const cur = searchEngineList.value[0];
    searchEngineList.value[0] = searchEngineList.value[index];
    searchEngineList.value[index] = cur;
  };
  // 获取百度联想数据
  const suggestionList = () => {
    fetchJsonp(`https://suggestion.baidu.com/su?wd=${searchKeyWord.value}`, {
      jsonpCallback: 'cb',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json: IBaiduSuggestion) {
        console.log('parsed json', json);
        suggestList.value = json.s;
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
  };
  // 输入节流
  const getInput = useThrottle(() => {
    if (searchKeyWord.value !== '') {
      suggestionList();
    } else {
      suggestList.value = [];
    }
  }, 500);
  // 发起搜索
  const toSearchPage = () => {
    if (searchKeyWord.value) {
      window.open(
        `${searchEngineList.value[0].baseUrl}${searchKeyWord.value}`,
        '_blank'
      );
    }
  };
</script>

<style scoped lang="scss"></style>
