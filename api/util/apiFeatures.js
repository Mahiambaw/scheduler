class apiFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }
  filter() {
    let queryObj = { ...this.reqQuery };
    const queryExcluded = ["limit", "page"];
    console.log();

    queryExcluded.forEach((el) => delete queryObj[el]);

    if (queryObj.userId) {
      const arrUserId = queryObj.userId.trim().split(",");
      this.query = this.query.find({ userId: { $in: arrUserId } });
    } else {
      this.query = this.this.query.find(JSON.parse(queryStr));
    }

    return this;
  }
}
module.exports = apiFeatures;
