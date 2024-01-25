module.exports.makeActiveOfferObject = (offer) => {
    const offerObject = {
        discount: offer.discount,
        discountType: offer.discountType,
        status: "active",
        offerType: offer.name,
        offerName: offer.name,
        startDate: offer.startDate,
        endDate: offer.endDate,
        timeStamps: offer.timeStamps,
    };
    return offerObject;
};
module.exports.makeInActiveOfferObject = (offer) => {
    const offerObject = {
        discount: offer.discount,
        discountType: offer.discountType,
        status: "in-active",
        offerType: offer.name,
        offerName: offer.name,
        startDate: offer.startDate,
        endDate: offer.endDate,
        timeStamps: offer.timeStamps,
    };
    return offerObject;
};
module.exports.makeUpdateOfferObject = (offer) => {
    const offerObject = {
        offerId: offer._id,
        discount: offer.discount,
        discountType: offer.discountType,
        status: offer.status,
        offerType: offer.name,
        offerName: offer.name,
        startDate: offer.startDate,
        endDate: offer.endDate,
        timeStamps: offer.timeStamps,
    };
    return offerObject;
};
