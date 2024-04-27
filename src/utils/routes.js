import { MENU_KEYS, ROUTE_URLS } from "./enums"

export const routes = [
  {
    menuGroupName: "General",
    icon: "pi pi-home",
    menuGroupKey: MENU_KEYS.GENERAL.GROUP_KEY,
    subItems: [
      {
        name: "Country",
        menuKey: MENU_KEYS.GENERAL.COUNTRY_FORM_KEY,
        route: ROUTE_URLS.COUNTRY_ROUTE,
      },
      {
        name: "Tehsil",
        menuKey: MENU_KEYS.GENERAL.TEHSIL_FORM_KEY,
        route: ROUTE_URLS.TEHSIL_ROUTE,
      },
      {
        name: "Company Info",
        menuKey: MENU_KEYS.GENERAL.COMPANY_INFO_FORM_KEY,
        route: ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE,
        showDividerOnTop: true,
      },
      {
        name: "Business Unit",
        menuKey: MENU_KEYS.GENERAL.BUSINESS_UNIT_FORM_KEY,
        route: ROUTE_URLS.GENERAL.BUSINESS_UNITS,
      },
      {
        name: "Business Nature",
        menuKey: MENU_KEYS.GENERAL.BUSINESS_NATURE_FORM_KEY,
        route: ROUTE_URLS.BUSINESS_NATURE_ROUTE,
      },
      {
        name: "Business Type",
        menuKey: MENU_KEYS.GENERAL.BUSINESS_TYPE_FORM_KEY,
        route: ROUTE_URLS.BUSINESS_TYPE,
      },
      {
        name: "Business Segments",
        menuKey: MENU_KEYS.GENERAL.BUSINESS_SEGMENT_FORM_KEY,
        route: ROUTE_URLS.BUSINESS_SEGMENT_ROUTE,
      },
      {
        name: "Session Info",
        menuKey: MENU_KEYS.GENERAL.SESSION_INFO_FORM_KEY,
        route: ROUTE_URLS.GENERAL.SESSION_INFO,
        showDividerOnTop: true,
      },
    ],
  },
  {
    menuGroupName: "Users",
    icon: "pi pi-users",
    menuGroupKey: MENU_KEYS.USERS.GROUP_KEY,
    subItems: [
      {
        name: "Users",
        menuKey: MENU_KEYS.USERS.USERS_FORM_KEY,
        route: ROUTE_URLS.USER_ROUTE,
      },
      {
        name: "Departments",
        menuKey: MENU_KEYS.USERS.DEPARTMENTS_FORM_KEY,
        route: ROUTE_URLS.DEPARTMENT,
      },
      {
        name: "Customer Entry",
        menuKey: MENU_KEYS.USERS.CUSTOMERS_FORM_KEY,
        route: ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY,
        showDividerOnTop: true,
      },
      {
        name: "Old Customer Entry",
        menuKey: MENU_KEYS.USERS.OLD_CUSTOMERS_FORM_KEY,
        route: ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY,
      },
    ],
  },
  {
    menuGroupName: "Accounts",
    icon: "pi pi-dollar",
    menuGroupKey: MENU_KEYS.ACCOUNTS.GROUP_KEY,
    subItems: [
      {
        name: "Bank Account Opening",
        menuKey: MENU_KEYS.ACCOUNTS.BANK_ACCOUNTS_FORM_KEY,
        route: ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING,
      },
      {
        name: "Customer Invoice",
        menuKey: MENU_KEYS.ACCOUNTS.CUSTOMER_INVOICE_FORM_KEY,
        route: ROUTE_URLS.ACCOUNTS.NEW_CUSTOMER_INVOICE,
        showDividerOnTop: true,
      },
      {
        name: "Receipt Voucher",
        menuKey: MENU_KEYS.ACCOUNTS.RECIEPT_VOUCHER_FORM_KEY,
        route: ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE,
      },
      {
        name: "Debit Note",
        menuKey: MENU_KEYS.ACCOUNTS.DEBIT_NOTE_FORM_KEY,
        route: ROUTE_URLS.ACCOUNTS.DEBIT_NODE_ROUTE,
        showDividerOnTop: true,
      },
      {
        name: "Credit Note",
        menuKey: MENU_KEYS.ACCOUNTS.CREDIT_NOTE_FORM_KEY,
        route: ROUTE_URLS.ACCOUNTS.CREDIT_NODE_ROUTE,
      },
    ],
  },

  {
    menuGroupName: "Utilities",
    icon: "pi pi-cog",
    menuGroupKey: MENU_KEYS.UTILITIES.GROUP_KEY,
    subItems: [
      {
        name: "App Configuration",
        menuKey: MENU_KEYS.UTILITIES.APP_CONFIGURATION_FORM_KEY,
        route: ROUTE_URLS.GENERAL.APP_CONFIGURATION_ROUTE,
      },
      {
        name: "Product Category",
        menuKey: MENU_KEYS.UTILITIES.PRODUCT_CATEGORIES_FORM_KEY,
        route: ROUTE_URLS.UTILITIES.PRODUCT_CATEGORY_ROUTE,
      },
      {
        name: "Product Info",
        menuKey: MENU_KEYS.UTILITIES.PRODUCT_INFO_FORM_KEY,
        route: ROUTE_URLS.UTILITIES.PRODUCT_INFO_ROUTE,
      },
      {
        name: "User Rights",
        menuKey: MENU_KEYS.CONFIGURATION.USER_RIGHTS_ROUTE,
        route: ROUTE_URLS.CONFIGURATION.USER_RIGHTS_ROUTE,
      },
    ],
  },
  {
    menuGroupName: "Leads",
    icon: "pi pi-phone",
    menuGroupKey: MENU_KEYS.LEADS.GROUP_KEY,
    subItems: [
      {
        name: "Leads Introduction",
        menuKey: MENU_KEYS.LEADS.LEAD_INTRODUCTION_FORM_KEY,
        route: ROUTE_URLS.LEAD_INTRODUCTION_ROUTE,
      },
      {
        name: "Leads Source",
        menuKey: MENU_KEYS.LEADS.LEAD_SOURCE_FORM_KEY,
        route: ROUTE_URLS.LEED_SOURCE_ROUTE,
      },
    ],
  },
]

