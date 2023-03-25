import { watchEffect, computed, ref } from 'vue';
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useFactors = () => {
  const errorFactors = ref('')
  const menuRights = ref([])

  const getMenuRights = () => {
    let body = {
      GroupID: JSON.parse(localStorage.getItem("user")).GroupID,
    };
    systemAPI.getMenus(body).then(res => {
      menuRights.value = res.status ? res.data : []
    }).catch(err => {
      errorFactors.value = err.message;
    });
  }

  return {  menuRights,errorFactors,getMenuRights };
}

export default useFactors;
