exports.timeZone = (gmt=5) => {
    const date = new Date();
    const gmtPlus5Time = new Date(date.getTime() + (gmt * 60 * 60 * 1000));
    return gmtPlus5Time.toISOString();
}