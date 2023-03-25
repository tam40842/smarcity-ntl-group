import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useAttachFiles = () => {
  const isLoadingStatus = ref(false)
  const optionStatus = ref([])
  const objectKeyListStatus = ref(null)
  const errorListListStatus = ref(null)

  const getStatusByKey = (body) => {
    isLoadingStatus.value = true;
    nplAPI.getStatusByKey(body).then(res => {
      optionStatus.value = res.status ? res.data : []
      objectKeyListStatus.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingStatus.value = false;
    }).catch(err => {
      errorListListStatus.value = err.message;
      isLoadingStatus.value = false;
    });
  }

  return { optionStatus,getStatusByKey };
}

export default useAttachFiles;
