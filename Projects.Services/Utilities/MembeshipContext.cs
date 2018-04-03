using Projects.Entities;
using Projects.Entities.Membership;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Services.Utilities
{
    public class MembershipContext
    {
        public IPrincipal Principal { get; set; }
        public tbl_user User { get; set; }
        public bool IsValid()
        {
            return Principal != null;
        }
    }
}
