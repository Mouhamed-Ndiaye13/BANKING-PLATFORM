import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
  rootPath: "/admin",
  resources: [
    { resource: User },
    { resource: Transaction },
    { resource: Account },
  ],
  branding: {
    companyName: "Bank Admin Dashboard",
    logo: false,
  },
});