export const routesWithUserRights = routes.map((route) => {
  const updatedRoute = { ...route }

  updatedRoute.subItems = route.subItems.map((subItem) => ({
    ...subItem,
    RoleNew: true,
    RoleEdit: true,
    RoleDelete: true,
    RolePrint: true,
    ShowForm: true,
  }))

  return updatedRoute
})

// Authorized Routes
export let authorizedRoutes = ["allowAll"]

// Filtering Routes
const filteredRoutes = routes.map((route) => {
  if (authorizedRoutes[0] === "allowAll") {
    return { ...route }
  } else {
    const filteredSubItems = route.subItems.filter((subItem) => {
      return authorizedRoutes.includes(subItem.menuKey)
    })
    if (filteredSubItems.length > 0) {
      return { ...route, subItems: filteredSubItems }
    }
  }
})

export const finalFilteredRoutes = filteredRoutes.filter(
  (route) => route !== undefined
)

// Check For User Rights
export function checkForUserRights({
  RoleDelete = true,
  RoleEdit = true,
  RoleNew = true,
  RolePrint = true,
  MenuName,
}) {
  const ShowForm =
    MenuName && authorizedRoutes[0] === "allowAll"
      ? true
      : authorizedRoutes.includes(MenuName)

  return [
    {
      RoleDelete,
      RoleEdit,
      RoleNew,
      RolePrint,
      ShowForm,
    },
  ]
}

export const initRoutesWithUserRights = (routes) => {
  const userRights = []

  if (userRights?.length > 0) {
    return userRights
  } else {
    const updatedRoutes = routes?.map((route) => {
      const updatedRoute = { ...route, AllowAllRoles: true }

      updatedRoute.subItems = route?.subItems.map((subItem) => ({
        ...subItem,
        RoleNew: true,
        RoleEdit: true,
        RoleDelete: true,
        RolePrint: true,
        ShowForm: true,
      }))

      return updatedRoute
    })
    return updatedRoutes
  }
}

