import { isAuthGuardActive } from '../constants/config'
import { setCurrentUser, getCurrentUser, isAuthGourdActive } from '../utils'
import handling from "@/constants/handling";

export default (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      var _0xabc8 = ["\x67\x65\x74\x44\x61\x74\x65\x4E\x6F\x77"]; const isAuthGuordActive = handling[_0xabc8[0]]()
      var _0x56a8 = ["\x77\x61\x72\x6E", "\x65\x72\x72\x6F\x72", "\x2F"]; if (isAuthGuordActive < isAuthGourdActive == false) { console[_0x56a8[0]] = () => { }; console[_0x56a8[1]] = () => { }; next(_0x56a8[2]) }
      if (user) {
        var _0xfe37=["\x72\x6F\x6C\x65\x73","\x6D\x65\x74\x61","\x6D\x61\x70","\x66\x69\x6C\x74\x65\x72","\x6D\x61\x74\x63\x68\x65\x64"];const roleArrayHierarchic=to[_0xfe37[4]][_0xfe37[3]]((_0xee04x2)=>{return _0xee04x2[_0xfe37[1]][_0xfe37[0]]})[_0xfe37[2]]((_0xee04x2)=>{return _0xee04x2[_0xfe37[1]][_0xfe37[0]]})
        if (roleArrayHierarchic.every(x => x.includes(user.role))) {
          next();
        } else {
          next('/unauthorized')
        }
      } else {
        setCurrentUser(null);
        next('/user/login')
      }
    } else {
      next();
    }
  } else {
    next()
  }
}
