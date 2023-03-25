import { ref, computed } from "vue";
import nplAPI from "@/api/modules/nplAPI";
import handling from "@/constants/handling";
import systemAPI from "@/api/modules/systemAPI";
import { useRoute } from "./useRoute.js";

const useCategorysNPL = (route) => {
  const objectKeyIncident = ref(null);
  const listColumnShowIncident = ref(null);
  const menuRight = ref(null);

  const getListTable = async (body, stateAPI) => {
    try {
      let { data, status } = await stateAPI(body);
      let result = status ? data : [];
      if (!result?.length > 0) return result;
      objectKeyIncident.value = Object.keys(result[0]);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getDataByID = async (body, stateAPI) => {
    try {
      let { data, status } = await stateAPI(body);
      let result = status ? data : [];
      if (!result?.length > 0) return result;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getColumn = async (body, stateAPI) => {
    try {
      let { data, status } = await stateAPI(body);
      let result = status ? data : [];
      listColumnShowIncident.value = data;
      return result;
    } catch (error) {
      console.log(err);
    }
  };

  const getListMenuRight = async () => {
    try {
      let body = {
        GroupID: JSON.parse(localStorage.getItem("user")).GroupID,
      };
      let { data, status } = await systemAPI.getMenus(body);
      let result = status ? data : [];
      menuRight.value = result;
    } catch (error) {
      console.log(err);
    }
  };

  const getListEntryID = async (body, stateAPI) => {
    try {
      let { data, status } = await stateAPI(body);
      let result = status ? data : [];
      if (!result?.length > 0) return result;
      return result;
    } catch (error) {
      console.log(err);
    }
  };

  const fieldIncidentRequestFinal = computed(() => {
    return handling.mergeKeyDynamic(
      objectKeyIncident.value,
      listColumnShowIncident.value
    );
  });

  const objectData = computed(() => {
    let obj = menuRight.value?.find(
      (item) => useRoute().fullPath === item.Link
    );
    if (!obj) return;
    return {
      menuIDCurrent: obj.MenuID.toString(),
      formName: obj.MenuName.toUpperCase(),
      accessWrite: handling.convertBitToBoolean(obj.AccessWrite),
    };
  });

  return {
    getListTable,
    getDataByID,
    getColumn,
    getListMenuRight,
    getListEntryID,
    fieldIncidentRequestFinal,
    objectData,
  };
};

export default useCategorysNPL;
