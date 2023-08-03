export function checkLocationEnable(onSuccess, onError?) {
  if (typeof Zx !== "undefined") {
    Zx.checkGeoEnable()
    let callBack = function() {
      if (onSuccess) {
        onSuccess()
      }
      setTimeout(() => {
        document.removeEventListener("geo-success", callBack)
      }, 50)
    }
    document.addEventListener("geo-success", callBack)

    let errCallBack = function() {
      if (onError) {
        onError();
      }
      document.removeEventListener("geo-success", callBack)
      document.removeEventListener("geo-fail", errCallBack)
    }

    document.addEventListener("geo-fail", errCallBack)
  } else {
    if (onSuccess) {
      onSuccess()
    }
  }
}
