function getDate() {
    let myDate = new Date()
    let myTime = myDate.toLocaleTimeString()
    let date = myDate.toLocaleDateString()
    return `${date} ${myTime}`
 }

 export default{
     getDate
 }