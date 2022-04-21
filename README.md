# Intelica Odoo XMLRPC API

Utility wrappers to interact with Odoo instance. Allow to handle defined Odoo data models without the requeriments to know the whole protocol.

[![Version npm](https://img.shields.io/npm/v/@intelica/odoo-xmlrpc.svg?style=flat-square)](https://www.npmjs.com/package/@intelica/odoo-xmlrpc)[![npm Downloads](https://img.shields.io/npm/dm/@intelica/odoo-xmlrpc.svg?style=flat-square)](https://npmcharts.com/compare/@intelica/odoo-xmlrpc?minimal=true)

[![NPM](https://nodei.co/npm/@intelica/odoo-xmlrpc.png?downloads=true&downloadRank=true)](https://nodei.co/npm/@intelica/odoo-xmlrpc/)

## Installation

```bash
npm install @intelica/odoo-xmlrpc
```

## Supported data models

Currently the package support for three base models: **Contacts** (`res.partner`), **Employees** (`hr.employee`) and **Leads/Opportunities** (`crm.lead`). Also the XMLRPC protocol can be used as RAW data to interact with other data models. In this case for each supported data model there are a reduced subset of fields handled

For `Contacts` the data model interface is defined as

```js
interface IContact {
  name?: string;
  phone?: string;
  email?: string;
  ref?: string;
  category_id?: any[];
}
```

For `Employees` the data model interface is defined as

```js
interface IEmployee {
  department_id?: number;
  name?: string;
  work_email?: string;
  work_phone?: string;
  category_ids?: any[];
}
```

And for `Leads` the data model interface is defined as

```js
interface ILead {
  name?: string;
  partner_id?: number;
  contact_name?: string;
  email_from?: string;
  phone?: string;
  description?: string;
  source_id?: number;
  user_id?: number;
  team_id?: number;
  tag_ids?: number[];
  type?: "lead" | "opportunity";
}
```

## Odoo connection initialization

To establish a connection with the Odoo server you must provide the server address, database name and the credentials to connect to the server. Credentials can be used with user password or used with user access key.

```js
const server = new Odoo("sample-odoo.server.com");
```

To check the Odoo server connection can use the public action to get the server version

```js
server
  .version()
  .then((value: IServerVersion) => {
    console.log("Running server version: " + value.server_version);
  })
  .catch((err) => {
    console.error("There were some errors connecting to Odoo Server");
    console.error(err);
  });
```

## Authenticate against Odoo Server

To authenticate with the Odoo server and interact with the protected data model you must provide ther user credentials. You must take into account that credentials used must have permissions to interact with the data models.

Once you have configured the Odoo server can authenticate the user account on the configured server:

```js
server
  .authenticate("my-database", "my-user@mail.com", "my-password or access-key")
  .then(() => {
    console.log("We are ready to interact with Odoo data models");
  })
  .catch((err) => {
    console.error("There were some errors authenticating against the Odoo Server");
    console.error(err);
  });
```

Once the user is authenticated the server controller will store the required parameters (such as: user id, database and password or access key) to perform calls on the data models.

## CRUD operations on Odoo data models

To interact with Odoo data models there is the `OdooCRUD` class that implements the RAW basic operations over a generic data model.

```js
class OdooCRUD<T> {
  constructor(model: string, odoo: Odoo, keys: string[] = []);
  public count(): Promise<number>;
  public create(value: T): Promise<number>;
  public searchRead(query: any[], limit = 10): Promise<T[]>;
  public read(ids: number[]): Promise<T[]>;
  public update(id: number, data: T): Promise<boolean>;
  public delete(id: number): Promise<boolean>;
}
```

This class implements basic XMLRPC operations defined in the Odoo documentation. This class can be used to interact with any Odoo data model but in this case you must handle model and fields values, also the query filters.

To interact with defined data models whe can ask to the server controller for the specific class.

```js
const contacts = server.getModelActions(MODEL_TYPE.CONTACTS);
...
const leads = server.getModelActions(MODEL_TYPE.LEAD_OPPORTUNITY);
...
const employees = server.getModelActions(MODEL_TYPE.EMPLOYEES);
```

This classes extends from `OdooCRUD` to allow more dinamic methods and filters such as search inside data models using email address or phone number without knowledge of writing the XMLRPC domain filters. In some case it also prevent to handle manually the insertion on `many2many` relationships, such as contact tags.

## Future work

In middle-long term we pretend to have covered the most part of Odoo data models to allow interact with Odoo without the knowledge of the internal structure.

If you want to collaborate with the project, you are welcome.

---

## Enjoy it! .: Happy Coding :.
