import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE ,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient,sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async(email, verificationToken) => {
    const recipients = [{ email}];

try {
    const response = await mailtrapClient.send({
    from :sender,
    to: recipients,
    subject: "Email Verification",
    html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
    category: "Email Verification",

});
console.log("Email sent successfully:", response);
}catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
}




};

export const sendWelcomeEmail = async(email, name) => {
    const recipients = [{ email}];

try {
    const response = await mailtrapClient.send({
    from :sender,
    to: recipients,
   template_uuid :"425e207d-81d3-443e-8980-aae242cf2c99",
   template_variables:{
    name: name,
    company_info_name: "authe company",
   },

});
console.log("Email sent successfully:", response);
}catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
}}

export const sendpasswordResetEmail = async(email, resetURL) => {
    const recipients = [{ email}];
    try {
        const response = await mailtrapClient.send({
            from :sender,
            to: recipients,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: "Forgot password Verification",
        });
        console.log("Password Reset Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}

export const sendResetSuccessEmail = async(email)=>{

 const recipients = [{ email}];
    try {
        const response = await mailtrapClient.send({
            from :sender,
            to: recipients,
            subject: "Reset Your Password Reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset password Verification",
        });
        console.log("Password Reset successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to reset password");
    }

}