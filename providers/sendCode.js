module.export = async function(options){
    try {
        await sendEmail({
          email: options.email,
          subject: "Password reset request received",
          message: options.message
        });
        res.status(200).send({
          status: 'success',
          message: "Password reset link sent to the email address"
        });
      } catch (error) {
        account.passwordResetToken = undefined;
        account.passwordResetTokenExpires = undefined;
        account.save();
        // error = new CustomError("Password reset email not sent, Pls try again later", 500);
        errorHandler(error, req,res);
      }
}