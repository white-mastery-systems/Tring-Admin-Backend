export const chatbotScriptEmailTemplate = (adminName: string, chatbotName: string, script: string) => {
  const formattedScript = script
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

    console.log({ formattedScript })
  return `<!DOCTYPE html>
    <html>
       <body>
          <p>${adminName} would like to add ${chatbotName} to the website.Please follow the instructions below to successfully integrate the chatbot widget:</p>
      
          <h4>How to Add Tring Chatbot to Your Website</h4>
      
          <h4>Option 1: Embed in HTML</h4>
          <p>Place the following code where you want the chatbot to appear on the website:</p>
          <pre style="background:#f4f4f4;padding:10px;border:1px solid #ddd;">
          ${formattedScript}
          </pre>  
      
          <h4>Option 2: Add a Chat Bubble (Recommended)</h4>
          <p>To display the chatbot as a chat bubble at the bottom right of the website:</p>
          <ol>
              <li>Copy the script above.</li>
              <li>Paste it just before the closing <code>&lt;/body&gt;</code> tag in the HTML.</li>
          </ol>
          <p>Once added, the chatbot will be successfully deployed.</p>
      
          <p>Need help? Contact our support team.</p>
       </body>
    </html>`
}