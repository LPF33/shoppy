<template>
  <form @submit.prevent="submit">
    <h1>Login</h1>
    <div v-if="error" class="error">{{ errorMessage }}</div>
    <input
      type="email"
      required
      placeholder="email"
      v-model="email"
      ref="input"
    />
    <input type="password" required placeholder="password" v-model="password" />
    <button type="submit">Submit</button>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { ActionTypes } from "@/Types/Store";

export default defineComponent({
  name: "Login",
  setup() {
    const data = reactive({ email: "", password: "" });
    const store = useStore();
    const input = ref<HTMLInputElement | null>(null);

    function submit() {
      store.dispatch(ActionTypes.SIGN_IN, {
        email: data.email,
        password: data.password,
      });
    }

    const error = computed(() => store.state.error);
    const errorMessage = computed(() => store.state.errorMessage);

    onMounted(() => {
      input.value?.focus();
    });

    return { ...toRefs(data), submit, error, errorMessage, input };
  },
});
</script>

<style scoped>
h1 {
  padding-bottom: 10vh;
}

form {
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

button[type="submit"] {
  background-color: #39a9cb;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 30px;
  margin: 20px 10%;
}
button[type="submit"]:hover {
  background-color: #2940d3;
}
input {
  margin: 5px;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
  margin: 20px 10%;
}
.error {
  background-color: red;
  text-align: center;
  font-size: 1.5rem;
  padding: 10px;
}
</style>
