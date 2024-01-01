exports.handleResponse = (res, status, variant, msg, innerData, totalCount) => {
    res.status(status).json({
      variant,
      msg,
      innerData,
      totalCount,
    });
};