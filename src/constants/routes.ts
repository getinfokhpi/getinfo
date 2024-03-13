const routes = {
    MAIN: "/",
    REQUEST_DIRECTIONS: "/request-directions",
    REQUEST_PROCESSING: "/request-processing",
    CATEGORIES: "/admin/categories",
    CREATE_CATEGORY: "/admin/categories/create",
    EDIT_CATEGORY: (id: string | number) => `/admin/categories/${id}/edit`,
    FAQ_LIST: "/admin/faq",
    CREATE_FAQ: "/admin/faq/create",
    EDIT_FAQ: (id: string | number) => `/admin/faq/${id}/edit`,
    ABOUT_US: "/about-us",
    INFORMATION: "/faq",
};

export default routes;
