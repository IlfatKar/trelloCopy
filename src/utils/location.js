export default {
  getId(){
    const paramsString = document.location.search;
    const searchParams = new URLSearchParams(paramsString);
    if(searchParams.has("id")){
     return searchParams.get("id")
    }
    return null
  },
  getUrl(){
    return document.location.origin
  },
  change(url){
    window.history.pushState('main', 'СУЗиП', url);
  },
}