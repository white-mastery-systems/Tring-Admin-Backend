// store.js
import { reactive } from 'vue';

// Create a reactive state
const state = reactive({
  body: '',  // Your reactive property
  // Add other properties here as needed
});

// Method to set the body value
const setBody = (newBody: any) => {
  state.body = newBody;
};

export default {
  state,
  setBody,
};
