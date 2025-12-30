import Contact from "../models/Contact.js";

/* GET mes contacts */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération contacts" });
  }
};

/* POST ajouter un contact */
export const createContact = async (req, res) => {
  const { name, email, iban } = req.body;

  if (!name || !iban) {
    return res.status(400).json({ message: "Nom et IBAN requis" });
  }

  const contact = await Contact.create({
    user: req.user.id,
    name,
    email,
    iban,
  });

  res.status(201).json(contact);
};
