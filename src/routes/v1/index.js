const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const addressRoute = require("./address.route");
const orderRoute = require("./order.route");
const orderReports = require("./orderReports.route");
const manufacturerRoute = require("./manufacturer.route");
const subcategoryRoute = require("./subcategory.route");
const subcategoryChildrenRoute = require("./subcategoryChildren.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const userGroupRoute = require("./userGroup.route");
const adminRoute = require("./admin.route");
const reviewRoute = require("./review.route");
const couponRoute = require("./coupon.route");
const mailRoute = require("./mail.route");
const shippingPriceRoute = require("./shippingPrice.route");

// pages routes
const blogs = require("./blogs.route");
const termsCondition = require("./terms&condition.route");
const privacyPolicy = require("./privacyPolicy.route");
const returnsPage = require("./returns.route");
const storeLocation = require("./storeLocation.route");
const deliveryInfo = require("./deliveryInfo.route");
const newsLetter = require("./newsLetter.route");
const faq = require("./faq.route");

// offer route
const newUserDiscountRoute = require("./newUserDiscount.route");

const wishList = require("./wishList.route");
const rules = require("./rules.route");
const flashSaleOffer = require("./flashSaleProductOffer.route");

// banner route
const desktopBanner = require("./desktopBanner.route");
const mobileBanner = require("./mobileBanner.route");
const sideBanner = require("./sideBanner.route");
const relatedBanner = require("./relatedBanner.route");
const bottomBanner = require("./bottomBanner.route");

//variants route
const size = require("./size.route");
const color = require("./color.route");
const footer = require("./footer.route");
const flashSaleTypes = require("./flashSaleTypes.route");
const sslRoutes = require("./sslcommerz.route");


//layout route
const layoutRoutes = require('./layout.route')

//-----
const router = require("express").Router();

const defaultRoutes = [
    {
        path: "/auth",
        handler: authRoute,
    },
    {
        path: "/user",
        handler: userRoute,
    },
    {
        path: "/address",
        handler: addressRoute,
    },
    {
        path: "/order",
        handler: orderRoute,
    },
    {
        path: "/report",
        handler: orderReports,
    },
    {
        path: "/subcategory",
        handler: subcategoryRoute,
    },
    {
        path: "/subcategory-children",
        handler: subcategoryChildrenRoute,
    },
    {
        path: "/category",
        handler: categoryRoute,
    },
    {
        path: "/manufacturer",
        handler: manufacturerRoute,
    },
    {
        path: "/product",
        handler: productRoute,
    },

    {
        path: "/cart",
        handler: cartRoute,
    },
    {
        path: "/wishList",
        handler: wishList,
    },
    {
        path: "/group",
        handler: userGroupRoute,
    },
    {
        path: "/admin",
        handler: adminRoute,
    },
    {
        path: "/coupon",
        handler: couponRoute,
    },
    {
        path: "/review",
        handler: reviewRoute,
    },
    {
        path: "/mail",
        handler: mailRoute,
    },
    {
        path: "/shippingPrice",
        handler: shippingPriceRoute,
    },
    {
        path: "/newUserDiscount",
        handler: newUserDiscountRoute,
    },

    {
        path: "/desktopBanner",
        handler: desktopBanner,
    },
    {
        path: "/mobileBanner",
        handler: mobileBanner,
    },
    {
        path: "/sideBanner",
        handler: sideBanner,
    },
    {
        path: "/relatedBanner",
        handler: relatedBanner,
    },
    {
        path: "/bottomBanner",
        handler: bottomBanner,
    },
    {
        path: "/blogs",
        handler: blogs,
    },
    {
        path: "/termsCondition",
        handler: termsCondition,
    },
    {
        path: "/privacy-policy",
        handler: privacyPolicy,
    },
    {
        path: "/return",
        handler: returnsPage,
    },
    {
        path: "/storeLocation",
        handler: storeLocation,
    },
    {
        path: "/deliveryInfo",
        handler: deliveryInfo,
    },
    {
        path: "/size",
        handler: size,
    },
    {
        path: "/color",
        handler: color,
    },
    {
        path: "/footer",
        handler: footer,
    },
    {
        path: "/rules",
        handler: rules,
    },
    {
        path: "/flashSale-types",
        handler: flashSaleTypes,
    },
    {
        path: "/flashSale-offer",
        handler: flashSaleOffer,
    },
    {
        path: "/newsletter",
        handler: newsLetter,
    },
    {
        path: "/faq",
        handler: faq,
    },
    {
        path: "/ssl",
        handler: sslRoutes,
    },
    {
        path: "/layout",
        handler: layoutRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.handler);
});

module.exports = router;
