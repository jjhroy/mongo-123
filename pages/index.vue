<template>
  <div class="flex flex-col m-auto justify-center items-center">
    <!-- <NuxtImg
      crossorigin
      src="https://img.linkstarted.top/public/main-logo.png"
      class="w-[220px] mb-6" /> -->
    <div
      class="mx-auto relative px-4 w-[640px] min-h-[42px] rounded-[24px] shadow-[0_1px_6px_0_#20212447] group group-focus:ring-2 group-focus:ring-pink-500">
      <div class="flex items-center w-[600px] h-[42px]">
        <div class="pr-2">
          <!-- <div
            class="flex gap-x-1 w-[22px] hover:w-auto overflow-x-hidden hover:overflow-auto transition-all">
            <Icon
              v-for="{ icon, key, color } in searchEngineList"
              class="flex-shrink-0 cursor-pointer"
              :style="{ color: color }"
              :name="icon"
              size="22px"
              @click="switchEngine(key)" />
          </div> -->
          <Icon
            class="flex-shrink-0 cursor-pointer text-[#1a1a1a]"
            name="iconamoon:search-bold"
            size="22px"
            @click="switchEngine('google')" />
        </div>
        <input
          v-model="searchKeyWord"
          @input="getInput"
          @keyup.enter="toSearchPage"
          placeholder="想你所想"
          class="flex-grow h-[42px] outline-none bg-transparent text-[#1a1a1a] caret-pink-500" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useGlobalStore, globalStore } from '~/store/global';
  import type { IBaiduSuggestion, ISearchEngine } from '~/interface/global';
  import fetchJsonp from 'fetch-jsonp';

  const { engineKey } = useGlobalStore();
  const { switchEngine } = globalStore();
  const searchKeyWord = ref('');
  const suggestList = ref<string[]>([]);
  const searchEngineList = ref<ISearchEngine[]>([
    {
      key: 'google',
      color: '',
      icon: 'logos:google-icon',
      baseUrl: 'https://www.google.com/search?q=',
    },
    {
      key: 'bing',
      color: '#247ec3',
      icon: 'cib:bing',
      baseUrl: 'https://bing.com/search?q=',
    },
    {
      key: 'baidu',
      color: '#2932e1',
      icon: 'simple-icons:baidu',
      baseUrl: 'https://www.baidu.com/s?wd=',
    },
  ]);
  const engineKeys = ['baidu', 'google', 'bing'];
  const currentEngineKey = ref(
    engineKeys.includes(engineKey.value) ? engineKey.value : 'baidu'
  );
  const currentEngine = ref(
    searchEngineList.value.find((item) => item.key === currentEngineKey.value)
  );

  // 切换搜索引擎
  // const switchEngine = (key: string) => {
  //   const cur = searchEngineList.value.find((item) => item.key === key);
  //   searchEngineList.value[0] = searchEngineList.value[index];
  //   searchEngineList.value[index] = cur;
  // };
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
