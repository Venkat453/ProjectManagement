using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Library
{
    public class Email
    {
        public bool SendMail(string toList, string from, string fromdisplayname, string ccList, string subject, string body)
        {

            MailMessage message = new MailMessage();
            SmtpClient smtpClient = new SmtpClient();
            bool msg = false;
            try
            {
                message.From = new MailAddress(from, fromdisplayname);
                message.To.Add(toList);
                if (ccList != null && ccList != string.Empty)
                {
                    message.CC.Add(ccList);
                }
                message.Subject = subject;
                message.IsBodyHtml = true;
                message.Body = body;
                //mail.Attachments.Add(new Attachment("C:\\SomeFile.txt"));
                //mail.Attachments.Add(new Attachment("C:\\SomeZip.zip"));

                smtpClient.Host = Convert.ToString(ConfigurationManager.AppSettings["Host"]);
                smtpClient.Port = Convert.ToInt32(ConfigurationManager.AppSettings["Port"]);
                smtpClient.Credentials = new NetworkCredential(Convert.ToString(ConfigurationManager.AppSettings["Username"]), 
                    Convert.ToString(ConfigurationManager.AppSettings["Password"]));
                smtpClient.EnableSsl = true;
                //smtpClient.UseDefaultCredentials = false;
                //smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                smtpClient.Send(message);

                msg = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return msg;
        }
    }
}
