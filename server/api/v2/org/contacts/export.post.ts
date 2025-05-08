import { defineEventHandler, setResponseHeader } from "h3";
import XLSX from "xlsx";

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event);
  const contacts = await exportContacts(organizationId);

  const worksheet = XLSX.utils.json_to_sheet(contacts, {
    header: ["name", "countryCode", "phoneNumber", "email"],
  });
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Name", "Country Code", "Phone Number", "Email"]],
    { origin: "A1" },
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  setResponseHeader(event, "Access-Control-Allow-Origin", "*");
  setResponseHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS",
  );
  setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type");

  return buffer;
});
