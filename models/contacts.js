const fs = require("fs/promises");

const { nanoid } = require("nanoid");

const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const rez = contacts.filter(({ id }) => id === contactId);
  if (rez.length === 0) {
    return null;
  } else {
    return rez;
  }
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const deletedContact = contacts.find(({ id }) => id === contactId);
  if (deletedContact === undefined) {
    return null;
  } else {
    const rez = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(rez, null, 2));
    return deletedContact;
  }
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const indx = contacts.findIndex((contact) => contact.id === id);
  if (indx === -1) {
    return null;
  }
  contacts[indx] = {
    id,
    ...contacts[indx],
    ...body,
  };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[indx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
