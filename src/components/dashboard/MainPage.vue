<script setup>

import {
  onMounted,
  reactive, ref
} from "vue";
import {addPropsToJsonPanel} from "../../utils/common_utils";
import {auth_store} from "../../stores/auth_store";
import {JSON_PANEL_PROPS} from "../../utils/constant";
import VueJsonPretty from "vue-json-pretty";

const refValue = ref(0);

const reactiveValue = reactive(auth_store().user);

const test = {
  value: 0
};

const test2 = ref(test)

function add1() {
  refValue.value = refValue.value + 1;
}

function add2() {
  reactiveValue.value = reactiveValue.value + 1;
}

function add3() {
  reactiveValue.value = null;
}

function add4() {
  test2.value.value = test2.value.value + 1;
}

onMounted(() => {
  // addPropsToJsonPanel('refValue', refValue);
  // addPropsToJsonPanel('reactiveValue', reactiveValue);
  // addPropsToJsonPanel('user', auth_store().user);
})

</script>

<template>
  <div>
    <div>
      {{ refValue }}
    </div>
    <div>
      {{ reactiveValue }}
    </div>
    <div>
      {{ test }}
    </div>
    <div>
      {{ test2 }}
    </div>
    <div>
      <VueJsonPretty
          :data="refValue"
          :deep="3"
          showLength
          highlightMouseover
          class="json-viewer"
      />
      <VueJsonPretty
          :data="reactiveValue"
          :deep="3"
          showLength
          highlightMouseover
          class="json-viewer"
      />
      <VueJsonPretty
          :data="test"
          :deep="3"
          showLength
          highlightMouseover
          class="json-viewer"
      />
      <VueJsonPretty
          :data="test2"
          :deep="3"
          showLength
          highlightMouseover
          class="json-viewer"
      />
    </div>
    <div>
      <button @click="add1">add1</button>
      <button @click="add2">add2</button>
      <button @click="add3">add3</button>
      <button @click="add4">add4</button>
    </div>
  </div>

</template>

<style scoped>

</style>