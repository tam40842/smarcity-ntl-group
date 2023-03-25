import { ref } from "vue";
import nplAPI from "@/api/modules/nplAPI";

const useCategorysNPL = () => {
  const listItemUnit = ref([])
  const listOrderType = ref([])
  const listItem = ref([])

  // Loại container || rời , xuất, nhập
  const getListOrderType = () => {
    let body = {
      CategoryType: 'OrderTypes'
    }
    nplAPI.getCategoryActive(body).then(res => {
      listOrderType.value = res.status ?  returnOrderTypeAll(res.data) : []
    }).catch(err => console.log(err))
  }
  const returnOrderTypeAll = (arr) => {
    const result = []
    arr.forEach(e => {
      let obj = {
        ...e,
        id: e.ID,
        lemonID: e.LemonID,
        label: e.OrderTypesName,
        isActive: e.IsActive
      }
      result.push(obj)
    });
    return result
  }

  // Loại mặt hàng || thép, ván, thạch,..
  const getListItem = () => {
    let body = {
      CategoryType: 'GoodsTypes' 
    }
    nplAPI.getCategoryActive(body).then(res => {
      listItem.value = res.status ?  returnListItemAll(res.data) : []
    }).catch(err => console.log(err))
  }

  const getListItemUnits = () => {
    let body = {
      CategoryType: 'nPLUnits' 
    }
    nplAPI.getCategoryActive(body).then(res => {
      listItemUnit.value = res.status ?  returnListItemUnitAll(res.data) : []
    }).catch(err => console.log(err))
  }

  const returnListItemUnitAll = (arr) => {
    const result = []
    arr.forEach(e => {
      let obj = {
        ...e,
        id: e.ID,
        lemonID: e.LemonID,
        label: e.nPLUnitsName,
        isActive: e.IsActive,
        note:e.Note,
      }
      result.push(obj)
    });
    return result
  }

  const returnListItemAll = (arr) => {
    const result = []
    arr.forEach(e => {
      let obj = {
        ...e,
        id: e.ID,
        lemonID: e.LemonID,
        label: e.GoodsTypesName,
        isActive: e.IsActive,
        note:e.Note,
        quantity:e.OverloadQuantity,
        weight:e.OverloadWeight,
        quantityUnit:e.QuantityUnitName,
        weightUnit:e.WeightUnitName
      }
      result.push(obj)
    });
    return result
  }

  return { listItemUnit,getListItemUnits,listOrderType,listItem, getListOrderType,getListItem };
}

export default useCategorysNPL;
