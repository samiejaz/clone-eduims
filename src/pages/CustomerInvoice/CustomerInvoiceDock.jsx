import { Dock } from "primereact/dock";

const CustomerInvoiceDock = () => {
  const items = [
    {
      label: "Finder",
      icon: () => (
        <img
          alt="Finder"
          src="https://primefaces.org/cdn/primereact/images/dock/finder.svg"
          width="100%"
        />
      ),
    },
    {
      label: "App Store",
      icon: () => (
        <img
          alt="App Store"
          src="https://primefaces.org/cdn/primereact/images/dock/appstore.svg"
          width="100%"
        />
      ),
    },
    {
      label: "Photos",
      icon: () => (
        <img
          alt="Photos"
          src="https://primefaces.org/cdn/primereact/images/dock/photos.svg"
          width="100%"
        />
      ),
    },
    {
      label: "Trash",
      icon: () => (
        <img
          alt="trash"
          src="https://primefaces.org/cdn/primereact/images/dock/trash.png"
          width="100%"
        />
      ),
    },
  ];
  return <Dock model={items} position={"right"} />;
};

export default CustomerInvoiceDock;
