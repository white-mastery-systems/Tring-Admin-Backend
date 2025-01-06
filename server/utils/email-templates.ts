export const resetPasswordEmailTemplate = (userDetails: any, token: string)  => {
  const data = `<!doctype html>
<html lang='en'>
  
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
  <title>TringAI</title>
  <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap' rel='stylesheet'>
</head>

<body style='margin:0px;padding:0;background-color:#f7f7f7;font-size:14px;'>
  <table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%'
    style='background-color:#f7f7f7;font-family: Poppins, sans-serif!important;font-size:14px;color:#3d3d3d;line-height:1.5;width:100%;min-width:100%;'>
    <tbody>
      <tr>
        <td align='center' valign='top'>
          <table border='0' cellpadding='0' cellspacing='0' width='700'
            style='width:700px;background-color:#ffffff;font-family: Poppins, sans-serif!important;'>
            <tbody>
              <tr>
                <td align='center' valign='top' width='100%'
                  style='width:100%;min-width:100%;background-color:#ffffff;font-family: Poppins, sans-serif!important;'>
                  <table cellpadding='0' border='0' cellspacing='0' width='100%'
                    style='width:100%;min-width:100%;padding:0 30px;'>
                    <tbody>
                      <tr>
                        <td align='center' valign='middle' width='100%' style='width:100%;min-width:100%'> <img
                            src='https://api.tringlabs.ai//uploads/logo_new_a1dbc2ee47.png'
                            alt='Demo Store'
                            style='vertical-align:middle;clear:both;width:auto !important;height:80px;padding-top:20px;padding-bottom:30px'>
                        </td>
                      </tr>
                      <tr>
                        <td align='center' valign='middle' style='padding:0'>
                          <img src="https://api.tringlabs.ai/uploads/password_img_3ae43d7df4.jpg" width="50%" height="5%x">
                          <h1
                            style='font-size:24px;font-weight:600;margin:0;text-align:center;padding-bottom: 30px;color: rgba(0, 0, 0, 0.7);font-family: Poppins, sans-serif!important;'>
                           Reset Password
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td align='left' valign='top' width='100%'
                          style='width:100%; min-width:100%; padding: 10px 10px 10px 20px; line-height: 1.9;'>
                          <div style="line-height: 15px;font-weight: 500;">Hi ${userDetails?.username},</div>
                        </td>
                      </tr>
                      <tr>
                        <td align='left' valign='top' width='100%'
                          style='width:100%; min-width:100%;padding:10px 10px 10px 20px;line-height: 1.9;'>
                          <p
                            style='font-size:14px;font-weight:500;color: rgba(0, 0, 0, 0.5);font-family: Poppins, sans-serif!important;'>
                            We received a request to reset the password for your Tring AI account. Click the button below to set a new password:
                         </p> 
                         <div style="margin-top: 0px;">
                          <a href="${process.env.ADMIN_BASE_URL}/auth/forgot-password?token=${token}" style="color: #fff!important;background-color:#ffbc42;border: 1px solid #ffbc42;border-radius: 10px!important; font-weight:700;display:inline-block;font-size:12px;line-height:1;padding:12px 16px;text-decoration:none;width:auto;white-space:nowrap;font-family: Poppins, sans-serif!important;" target="_blank">Reset password</a>
                        </div>                  
                        </td>
                      </tr>
                      <tr>
                        <td align='left' valign='top' width='100%'
                          style='width:100%; min-width:100%; padding: 10px 10px 10px 20px; line-height: 1.9;'>
                          
                            <p style='margin-bottom: 10px;margin-top: 0;font-size:14px;font-weight:500;color: rgba(0, 0, 0, 0.5);font-family: Poppins, sans-serif!important;'>                          
                              If you didn’t request a password reset, you can ignore this email. Your current password will remain secure.
                            </p>  
                            <p style="margin-bottom: 0px;font-size:14px;font-weight:500;color: rgba(0, 0, 0, 0.5);font-family: Poppins, sans-serif!important;">                           
                              For your security, this link will expire in 5 minutes and can only be used once.
                            </p>  
                                                
                        </td>
                      </tr>
                      <tr>
                        <td align='left' valign='top' width='100%'
                          style='width:100%; min-width:100%; padding: 0px 10px 10px 20px; line-height: 1.9;'>
                          <p
                            style='margin-top: 0px;margin-bottom: 0px;font-size:14px;font-weight:500;color: rgba(0, 0, 0, 0.5);font-family: Poppins, sans-serif!important;'>
                            If you need any assistance, feel free to contact our support team.
                          </p>              
                        </td>
                      </tr>
                      <tr>
                        <td align='left' valign='top' width='100%'
                        style='width:100%; min-width:100%; padding: 10px 10px 10px 20px; line-height: 1.9;'>
                          <p style="color: rgba(0, 0, 0, 0.5);font-weight: 500;">Best Regards,<br>Tring AI Team <br><a href="mailto:support@tringlabs.ai" style="text-decoration: none;color: #3d3d3d;">support@tringlabs.ai</a> | <a href="https://tringlabs.ai/" style="text-decoration: none;color: #3d3d3d;">tringlabs.ai</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td align='center' valign='top' width='100%'
                          style='width:100%; min-width:100%; padding: 10px 10px 10px 20px; line-height: 1.9;'>
                          <table border='0' cellspacing='0' cellpadding='0' align="center">
                            <tbody>
                              <tr>
                                <td align='center' valign='top' width='100%'>
                                 <div>
                                  <a href="https://www.facebook.com/people/Tring-AI/61552044366297/?mibextid=ZbWKwL" style="text-decoration: none;">
                                    <img src="https://www.yssentials.com/tringAi-mail/facebook.png" width="20px" height="20px">&nbsp;
                                  </a>
                                  <a href="https://www.instagram.com/tring.ai/" style="text-decoration: none;">
                                    <img src="https://www.yssentials.com/tringAi-mail/instagram.png" width="20px" height="20px">&nbsp;
                                  </a>
                                  <a href="https://www.linkedin.com/company/tring-ai/posts/?feedView=all" style="text-decoration: none;">
                                    <img src="https://www.yssentials.com/tringAi-mail/linkedin.png" width="20px" height="20px">&nbsp;
                                  </a>
                                 </div>
                                 
                                </td>
                              </tr>
                              <tr>
                                <td align='center' valign='top' width='100%' style='width:100%; min-width:100%; line-height: 1.9;padding-top: 10px;'>
                                  <p style="text-transform: uppercase;margin: 0;color: #3d3d3d">Unsubscribe&nbsp;|&nbsp;<a href="https://tringlabs.ai/privacy-policy/" style="text-decoration: none;color: #3d3d3d;">Privacy policy</a>&nbsp;|&nbsp;<a href="https://tringlabs.ai/contact-us/" style="text-decoration: none;color: #3d3d3d;">Contact Us</a></p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table border='0' cellpadding='0' cellspacing='0' width='500'
                    style='width:100%;min-width:100%;padding:0 30px 20px;'>
                    <tbody>
                      <tr>
                        <td colspan='4' align='left' valign='top' width='100%'
                          style='width:100%;min-width:100%;border-bottom:2px solid rgba(0, 0, 0, 0.1)'>
                          <p style='margin: 0px;'>&nbsp;</p>
                        </td>
                      </tr>
                      <tr>                       
                        <td align='center' style='width:76%;padding-top:20px'>
                          <p
                            style='font-size:12px;font-weight:500;margin:0;padding-top:10px;text-align:center;padding-bottom: 15px;color: rgba(0, 0, 0, 0.3);letter-spacing: 0.05em;font-family: Poppins, sans-serif!important;'>
                            ©<a
                              style='text-decoration: underline;color: rgba(0, 0, 0, 0.3)!important;font-weight:bold; text-decoration: none;font-family: Poppins, sans-serif!important;'
                              href='https://tringlabs.ai/' target='_blank'>Tring AI.</a> All Rights Reserved. </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`

return data
}