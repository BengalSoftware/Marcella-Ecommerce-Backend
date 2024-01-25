module.exports.filtersFunction = (filters) => {
    // sort, page, limit
    const excludeFields = [
        "sort",
        "page",
        "limit",
        "category",
        "size",
        "color",
    ];
    excludeFields.forEach((field) => delete filters[field]);
    // gt, lt, gte, lte
    let filterString = JSON.stringify(filters);
    filterString = filterString.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
    );
    filters = JSON.parse(filterString);
    return filters;
};
