using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;

namespace RecordPlugin
{
    public class Plugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.Contains("email") && context.InputParameters.Contains("reason"))
            {
                var emailAddress = context.InputParameters["email"].ToString();
                var declineReason = context.InputParameters["reason"].ToString();

                var declineRecord = new Entity("InviteDecline")
                {
                    ["email"] = emailAddress,
                    ["reason"] = declineReason,
                    ["decline_date"] = DateTime.UtcNow
                };
                service.Create(declineRecord);
            }
            else
            {
                throw new InvalidPluginExecutionException("The parameters email and reason are required");
            }
        }
    }
}
