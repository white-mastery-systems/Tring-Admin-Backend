export default defineEventHandler((event) => {
  handleCors(event, {
    methods: "*",
    origin: "http://localhost:3000",
  });
});
