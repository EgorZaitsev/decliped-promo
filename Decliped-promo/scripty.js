import { API } from "vk-io";

async function App() {
  const api = new API({
    token:
      "vk1.a.WTc6mTxBzu3CBdQoVbL-tKvvZLwAnxQXfFQwfosQ6rpuWdDu7V2dzLEUd6Z5y3Jx--LM7Ovm2sTD-YR6wbXdIGnz0fguHDQJWa0Z2qcrK91z7nkd37BTn_ARM1Zgqh_veR8vN2NngBArWoF-qL0h9OZvtDEI8Fbyy2b4-UcwpMOXKA4Amu19Z6Soxc0Ykrlrsd7iX4dXYS32GKkesDAm_A",
  });

  const user = await api.account.getProfileInfo();
  console.log(user);
}

App();
