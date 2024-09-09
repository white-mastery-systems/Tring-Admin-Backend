export default defineEventHandler((event) => {
  handleCors(event, {
    methods: "*",
  });
});
//https://github.com/radix-vue/radix-vue/discussions/435