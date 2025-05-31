export const chatbotScriptEmailTemplate = (adminDetails: any, orgDetails: any, chatbotName: string, script: string) => {
  const formattedScript = script
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
  <body>
    <p>Hello,</p>
    <p>${adminDetails.username} would like to add ${chatbotName} to the website.
    <p>Please follow the instructions to successfully deploy the chatbot on the website.</p>

    <h3>How to Add Tring Chatbot to Your Website</h3>

    <h4>1: Embed in HTML</h4>
    <p>Place the following code where you want the chatbot to appear on the website:</p>
    <pre>${formattedScript}
    </pre>
    <p>To display the chatbot as a chat bubble at the bottom right of the website:</p>
    <ol>
      <li>Copy the script above.</li>
      <li>Paste it just before the closing &lt;/body&gt; tag in the HTML.</li>
      <li>Once added, the chatbot will be successfully deployed.</li>
    </ol>

    <h4>2: For Shopify Websites</h4>
    <ol>
      <li>Go to Dashboard &gt; Side Nav Bar &gt; Shopify Admin &gt; Online Store &gt; Themes.</li>
      <li>Click Actions &gt; Edit Code on your live theme.</li>
      <li>Locate the theme.liquid file under Layout.</li>
      <li>Paste the chatbot script just before the closing &lt;/body&gt; tag.</li>
      <li>Save the changes.</li>
    </ol>

    <h4>3: For WordPress Websites</h4>
    <p>If you're using a custom theme:</p>
    <ol>
      <li>Go to WordPress Admin &gt; Appearance &gt; Theme File Editor.</li>
      <li>Open the footer.php file.</li>
      <li>Paste the chatbot script just before the closing &lt;/body&gt; tag.</li>
      <li>Click Update File to save.</li>
    </ol>

    <p>Kindly confirm the settings and click on the save button. The changes will take at least a minute to reflect on the website.</p>

    <p>Regards,<br>
    ${adminDetails.username},<br>
    ${orgDetails?.name},<br>
    ${adminDetails?.countryCode} ${adminDetails?.mobile}</p>
  </body>
</html>
`
}