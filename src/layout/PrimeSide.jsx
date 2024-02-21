import { useState } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import Logo from "../images/logo.png";
import { BsList } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function BasicDemo() {
  const navigate = useNavigate();

  const itemsModel = [
    {
      label: "Customers",
      icon: "pi pi-fw pi-file",
      items: [
        {
          label: "Customer Entry",
          icon: "pi pi-fw pi-plus",
          // url: "/customers/customerEntry",
          command: () => navigate("/customers/customerEntry"),
        },
        {
          label: "Old Customer Entry",
          icon: "pi pi-fw pi-plus",
          url: "/customers/oldCustomerEntry",
        },
        {
          label: "Customer Branch",
          icon: "pi pi-fw pi-sort-amount-down",
          url: "/customers/customerBranch",
        },
        {
          label: "Business",
          items: [
            {
              label: "Business Segments",
              url: "/customers/businessSegment",
            },
            {
              label: "Business Nature",
              url: "/customers/businessNature",
            },
            {
              label: "Business Type",
              url: "/customers/businessType",
            },
          ],
        },
        {
          label: "Area",
          items: [
            {
              label: "Country",
              url: "/customers/countryEntry",
            },
            {
              label: "Province",
              url: "/customers/provinceEntry",
            },
            {
              label: "City",
              url: "/customers/cityEntry",
            },
          ],
        },
        {
          label: "Software/Products",
          url: "/customers/softwareEntry",
        },
      ],
    },
    {
      label: "Users",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "User Entry",
          icon: "pi pi-fw pi-user-plus",
          url: "/users/usersentry",
        },
        {
          label: "Department Entry",
          icon: "pi pi-fw pi-briefcase",
          url: "/users/departmentEntry",
        },
      ],
    },
    {
      label: "General",
      icon: "pi pi-fw pi-pencil",
      items: [
        {
          label: "Company Info",
          icon: "pi pi-fw pi-building",
          url: "/general/companyInfo",
        },
        {
          label: "Business Units",
          icon: "pi pi-fw pi-align-right",
          url: "/customers/businessUnits",
        },
        {
          label: "Session Info",
          icon: "pi pi-fw pi-align-center",
          url: "/customers/sessionInfo",
        },
        {
          label: "Bank Account Opening",
          icon: "pi pi-fw pi-align-justify",
          url: "/customers/bankAccountOpening",
        },
        {
          label: "Products",
          items: [
            {
              label: "Product Category",
              url: "/general/productCategories",
            },
            {
              label: "Product Info",
              url: "/general/productInfo",
            },
          ],
        },
        {
          label: "Services",
          items: [
            {
              label: "Service Category",
              url: "/general/serviceCategories",
            },
            {
              label: "Service Info",
              url: "/general/servicesInfo",
            },
          ],
        },
        {
          label: "Invoice",
          items: [
            {
              label: "Customer Invoice",
              url: "/customers/customerInvoice",
            },
            {
              label: "Invoice Descriptions",
              url: "/general/invoiceDescriptions",
            },
          ],
        },
      ],
    },
  ];

  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const handleSearch = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
    const filteredMenuItems = filterMenuItems(newSearchTerm, itemsModel);
    setFilteredItems(filteredMenuItems);
  };

  return (
    <>
      <div className="layout-topbar">
        <Sidebar
          visible={visible}
          onHide={() => setVisible(false)}
          header={
            <>
              <img src={Logo} alt="Logo" width={150} height={35} />
            </>
          }
        >
          <div className="card flex justify-content-center">
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.value);
                handleSearch(event);
              }}
              className="form-control"
              placeholder="Search for routes!"
            />
          </div>

          <div className="mt-2">
            <BasicDemoMenu model={filteredItems} />
          </div>
        </Sidebar>

        <Button onClick={() => setVisible(true)}>
          <BsList />
        </Button>

        <div className={classNames("layout-topbar-menu", {})}></div>
      </div>
    </>
  );
}

function BasicDemoMenu({ model }) {
  return (
    <>
      {model.length > 0 ? (
        <>
          <PanelMenu model={model} className="w-full md:w-25rem" />
        </>
      ) : (
        <>
          <h2 className="text-center mt-2">No results!</h2>
        </>
      )}
    </>
  );
}

function filterMenuItems(searchTerm, menuItems) {
  const filteredItems = [];
  menuItems.forEach((item) => {
    if (
      item?.label?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item?.url?.toLowerCase().includes(searchTerm?.toLowerCase())
    ) {
      filteredItems.push(item);
    } else if (item.items) {
      const childItems = filterMenuItems(searchTerm, item.items);
      if (childItems.length > 0) {
        const updatedItem = { ...item, items: childItems };
        filteredItems.push(updatedItem);
      }
    }
  });
  return filteredItems;
}
