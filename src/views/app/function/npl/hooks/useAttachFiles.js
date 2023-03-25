import { watchEffect, computed, ref, onBeforeMount } from 'vue';
import nplAPI from "@/api/modules/nplAPI";
import systemAPI from "@/api/modules/systemAPI";
import handling from "@/constants/handling";

const useAttachFiles = () => {
  const isLoadingAttachFiles = ref(false)
  const listAttachFile = ref([])
  const objectKeyListAttachFile = ref(null)
  const errorListAttachFile = ref(null)

  const getListAttachFile = (body) => {
    isLoadingAttachFiles.value = true;
    nplAPI.getAttachFile(body).then(res => {
      listAttachFile.value = res.status ? res.data : []
      objectKeyListAttachFile.value = res.status && res.data.length > 0 ? Object.keys(res.data[0]) : null;
      isLoadingAttachFiles.value = false;
    }).catch(err => {
      errorListAttachFile.value = err.message;
      isLoadingAttachFiles.value = false;
    });
  }

  const addAttachFile = async (body) => {
    let result = await nplAPI.addAttachFile(body)
    return result
  }

  const editAttachFile = async (body) => {
    let result = await nplAPI.editAttachFile(body)
    return result
  }

  const deleteAttachFile = async (body) => {
    let result = await nplAPI.deleteAttachFile(body)
    return result
  }

  return { listAttachFile, getListAttachFile, addAttachFile, editAttachFile, deleteAttachFile };
}

export default useAttachFiles;
