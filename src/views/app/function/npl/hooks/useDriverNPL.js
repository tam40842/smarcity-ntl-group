import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useDriverNPL = () => {
  const isLoadingDriver = ref(false)
  const listDriver = ref([])
  const objectKeylistDriver = ref(null)
  const errorListDriver = ref(null)

  const getListDriverActive = () => {
    isLoadingDriver.value = true;
    nplAPI.getDriverListActive().then(res => {
      listDriver.value = res.status ? customData(res.data) : []
      objectKeylistDriver.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingDriver.value = false;
    }).catch(err => {
      errorListDriver.value = err.message;
      isLoadingDriver.value = false;
    });
  }
  const customData = (arr) => {
    let result = []
    arr.map((e) => {
      let obj = {
        ...e,
        id: e.ID,
        label: e.nPLDriversName,
      }
      result.push(obj)
    })
    return result
  }

  return { listDriver, getListDriverActive };
}

export default useDriverNPL;
