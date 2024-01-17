exports.dateQuery = (query, defaultDayEgo=10)=>{
    if(!query.from || !query.to){
        let currentDay = new Date(); 
        currentDay.setDate(currentDay.getDate() + 2);
        currentDay.setHours(0, 0, 0, 0);
        let tenDaysAgo = new Date(); 
        tenDaysAgo.setDate(currentDay.getDate() - defaultDayEgo);
        tenDaysAgo.setHours(0,0,0,0)
        
        let defaultFrom = tenDaysAgo.toISOString()
        let defaultTo = currentDay.toISOString()
        return {createdAt: {$gte:defaultFrom, $lte:defaultTo}}
    }
    let fromDate = new Date(query.from);
    let toDate = new Date(query.to);
    toDate.setDate(toDate.getDate() + 1);
    
    let from = fromDate.toISOString();
    let to = toDate.toISOString();
    return from && to && {createdAt: {$gte:from, $lte:to}}
}