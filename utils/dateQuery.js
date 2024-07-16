function toLocalISOString(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString();
}
exports.dateQuery = (query, defaultDayEgo=10)=>{
    if(!query.from || !query.to){
        // return null
        let currentDay = new Date(); 
        currentDay.setHours(0, 0, 0, 0);
        currentDay.setDate(currentDay.getDate() + 1);
        let daysAgo = new Date(); 
        daysAgo.setHours(0,0,0,0)
        daysAgo.setDate(daysAgo.getDate() - defaultDayEgo+1);
        
        let defaultFrom = toLocalISOString(daysAgo)
        let defaultTo = toLocalISOString(currentDay)
        return {createdAt: {$gte:defaultFrom, $lte:defaultTo}}
    }
    let fromDate = new Date(query.from);
    let toDate = new Date(query.to);
    toDate.setDate(toDate.getDate() + 1);
    
    let from = fromDate.toISOString();
    let to = toDate.toISOString();
    return from && to && {createdAt: {$gte:from, $lte:to}}
}