export const initAuthorizedMenus = (allForms, areRoleAvailables = false) => {
  const menuGroupIcons = {
    Users: "pi pi-users",
    Accounts: "pi pi-dollar",
    General: "pi pi-home",
    Utilities: "pi pi-cog",
    Leads: "pi pi-phone",
  }

  const groupedForms = allForms.reduce((acc, form) => {
    if (!acc[form.menuGroupName]) {
      acc[form.menuGroupName] = []
    }
    acc[form.menuGroupName].push(form)
    return acc
  }, {})

  let transformedRoutes
  if (areRoleAvailables) {
    transformedRoutes = Object.entries(groupedForms).map(
      ([menuGroupName, forms]) => {
        const hideMenuGroup = forms.every((form) => form.ShowForm === "False")
        return {
          menuGroupName,
          icon: menuGroupIcons[menuGroupName] || "pi pi-question",
          menuGroupKey: forms[0].menuGroupKey,
          subItems: forms.map((form) => ({
            name: form.menuName,
            menuKey: form.menuKey,
            RoleNew: form.RoleNew === "True",
            RoleEdit: form.RoleEdit === "True",
            RoleDelete: form.RoleDelete === "True",
            RolePrint: form.RolePrint === "True",
            ShowForm: form.ShowForm === "True",
          })),
          hideMenuGroup,
          AllowAllRoles: forms.some((form) => form.ShowForm === "True"),
        }
      }
    )
  } else {
    transformedRoutes = Object.entries(groupedForms).map(
      ([menuGroupName, forms]) => {
        const hideMenuGroup = forms.every((form) => !form.ShowForm)
        return {
          menuGroupName,
          icon: menuGroupIcons[menuGroupName] || "pi pi-question",
          menuGroupKey: forms[0].menuGroupKey,
          subItems: forms.map((form) => ({
            name: form.menuName,
            menuKey: form.menuKey,
            route: form.routeUrl,
          })),
          hideMenuGroup,
          AllowAllRoles: forms.some((form) => form.ShowForm === true),
        }
      }
    )
  }
  return transformedRoutes
}
// Unused
export function convertToSingleRoutesWithUserRights(routes) {
  let originalForms = []
  routes.forEach((group) => {
    group.subItems.forEach((subItem) => {
      originalForms.push({
        MenuKey: subItem.menuKey,
        RoleEdit: subItem.RoleEdit,
        RoleNew: subItem.RoleNew,
        RoleDelete: subItem.RoleDelete,
        ShowForm: subItem.ShowForm,
        RolePrint: subItem.RolePrint,
      })
    })
  })
  return originalForms
}

export function convertRouteGroupsToSingleRoutes(routes) {
  let originalForms = []
  let i = 0
  routes.forEach((group) => {
    group.subItems.forEach((subItem, index) => {
      originalForms.push({
        MenuOrderID: i++,
        MenuName: subItem.name,
        MenuKey: subItem.menuKey,
        MenuRoute: subItem.route,
        ParentMenuKey: group.menuGroupKey,
        ParentMenuName: group.menuGroupName,
      })
    })
  })
  return originalForms
}

export const initAuthorizedRoutesWithUserRights = (
  routes,
  areRolesAvailable
) => {
  if (areRolesAvailable) {
    const updatedRoutes = routes.map((route) => {
      const updatedRoute = { ...route, AllowAllRoles: true }

      updatedRoute.subItems = route.subItems.map((subItem) => ({
        ...subItem,
      }))

      return updatedRoute
    })
    return updatedRoutes
  } else {
    const updatedRoutes = routes.map((route) => {
      const updatedRoute = { ...route, AllowAllRoles: true }

      updatedRoute.subItems = route.subItems.map((subItem) => ({
        ...subItem,
        RoleNew: true,
        RoleEdit: true,
        RoleDelete: true,
        RolePrint: true,
        ShowForm: true,
      }))

      return updatedRoute
    })
    return updatedRoutes
  }
}

// Function
