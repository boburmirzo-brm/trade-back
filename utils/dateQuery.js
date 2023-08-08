exports.dateQuery = (q)=>{
    if(!q.from || !q.to){
        return null
    }
    let [year, month, day] = q.to.split("-")
    let toNextDay = `${year}-${month}-${(+day + 1).toString().padStart(2, "0")}`
    let from = new Date(q.from).toISOString()
    let to = new Date(toNextDay).toISOString()
    return from && to && {createdAt: {$gte:from, $lte:to}}
}