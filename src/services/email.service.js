const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
const fs = require("fs");
const handlebars = require("handlebars");
const { promisify } = require("util");
// const path = require("path");
const config = require("../config");
const logger = require("../config/logger");

const readFile = promisify(fs.readFile);
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "local") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  transport.use("compile", inlineBase64());
  const msg = { from: config.email.from, to, subject, text, html };
  try {
    //await transport.sendMail(msg);
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const newContacts = async (to, emailData) => {
  const subject = "Pingya-New Contact Added";
  const bodyData = "<h3>The following changes were made in Pingya</h3>";

  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;

  const text = "This is  my request";
  const html = await readFile("./src/emailpage/newEmailTemplate1.hbs", "utf8");
  const template = handlebars.compile(html, { strict: true });
  const userNameOfEmail = emailData.email.split("@")[0];
  const adminData = {
    body: bodyData,
    heading: "<h4><b>A new user was added</b></h4>",
    table: `<table>							
    <colgroup>
      <col span="1" style="background-color:#9ACAD6;">
    </colgroup>
    <tbody>
    <tr>
        <th style="width:100px">User Name</th>
           <td style="width:500px">
              <b>${userNameOfEmail || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">First Name</th>
           <td style="width:500px">
              <b>${emailData.firstName || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Last Name</th>
           <td style="width:500px">
              <b>${emailData.lastName || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Title</th>
           <td style="width:500px">
              <b>${emailData.title || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Specialty</th>
           <td style="width:500px">
              <b>${emailData.specialty || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Mobile</th>
           <td style="width:500px">
              <b>${emailData.mobileNumber || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Office Number</th>
           <td style="width:500px">
              <b>${emailData.officePhone || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Pager</th>
           <td style="width:500px">
              <b>${emailData.pager || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Fax</th>
           <td style="width:500px">
              <b>${emailData.fax || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Email</th>
           <td style="width:500px">
              <b>${emailData.email || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Notes</th>
           <td style="width:500px">
              <b>${emailData.notes || "NIL"}</b>
           </td>
      </tr>
    </tbody>
  </table>`,
  };
  const result = template(adminData);
  await sendEmail(to, subject, text, result);
};

const createContacts = async (to, emailData, user) => {
  const subject = "Pingya-Contact Created";
  const bodyData = "<h3>The following changes were made in Pingya</h3>";

  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;

  const text = "This is  my request";
  const html = await readFile("./src/emailpage/newEmailTemplate1.hbs", "utf8");
  const template = handlebars.compile(html, { strict: true });
  // for (const property in emailData) {
  //   console.log(`${property}: ${emailData[property]}`);
  // }
  //   delete emailData.isActive;
  //   delete emailData.isdeleted;
  //   delete emailData.isdeleted;
  //   delete emailData.updatedAt;
  //   delete emailData.__v;
  // Object.keys(emailData).map((key, index) => {
  //   console.log(key, emailData[key]);
  // });
  // let updatedData = await Object.keys(emailData).map((key, index) => {
  //   return `<tr>
  //     <th style="width:100px">${key}</th>
  //     <td style="width:500px">
  //       <b>${emailData[key]}</b>
  //     </td>
  //   </tr>`;
  // });

  // console.log(updatedData);
  // updatedData = await updatedData.toString().replaceAll(",", "");
  //let username = user.lastName + ", " + user.firstName;
  const adminData = {
    body: bodyData,
    heading: "<h4><b>A new contact was created</b></h4>",
    table: `<table>							
              <colgroup>
                <col span="1" style="background-color:#9ACAD6;">
              </colgroup>
              <tbody>
                <tr>
                  <th style="width:100px">First Name</th>
                     <td style="width:500px">
                        <b>${emailData.firstName || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Last Name</th>
                     <td style="width:500px">
                        <b>${emailData.lastName || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Title</th>
                     <td style="width:500px">
                        <b>${emailData.title || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Specialty</th>
                     <td style="width:500px">
                        <b>${emailData.specialty || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Mobile</th>
                     <td style="width:500px">
                        <b>${emailData.mobileNumber || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Office Number</th>
                     <td style="width:500px">
                        <b>${emailData.officePhone || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Pager</th>
                     <td style="width:500px">
                        <b>${emailData.pager || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Fax</th>
                     <td style="width:500px">
                        <b>${emailData.fax || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Email</th>
                     <td style="width:500px">
                        <b>${emailData.email || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Notes</th>
                     <td style="width:500px">
                        <b>${emailData.notes || "NIL"}</b>
                     </td>
                </tr>
                <tr>
                  <th style="width:100px">Created By</th>
                  <td style="width:500px">
                    ${username || "NIL"}
                  </td>
                </tr>
              </tbody>
            </table>`,
  };
  // <tr>
  //   <th style="width:100px">Email</th>
  //   <td style="width:500px"><b>${emailData.email}</b></td>
  // </tr>
  // <tr>
  //   <th style="width:100px">Created On</th>
  //   <td style="width:500px"><b>${emailData.createdAt}</b></td>
  // </tr>
  // console.log(adminData.table)
  const result = template(adminData);
  await sendEmail(to, subject, text, result);
};

const updateContacts = async (to, emailData, userData) => {
  const subject = "Pingya-Contact Updated";
  const bodyData = "<h3>The following changes were made in Pingya</h3>";

  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;

  const text = "This is  my request";
  const html = await readFile("./src/emailpage/newEmailTemplate1.hbs", "utf8");
  const template = handlebars.compile(html, { strict: true });
  // for (const property in emailData) {
  //   console.log(`${property}: ${emailData[property]}`);
  // }

  delete emailData.isActive;
  delete emailData.role;
  delete emailData.isAdmin;
  delete emailData.isDeleted;
  delete emailData.updatedAt;
  delete emailData.updatedBy;
  delete emailData.isLoggedIn;
  delete emailData.pcp;
  delete userData.role;
  delete userData.isActive;
  delete userData.isDeleted;
  delete userData.isAdmin;
  delete userData.createdAt;
  delete userData.updatedAt;
  delete userData.updatedBy;
  delete userData._id;
  delete userData.__v;
  delete userData.isLoggedIn;
  delete userData.pcp;
  //   // Object.keys(emailData).map((key, index) => {
  //   //   console.log(key, emailData[key]);
  //   // });
  console.log(userData, "user");
  console.log(emailData, "email");
  Object.keys(emailData).map((key, index) => {
    let flag = 0;
    Object.keys(userData).map((key1) => {
      if (
        key.localeCompare(key1) === 0 &&
        userData[key1].localeCompare(emailData[key]) === 0
      ) {
        console.log(
          userData[key1],
          emailData[key],
          userData[key1].localeCompare(emailData[key]),
          "matched"
        );
        flag = 1;
      } else {
        if (
          key.localeCompare(key1) === 0 &&
          userData[key1].localeCompare(emailData[key]) !== 0
        ) {
          flag = 0;
        }
      }
    });
    if (flag !== 1) {
      console.log(emailData[key], key);
      emailData[key] = `<b>${emailData[key]}</b>`;
    }
    //  console.log(key, userData._doc[key], "matched");
  });

  // let updatedData = await Object.keys(emailData).map((key, index) => {
  //   if (key)
  //     return `<tr>
  //     <th style="width:100px">${key}</th>
  //     <td style="width:500px">
  //       <b>${emailData[key]}</b>
  //     </td>
  //   </tr>`;
  // });

  // console.log(updatedData, "1");
  // console.log(updatedData.toString());
  // updatedData = await updatedData.toString().replaceAll(",", "");

  //let username = user.lastName + ", " + user.firstName;
  //   let dummy = "praveen";
  //   let updatedLastName = `<b>${dummy}</b>`;
  const adminData = {
    body: bodyData,
    heading: "<h4><b>A contact was updated</b></h4>",
    table: `<table>							
    <colgroup>
      <col span="1" style="background-color:#9ACAD6;">
    </colgroup>
    <tbody>
      <tr>
        <th style="width:100px">First Name</th>
           <td style="width:500px">
              <b>${emailData.firstName || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Last Name</th>
           <td style="width:500px">
              ${emailData.lastName || "NIL"}
           </td>
      </tr>
      <tr>
        <th style="width:100px">Title</th>
           <td style="width:500px">
              <b>${emailData.title || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Specialty</th>
           <td style="width:500px">
              <b>${emailData.specialty || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Mobile</th>
           <td style="width:500px">
              <b>${emailData.mobileNumber || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Office Number</th>
           <td style="width:500px">
              <b>${emailData.officePhone || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Pager</th>
           <td style="width:500px">
              <b>${emailData.pager || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Fax</th>
           <td style="width:500px">
              <b>${emailData.fax || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Email</th>
           <td style="width:500px">
              <b>${emailData.email || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Notes</th>
           <td style="width:500px">
              <b>${emailData.notes || "NIL"}</b>
           </td>
      </tr>
      <tr>
        <th style="width:100px">Updated By</th>
           <td style="width:500px">
              
           </td>
      </tr>
    </tbody>
  </table>`,
  };
  // <tr>
  //   <th style="width:100px">Email</th>
  //   <td style="width:500px"><b>${emailData.email}</b></td>
  // </tr>
  // <tr>
  //   <th style="width:100px">Created On</th>
  //   <td style="width:500px"><b>${emailData.createdAt}</b></td>
  // </tr>
  // console.log(adminData.table)
  const result = template(adminData);
  //await sendEmail(to, subject, text, result);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  newContacts,
  createContacts,
  updateContacts,
};
